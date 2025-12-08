import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Space,
} from 'antd';
import { SendOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

// Import services and context
import { useAuth } from '../../context/auth.context';
import { messageService } from '../../services/message.service';
import { userService } from '../../services/user.service';
import { TMessage, TUser } from '../../types';

const { Title, Text } = Typography;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px); // Adjust based on header/padding
  max-height: 800px;
`;

const MessagesArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 85%; /* Increased width from 70% */
  padding: 12px 20px; /* Increased padding */
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  position: relative;
  word-wrap: break-word;

  // Conditional styling based on who sent it
  align-self: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isOwn ? '#D10A50' : '#ffffff')}; // Brand color or white
  color: ${(props) => (props.isOwn ? '#ffffff' : '#000000')};
  border: ${(props) => (props.isOwn ? 'none' : '1px solid #e0e0e0')};
  
  // Specific corner rounding
  border-bottom-right-radius: ${(props) => (props.isOwn ? '4px' : '16px')};
  border-bottom-left-radius: ${(props) => (props.isOwn ? '16px' : '4px')};
`;

const Timestamp = styled.div<{ isOwn: boolean }>`
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 4px;
  text-align: ${(props) => (props.isOwn ? 'right' : 'left')};
  padding: 0 4px;
`;

const Chat: React.FC = () => {
  const { userId: otherUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [otherUser, setOtherUser] = useState<TUser | null>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!otherUserId || !currentUser) return;

      setIsLoading(true);
      setError(null);

      try {
        const [userResponse, messagesResponse] = await Promise.all([
          userService.getUserById(otherUserId),
          messageService.getDirectMessages(otherUserId),
        ]);

        setOtherUser(userResponse.data);
        setMessages(messagesResponse.data.messages);
      } catch (err) {
        console.error('Failed to load chat:', err);
        setError('Failed to load conversation.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [otherUserId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!newMessage.trim() || !otherUserId) return;

    const contentToSend = newMessage;
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await messageService.sendDirectMessage({
        recipientId: otherUserId,
        content: contentToSend,
      });

      setMessages((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setNewMessage(contentToSend); 
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !otherUser) {
    return <Alert message="Error" description={error || 'User not found'} type="error" showIcon />;
  }

  return (
    <Card style={{ borderRadius: '16px', height: '100%', minHeight: '80vh' }}>
      <ChatContainer>
        
        {/* --- Header --- */}
        <div style={{ marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          <Row align="middle" gutter={16}>
            <Col>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/messages')} 
              />
            </Col>
            <Col>
              <Avatar size={40} icon={<UserOutlined />} />
            </Col>
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                {otherUser.name}
              </Title>
              {otherUser.profile?.skillLevel && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {otherUser.profile.skillLevel} Musician
                </Text>
              )}
            </Col>
          </Row>
        </div>

        {/* --- Messages List --- */}
        <MessagesArea>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <Text type="secondary">No messages yet. Say hi!</Text>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
              const isOwn = senderId === currentUser?._id;

              return (
                <div key={msg._id} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
                  <MessageBubble isOwn={isOwn}>
                    {msg.content}
                  </MessageBubble>
                  <Timestamp isOwn={isOwn}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Timestamp>
                </div>
              );
            })
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </MessagesArea>

        {/* --- Input Area --- */}
        <div style={{ marginTop: 'auto' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder={`Message ${otherUser.name.split(' ')[0]}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleKeyPress}
              size="large"
              disabled={isSending}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              size="large"
              onClick={handleSend}
              loading={isSending}
              style={{
                background: 'linear-gradient(to right, #D10A50, #402579)',
                borderColor: 'transparent',
              }}
            >
              Send
            </Button>
          </Space.Compact>
        </div>

      </ChatContainer>
    </Card>
  );
};

export default Chat;