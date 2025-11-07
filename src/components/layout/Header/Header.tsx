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

// Define the props for the component
interface AppHeaderProps {
  layout?: 'main' | 'dashboard'; // 'main' is public, 'dashboard' is logged in
}

// Accept the 'layout' prop, defaulting to 'main'
const AppHeader: React.FC<AppHeaderProps> = ({ layout = 'main' }) => {
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
      width: 400, // Adjusted width
      onOk: () => {
        logout();
        navigate('/');
        messageApi.success('Logged out successfully.');
        setIsDropdownOpen(false);
      },
      onCancel: () => {
        setIsDropdownOpen(false);
      },
    });
  };

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user._id}`);
    }
    setIsDropdownOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSettingsClick = () => {
    navigate('/settings/account');
    setIsDropdownOpen(false);
  };

  const handleHelpClick = () => {
    navigate('/help');
    setIsDropdownOpen(false);
  };

  const handleDisplayClick = () => {
    navigate('/display-settings');
    setIsDropdownOpen(false);
  };

  const userDropdownOverlay = (
    <Card
      style={{
        width: 280,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '0',
      }}
      bodyStyle={{ padding: '0' }}
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

      {/* View Profile Button */}
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

      <Divider style={{ margin: '0 0 8px 0' }} />

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
      {modalContextHolder}
      {messageContextHolder}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          position: 'fixed',
          width: '100%',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Logo Section (Always visible) */}
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

        {/* Conditionally render the Menu */}
        {layout === 'main' && (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: ACTIVE_COLOR,
              },
              components: {
                Menu: {
                  itemSelectedColor: ACTIVE_COLOR,
                  itemHoverColor: ACTIVE_COLOR,
                  fontSize: 16, // Adjusted from 18px for better fit
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
        )}
        
        {/* If in dashboard, add a simple spacer to keep auth buttons to the right */}
        {layout === 'dashboard' && (
          <div style={{ flex: 1 }} />
        )}

        {/* Auth Buttons Section (Always visible, logic is auth-aware) */}
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
            <Dropdown
              overlay={userDropdownOverlay}
              placement="bottomRight"
              arrow
              trigger={['click']}
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
              dropdownRender={(menu) => (
                <div style={{ marginTop: '8px' }}>{menu}</div>
              )}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', border: '1px solid #ddd' }}
              />
            </Dropdown>
          ) : (
            <Space>
              <Button onClick={() => handleNavigate('/login')}>Log In</Button>
              <Button
                type="primary"
                onClick={() => handleNavigate('/signup')}
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

