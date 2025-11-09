import React, { useState, useEffect } from 'react';
import { List, Spin, Typography, Alert, Empty, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { userService } from '../../services/user.service';
import { TUser } from '../../types/user.types';
import AuthService from '../../services/auth.service';

const { Title, Text } = Typography;

type TFriend = Pick<TUser, '_id' | 'name' | 'email'>;

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<TFriend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = AuthService.getStoredUser();
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUserId) {
        setError('Please log in to view your connections.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await userService.getFriends(currentUserId);
        
        setFriends(response.data.friends); 

      } catch (err) {
        console.error('Failed to fetch friends:', err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load friends.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        My Friends
      </Title>

      <List
        dataSource={friends}
        grid={{
          gutter: 24,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        locale={{
          emptyText: (
            <Empty
              description={
                <Title level={4} type="secondary">
                  You've made no connections so far!
                </Title>
              }
            />
          ),
        }}
        renderItem={(friend) => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <Card.Meta
                avatar={
                  <Link to={`/profile/${friend._id}`}>
                    <Avatar icon={<UserOutlined />} size="large" />
                  </Link>
                }
                title={friend.name}
                description={
                  <Text type="secondary">{friend.email}</Text>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default FriendsList;