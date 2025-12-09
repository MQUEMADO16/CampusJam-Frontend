import React, { useState, useEffect } from 'react';
import {
  List,
  Avatar,
  Typography,
  Input,
  Card,
  Spin,
  Alert,
  Empty,
  Badge,
} from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';

// Import service
import { messageService } from '../../services/message.service';
import { useAuth } from '../../context/auth.context';
import { useSocket } from '../../context/socket.context';

const { Title, Text } = Typography;

// Define the shape of a conversation item based on your backend aggregation
type TConversation = {
  otherUser: {
    _id: string;
    name: string;
    email: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    read: boolean;
    sender: string;
  };
};

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<TConversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<TConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket(); // Use global socket

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await messageService.getConversations();
        // The service returns { message: string, conversations: [] }
        setConversations(response.data.conversations);
        setFilteredConversations(response.data.conversations);

      } catch (err) {
        console.error('Failed to load conversations:', err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load messages.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleInboxMessage = (newMessage: any) => {
      setConversations((prev) => {
        const senderId = typeof newMessage.sender === 'string' 
          ? newMessage.sender 
          : newMessage.sender._id;

        // Find if we already have a conversation with this sender
        const existingIndex = prev.findIndex(c => c.otherUser._id === senderId);
        
        let updatedConvos = [...prev];

        if (existingIndex !== -1) {
          // Update existing conversation
          const conversation = { ...updatedConvos[existingIndex] };
          
          // Update last message
          conversation.lastMessage = {
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            read: false, // New incoming messages are unread
            sender: senderId
          };

          // Remove from old position and move to top
          updatedConvos.splice(existingIndex, 1);
          updatedConvos.unshift(conversation);
        } else {
          // New conversation
          // newMessage.sender should be a populated user object from the backend
          const senderObj = newMessage.sender; 
          
          if (typeof senderObj === 'object') {
            const newConversation: TConversation = {
              otherUser: {
                _id: senderObj._id,
                name: senderObj.name,
                email: senderObj.email
              },
              lastMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                read: false,
                sender: senderId
              }
            };
            updatedConvos.unshift(newConversation);
          }
        }
        
        return updatedConvos;
      });
    };

    socket.on('receive_message', handleInboxMessage);

    return () => {
      socket.off('receive_message', handleInboxMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!searchText) {
      setFilteredConversations(conversations);
      return;
    }

    const lowerSearch = searchText.toLowerCase();
    const filtered = conversations.filter((convo) =>
      convo.otherUser.name.toLowerCase().includes(lowerSearch)
    );
    setFilteredConversations(filtered);
  }, [searchText, conversations]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <Card style={{ borderRadius: '16px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
          Messages
        </Title>
        <Input
          placeholder="Search conversations by name..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <List
        itemLayout="horizontal"
        dataSource={filteredConversations}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No messages yet. Visit a profile to start chatting!"
            />
          ),
        }}
        renderItem={(item) => {
          // Check if the last message was sent by the current user
          const isOwnMessage = item.lastMessage.sender === user?._id;
          
          // Determine if the message is "unread"
          const isUnread = !isOwnMessage && !item.lastMessage.read;

          return (
            <List.Item
              actions={[
                <Link to={`/messages/${item.otherUser._id}`} key="reply">
                  Reply
                </Link>
              ]}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                padding: '20px 24px', // Increased padding for larger look
                borderRadius: '16px', // Increased border radius
                backgroundColor: isUnread ? '#f0f5ff' : 'transparent', // Light blue background if unread
              }}
              className="message-list-item"
              onClick={() => navigate(`/messages/${item.otherUser._id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isUnread ? '#e6f7ff' : '#fafafa')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isUnread ? '#f0f5ff' : 'transparent')}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={isUnread} offset={[-5, 5]} color="blue">
                    <Avatar size={48} icon={<UserOutlined />} />
                  </Badge>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong={isUnread} style={{ fontSize: '16px' }}>{item.otherUser.name}</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {new Date(item.lastMessage.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                }
                description={
                  <Text 
                    type={isUnread ? undefined : 'secondary'} 
                    strong={isUnread}
                    ellipsis 
                    style={{ maxWidth: '80%', fontSize: '14px' }}
                  >
                    {isOwnMessage ? 'You: ' : ''}
                    {item.lastMessage.content}
                  </Text>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default Messages;