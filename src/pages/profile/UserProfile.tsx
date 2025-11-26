import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tag,
  Divider,
  Row,
  Col,
  Space,
  Spin,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { userService } from '../../services/user.service';
import { useAuth } from '../../context/auth.context';
import { TUser } from '../../types';

import AccessDenied from '../AccessDenied';
import NotFound from '../NotFound';

const { Title, Text, Paragraph } = Typography;

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const { user: currentUser, isLoading: authIsLoading, login, token } = useAuth();
  
  const [profileUser, setProfileUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);

  const [isFriend, setIsFriend] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setErrorType('404'); 
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setErrorType(null);
        
        const response = await userService.getUserById(userId);
        setProfileUser(response.data);

      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErrorType('404');
          } else {
            setErrorType('403');
          }
        } else {
          setErrorType('403');
        }
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    // Run only after both users have loaded
    if (currentUser && profileUser) {
      // Check if the profileUser's ID is in the currentUser's following list
      const isFollowing = currentUser.connections.following?.includes(profileUser._id);
      setIsFriend(isFollowing);
    }
  }, [currentUser, profileUser]);

  const handleAddFriend = async () => {
    if (!currentUser || !profileUser) return;
    setFriendLoading(true);
    try {
      const response = await userService.addFriend(currentUser._id, profileUser._id);
      // Update the AuthContext with the new user object (which has updated 'following' array)
      if (response.data.user && token) {
        login(response.data.user, token);
      }
      setIsFriend(true);
      message.success(`You are now following ${profileUser.name}`);
    } catch (err) {
      message.error('Failed to add friend. Please try again.');
    } finally {
      setFriendLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!currentUser || !profileUser) return;
    setFriendLoading(true);
    try {
      const response = await userService.removeFriend(currentUser._id, profileUser._id);
      // Update the AuthContext
      if (response.data.user && token) {
        login(response.data.user, token);
      }
      setIsFriend(false);
      message.success(`You are no longer following ${profileUser.name}`);
    } catch (err) {
      message.error('Failed to remove friend. Please try again.');
    } finally {
      setFriendLoading(false);
    }
  };

  if (authIsLoading || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (errorType === '404') {
    return <NotFound />;
  }
  if (errorType === '403') {
    return <AccessDenied />;
  }

  if (!profileUser) {
    return <NotFound />;
  }

  const isOwner = currentUser?._id === profileUser._id;

  return (
    <Row justify="center" style={{ padding: '24px 0' }}>
      <Col xs={24} md={20} lg={16} xl={12}>
        <Card style={{ width: '100%', borderRadius: '16px' }}>

        <div style={{ marginBottom: '16px' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
          
          {/* --- Profile Header --- */}
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm="auto">
              <Avatar size={128} icon={<UserOutlined />} />
            </Col>

            <Col
              xs={24}
              sm="auto"
              flex="auto"
              style={{
                display: 'flex',
                justifyContent: 'space-between', // Pushes children to ends
                alignItems: 'center',           // Vertically centers them
                flexWrap: 'wrap',                // Allows button to wrap on small screens
                gap: '16px',                     // Adds a gap
              }}
            >
              <div>
                <Title level={2} style={{ marginBottom: 0 }}>
                  {profileUser.name}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }} ellipsis>
                  {profileUser.email}
                </Text>
              </div>

              <div>
                {isOwner ? (
                  // User is viewing their own profile
                  <Link to="/settings/profile">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                    >
                      Edit Profile
                    </Button>
                  </Link>
                ) : currentUser ? ( 
                  // User is logged in AND viewing someone else's profile
                  isFriend ? (
                    <Button
                      danger
                      icon={<UserDeleteOutlined />}
                      onClick={handleRemoveFriend}
                      loading={friendLoading}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      onClick={handleAddFriend}
                      loading={friendLoading}
                    >
                      Follow
                    </Button>
                  )
                ) : null /* User is logged out, show no button */ }
              </div>
            </Col>
          </Row>

          <Divider />

          {/* --- Bio Section --- */}
          <Title level={4}>About Me</Title>
          <Paragraph>{profileUser.profile.bio || 'No bio provided.'}</Paragraph>

          <Divider />

          {/* --- Details Section --- */}
          <Row gutter={[32, 24]}>
            {/* Instruments */}
            <Col xs={24} md={12}>
              <Title level={4}>
                Instruments
              </Title>
              <Space wrap size={[0, 8]}>
                {profileUser.profile.instruments.length > 0 ? (
                  profileUser.profile.instruments.map((instrument) => (
                    <Tag
                      key={instrument}
                      color="blue"
                      style={{ fontSize: 14, padding: '5px 10px' }}
                    >
                      {instrument}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary">No instruments listed.</Text>
                )}
              </Space>
            </Col>

            {/* Genres */}
            <Col xs={24} md={12}>
              <Title level={4}>
                Genres
              </Title>
              <Space wrap size={[0, 8]}>
                {profileUser.profile.genres.length > 0 ? (
                  profileUser.profile.genres.map((genre) => (
                    <Tag
                      key={genre}
                      color="purple"
                      style={{ fontSize: 14, padding: '5px 10px' }}
                    >
                      {genre}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary">No genres listed.</Text>
                )}
              </Space>
            </Col>

            {/* Skill Level */}
            <Col xs={24} md={12}>
              <Title level={4}>Skill Level</Title>
              <Tag
                color="green"
                style={{ fontSize: 14, padding: '5px 10px' }}
              >
                {profileUser.profile.skillLevel}
              </Tag>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default UserProfile;