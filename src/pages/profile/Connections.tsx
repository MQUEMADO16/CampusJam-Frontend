import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Avatar,
  Button,
  List,
  Input,
  Spin,
  Alert,
  Empty,
  Divider,
  message,
} from 'antd';
import { UserOutlined, MessageOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { useAuth } from '../../context/auth.context';
import { userService } from '../../services/user.service';
import { TUser } from '../../types/user.types';

const { Title, Text } = Typography;
const { Search } = Input;

type Friend = Pick<TUser, '_id' | 'name' | 'email'>;

const Connections: React.FC = () => {
  const { user: currentUser, isLoading: authIsLoading, login, token } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]); // Starts as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingFriendId, setLoadingFriendId] = useState<string | null>(null);

  useEffect(() => {
    if (authIsLoading) {
      setIsLoading(false); 
      return;
    }
    
    if (!currentUser) {
      setIsLoading(false);
      setError('You must be logged in to view your network.');
      return;
    }

    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await userService.getFriends(currentUser._id);
        setFriends(response.data.friends || []); 

      } catch (err) {
        console.error('Failed to fetch friends:', err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load your network.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [currentUser, authIsLoading]); // Re-run if auth state changes

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    if (!currentUser) return;
    setLoadingFriendId(friendId); // Set loading for this specific button
    try {
      // Call the service
      const response = await userService.removeFriend(currentUser._id, friendId);
      
      // Update the AuthContext
      if (response.data.user && token) {
        login(response.data.user, token);
      }
      
      // Update the local state to remove the friend from the list
      setFriends((prevFriends) => prevFriends.filter(f => f._id !== friendId));
      
      message.success(`You are no longer following ${friendName}`);
    } catch (err) {
      message.error('Failed to remove friend. Please try again.');
    } finally {
      setLoadingFriendId(null); // Clear loading state
    }
  };

  if (authIsLoading || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const onSearch = (value: string) => {
    console.log('Search for:', value);
    // TODO: Implement user search logic
  };

  return (
    <Card style={{ borderRadius: '16px' }}>
      <Title level={2}>My Connections</Title>
      <Text type="secondary">Connect with other musicians on campus.</Text>
      
      <Search
        placeholder="Find other musicians by name or instrument..."
        onSearch={onSearch}
        enterButton
        size="large"
        style={{ margin: '24px 0' }}
      />
      
      <Divider />
      
      <Title level={4}>My Friends ({friends.length})</Title>
      
      <List
        itemLayout="horizontal"
        dataSource={friends}
        locale={{
          emptyText: <Empty description="You haven't added any friends yet." />
        }}
        renderItem={(friend) => (
          <List.Item
            actions={[
              <Button type="primary" icon={<MessageOutlined />}>
                Message
              </Button>,
              <Button 
                danger 
                icon={<UserDeleteOutlined />}
                onClick={() => handleRemoveFriend(friend._id, friend.name)}
                loading={loadingFriendId === friend._id} // Set loading on this button
              >
                Remove
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={<Link to={`/profile/${friend._id}`}>{friend.name}</Link>}
              description={friend.email}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Connections;
