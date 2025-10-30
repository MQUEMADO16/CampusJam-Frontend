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
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
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
  
  // Get the currently logged-in user
  const { user: currentUser, isLoading: authIsLoading } = useAuth();
  
  // State for the user whose profile we are viewing
  const [profileUser, setProfileUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to handle errors (404 Not Found, 403 Forbidden)
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);

  useEffect(() => {
    if (!userId) {
      setErrorType('404'); // No ID in URL, definitely not found
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setErrorType(null);
        
        // Call the service to get the profile data
        const response = await userService.getUserById(userId);
        setProfileUser(response.data);

      } catch (error) {
        // Handle API errors
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErrorType('404');
          } else {
            // For any other error (e.g., 403, 500), show Access Denied
            setErrorType('403');
          }
        } else {
          // Generic error
          setErrorType('403');
        }
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]); // Re-run this effect if the userId in the URL changes

  // Show main loading spinner while auth or data is loading
  if (authIsLoading || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Handle errors
  if (errorType === '404') {
    return <NotFound />;
  }
  if (errorType === '403') {
    return <AccessDenied />;
  }

  // Handle if user is null (shouldn't happen if logic is correct, but good safety check)
  if (!profileUser) {
    return <NotFound />;
  }

  // Check if the logged-in user is the owner of this profile
  const isOwner = currentUser?._id === profileUser._id;

  // Render the profile page
  return (
    <Row justify="center" style={{ padding: '24px 0' }}>
      <Col xs={24} md={20} lg={16} xl={12}>
        <Card style={{ width: '100%', borderRadius: '16px' }}>
          {/* --- Profile Header --- */}
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm="auto">
              <Avatar size={128} icon={<UserOutlined />} />
            </Col>
            <Col xs={24} sm="auto" flex="auto">
              {/* Use the fetched profileUser data */}
              <Title level={2} style={{ marginBottom: 0 }}>
                {profileUser.name}
              </Title>
              <Space direction="horizontal" size={18} wrap>
                <Text type="secondary" style={{ fontSize: '16px' }} ellipsis>
                  {profileUser.email}
                </Text>
                
                {/* --- Conditional Edit Button --- */}
                {isOwner && (
                  <Link to="/settings/profile">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                    >
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </Space>
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