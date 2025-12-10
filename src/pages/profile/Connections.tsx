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
  Tabs,
  Tag,
  Space,
  message,
} from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { useAuth } from '../../context/auth.context';
import { userService } from '../../services/user.service';
import { TUser } from '../../types';

const { Title, Text } = Typography;
const { Search } = Input;

type Friend = TUser; 

const Connections: React.FC = () => {
  const { user: currentUser, isLoading: authIsLoading, login, token } = useAuth();
  const navigate = useNavigate();

  // State for "My Network" Tab
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // State for "Find Musicians" Tab 
  const [searchResults, setSearchResults] = useState<TUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHasRun, setSearchHasRun] = useState(false);

  useEffect(() => {
    if (authIsLoading) return;
    
    if (!currentUser) {
      setLoadingFriends(false);
      setFriendsError('You must be logged in to view your network.');
      return;
    }

    const fetchFriends = async () => {
      try {
        setLoadingFriends(true);
        setFriendsError(null);
        
        const response = await userService.getFriends(currentUser._id);
        setFriends((response.data.friends as unknown as Friend[]) || []); 

      } catch (err) {
        console.error('Failed to fetch friends:', err);
        if (isAxiosError(err)) {
          setFriendsError(err.response?.data?.message || 'Failed to load your network.');
        } else {
          setFriendsError('An unknown error occurred.');
        }
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [currentUser, authIsLoading]);

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    if (!currentUser) return;
    setActionLoadingId(friendId);
    try {
      const response = await userService.removeFriend(currentUser._id, friendId);
      
      if (response.data.user && token) {
        login(response.data.user, token);
      }
      
      setFriends((prev) => prev.filter(f => f._id !== friendId));
      
      message.success(`You are no longer following ${friendName}`);
    } catch (err) {
      message.error('Failed to remove connection.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddFriend = async (targetUser: TUser) => {
    if (!currentUser) return;
    setActionLoadingId(targetUser._id);
    try {
      const response = await userService.addFriend(currentUser._id, targetUser._id);
      
      if (response.data.user && token) {
        login(response.data.user, token);
      }

      setFriends((prev) => [...prev, targetUser]);
      message.success(`You are now following ${targetUser.name}`);
      
    } catch (err) {
      message.error('Failed to follow user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const onGlobalSearch = async (value: string) => {
    if (!value.trim()) return;
    setIsSearching(true);
    setSearchHasRun(true);
    try {
      const response = await userService.searchUser(value);
      const filtered = response.data.filter(u => u._id !== currentUser?._id);
      setSearchResults(filtered);
    } catch (err) {
      message.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const isAlreadyFriend = (userId: string) => {
    return friends.some(f => f._id === userId);
  };

  if (authIsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const myNetworkContent = (
    <>
      {friendsError && <Alert message={friendsError} type="error" showIcon style={{ marginBottom: 16 }} />}
      
      <List
        loading={loadingFriends}
        itemLayout="horizontal"
        dataSource={friends}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  You haven't followed anyone yet. <br />
                  Switch to the <b>Find Musicians</b> tab to discover people!
                </span>
              }
            />
          )
        }}
        renderItem={(friend) => (
          <List.Item
            actions={[
              <Button 
                key="message"
                type="primary" 
                icon={<MessageOutlined />}
                onClick={() => navigate(`/messages/${friend._id}`)}
              >
                Message
              </Button>,
              <Button 
                key="remove"
                danger 
                icon={<UserDeleteOutlined />}
                onClick={() => handleRemoveFriend(friend._id, friend.name)}
                loading={actionLoadingId === friend._id}
              >
                Unfollow
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar size={48} icon={<UserOutlined />} />}
              title={<Link to={`/profile/${friend._id}`} style={{ fontSize: '1.1rem' }}>{friend.name}</Link>}
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{friend.email}</Text>
                  {friend.profile?.instruments && friend.profile.instruments.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      {friend.profile.instruments.slice(0, 3).map(inst => (
                        <Tag key={inst} style={{ fontSize: 10 }}>{inst}</Tag>
                      ))}
                    </div>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
  
  const findMusiciansContent = (
    <div style={{ marginTop: 16 }}>
      <Search
        placeholder="Search for musicians by name (e.g. 'John')..."
        onSearch={onGlobalSearch}
        enterButton={<Button icon={<SearchOutlined />}>Search</Button>}
        size="large"
        loading={isSearching}
        style={{ marginBottom: 32, maxWidth: 600 }}
      />

      <List
        loading={isSearching}
        itemLayout="horizontal"
        dataSource={searchResults}
        locale={{
          emptyText: searchHasRun ? <Empty description="No musicians found matching that name." /> : <Empty description="Enter a name to start searching." />
        }}
        renderItem={(user) => {
          const alreadyFriend = isAlreadyFriend(user._id);
          return (
            <List.Item
              actions={[
                <Button 
                  key="message"
                  type="primary" // Keep default style to not distract from primary 'Follow'
                  icon={<MessageOutlined />}
                  onClick={() => navigate(`/messages/${user._id}`)}
                >
                  Message
                </Button>,
                alreadyFriend ? (
                  <Button disabled>Following</Button>
                ) : (
                  <Button
                    type="primary"
                    ghost
                    icon={<UserAddOutlined />}
                    onClick={() => handleAddFriend(user)}
                    loading={actionLoadingId === user._id}
                  >
                    Follow
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<Link to={`/profile/${user._id}`}>{user.name}</Link>}
                description={
                  <Space wrap>
                    <Tag color="blue">{user.profile?.skillLevel || 'Musician'}</Tag>
                    {user.profile?.instruments?.map(inst => (
                      <Tag key={inst}>{inst}</Tag>
                    ))}
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );

  return (
    <Card style={{ borderRadius: '16px', minHeight: '80vh' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Connections</Title>
      
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            key: '1',
            label: `My Network (${friends.length})`,
            children: myNetworkContent,
          },
          {
            key: '2',
            label: 'Find Musicians',
            children: findMusiciansContent,
          },
        ]}
      />
    </Card>
  );
};

export default Connections;