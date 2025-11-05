import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  ConfigProvider,
  Dropdown,
  Avatar,
  Spin,
  Card,
  Divider,
  Modal,
  message,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined, // For Settings & Privacy
  QuestionCircleOutlined, // For Help & Support
  BulbOutlined, // For Display & Accessibility (or another appropriate icon)
  RightOutlined, // For the arrow icon on menu items
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../../context/auth.context';

import logoSrc from '../../../assets/images/campus-jam-logo.png';

const { Header } = Layout;
const { Title, Text } = Typography;

const ACTIVE_COLOR = '#D10A50';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const handleLogout = () => {
    modal.confirm({
      title: 'Log Out',
      content: 'Are you sure you want to log out?',
      okText: 'Log Out',
      cancelText: 'Cancel',
      width: 500,
      onOk: () => {
        // This runs if the user clicks "OK"
        logout();
        navigate('/'); // Navigate to home after logout
        messageApi.success('Logged out successfully.'); // Use the messageApi
        setIsDropdownOpen(false); // Close dropdown AFTER action
      },
      onCancel: () => {
        // Optional: Do something if they cancel
        setIsDropdownOpen(false); // Close dropdown AFTER action
      },
    });
  };

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user._id}`);
    }
    setIsDropdownOpen(false); // Close dropdown
  };

  // This handles navigation for both Menu and Buttons
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Placeholder for future navigation
  const handleSettingsClick = () => {
    navigate('/settings/account'); // Example path
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleHelpClick = () => {
    navigate('/help'); // Example path
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleDisplayClick = () => {
    navigate('/display-settings'); // Example path
    setIsDropdownOpen(false); // Close dropdown
  };

  const userDropdownOverlay = (
    <Card
      style={{
        width: 280, // Fixed width for the card
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '0', // Remove default card padding if internal elements manage it
      }}
      bodyStyle={{ padding: '0' }} // Remove body padding too
    >
      {/* User Info Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          paddingBottom: '12px',
        }}
      >
        <Avatar size={48} icon={<UserOutlined />} />
        <Text strong style={{ marginLeft: '12px', fontSize: '1rem' }}>
          {user?.name}
        </Text>
      </div>

      {/* View Profile Button (matches image) */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        <Button
          type="default"
          onClick={handleProfileClick}
          icon={<ProfileOutlined />}
          style={{ width: '100%', textAlign: 'left', borderRadius: 6 }}
        >
          View Profile
        </Button>
      </div>

      <Divider style={{ margin: '0 0 8px 0' }} /> {/* Separator */}

      {/* Menu Items */}
      <Space
        direction="vertical"
        style={{ width: '100%', padding: '0 0 8px 0' }}
        size={0}
      >
        {[
          {
            key: 'settings',
            label: 'Settings & Privacy',
            icon: <SettingOutlined />,
            onClick: handleSettingsClick,
          },
          {
            key: 'help',
            label: 'Help & Support',
            icon: <QuestionCircleOutlined />,
            onClick: handleHelpClick,
          },
          {
            key: 'display',
            label: 'Display & Accessibility',
            icon: <BulbOutlined />,
            onClick: handleDisplayClick,
          },
          {
            key: 'logout',
            label: 'Log Out',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
          },
        ].map((item) => (
          <div
            key={item.key}
            onClick={item.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              cursor: 'pointer',
              // Hover effect
              transition: 'background-color 0.2s',
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '1rem' }}>
              {item.icon}
            </span>
            <Text style={{ flexGrow: 1, fontSize: '0.9rem' }}>
              {item.label}
            </Text>
            <RightOutlined style={{ fontSize: '0.8rem', color: '#ccc' }} />
          </div>
        ))}
      </Space>
    </Card>
  );

  return (
    <>
      {/* Render the context holders. They are invisible. */}
      {modalContextHolder}
      {messageContextHolder}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          position: 'fixed', // Makes it stick to the top
          width: '100%',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Logo Section */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.75rem', marginRight: '8px' }}>
            <img
              src={logoSrc}
              alt="CampusJam Logo"
              style={{ height: '32px', marginLeft: '8px', marginTop: '24px' }}
            />
          </span>
          <Title
            level={4}
            style={{
              margin: 0,
              background: 'linear-gradient(to right, #D10A50, #402579)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CampusJam
          </Title>
        </Link>

        <ConfigProvider
          theme={{
            token: {
              // This will change the accent color (like the bottom border)
              colorPrimary: ACTIVE_COLOR,
            },
            components: {
              Menu: {
                itemSelectedColor: ACTIVE_COLOR,
                itemHoverColor: ACTIVE_COLOR,
                fontSize: 18,
                itemPaddingInline: 24,
              },
            },
          }}
        >
          {/* Navigation Menu */}
          <Menu
            mode="horizontal"
            onClick={({ key }) => handleNavigate(key)}
            selectedKeys={[location.pathname]}
            style={{ flex: 1, justifyContent: 'center', borderBottom: 'none' }}
            items={[
              { key: '/', label: 'Home' },
              { key: '/about', label: 'About' },
              { key: '/contact', label: 'Contact' },
              { key: '/pricing', label: 'Pricing' },
            ]}
          />
        </ConfigProvider>

        {/* Auth Buttons Section */}
        <div
          style={{
            minWidth: '150px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {isLoading ? (
            <Spin />
          ) : user ? (
            // --- Logged In State ---
            <Dropdown
              overlay={userDropdownOverlay} // Use the custom overlay content
              placement="bottomRight"
              arrow
              trigger={['click']}
              // Control the open state
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
              dropdownRender={(menu) => (
                <div style={{ marginTop: '8px' }}>
                  {menu}
                </div>
              )}
            >
              {/* The Avatar itself. Removed green dot for simplicity, can add if needed. */}
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          ) : (
            // --- Logged Out State ---
            <Space>
              <Button onClick={() => handleNavigate('/login')}>Log In</Button>
              <Button
                type="primary"
                onClick={() => handleNavigate('/signup')}
                style={{
                  background: 'linear-gradient(to right, #D10A50, #402579)',
                }}
              >
                Sign Up
              </Button>
            </Space>
          )}
        </div>
      </Header>
    </>
  );
};

export default AppHeader;

