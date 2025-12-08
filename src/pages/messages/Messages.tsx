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
                padding: '16px',
                borderRadius: '8px',
              }}
              className="message-list-item"
              onClick={() => navigate(`/messages/${item.otherUser._id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={isUnread} offset={[-5, 5]} color="blue">
                    <Avatar size={48} icon={<UserOutlined />} />
                  </Badge>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{item.otherUser.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(item.lastMessage.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                }
                description={
                  <Text 
                    type={isUnread ? undefined : 'secondary'} 
                    strong={isUnread}
                    ellipsis 
                    style={{ maxWidth: '80%' }}
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