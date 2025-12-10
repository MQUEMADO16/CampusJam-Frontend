import React, { useState, useEffect } from 'react';
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
  Badge, // Added
  List,  // Added
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  RightOutlined,
  BellOutlined, // Added
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../../context/auth.context';

// Import Notification Services
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../../services/notification.service';

import logoSrc from '../../../assets/images/campus-jam-logo.png';

const { Header } = Layout;
const { Title, Text } = Typography;

const ACTIVE_COLOR = '#D10A50';

interface AppHeaderProps {
  layout?: 'main' | 'dashboard';
}

const AppHeader: React.FC<AppHeaderProps> = ({ layout = 'main' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  const logoDestination = user ? '/my-sessions' : '/';
  
  // --- Existing State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  // --- New Notification State ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- 1. Notification Polling Logic ---
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await getNotifications();
      setNotifications(res.data);
      const unread = res.data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  // --- 2. Notification Handlers ---
  const handleNotificationClick = async (item: any) => {
    if (!item.isRead) {
      await markNotificationRead(item._id);
      fetchNotifications();
    }
    setIsNotifOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    fetchNotifications();
  };

  // --- Existing Handlers ---
  const handleLogout = () => {
    modal.confirm({
      title: 'Log Out',
      content: 'Are you sure you want to log out?',
      okText: 'Log Out',
      cancelText: 'Cancel',
      width: 400,
      onOk: () => {
        navigate('/', {
          replace: true,
          state: {
            alert: { type: 'success', text: 'You have been logged out.' }
          }
        });
        setTimeout(() => {
          logout();
          messageApi.success('Logged out successfully.');
          setIsDropdownOpen(false);
        }, 50);
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

  // --- 3. Render Components (Notification Menu) ---
  const notificationMenu = (
    <Card
      style={{ width: 320, borderRadius: 8, padding: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Notifications</Text>
        {unreadCount > 0 && (
          <a onClick={handleMarkAllRead} style={{ fontSize: '12px', color: '#1677ff', cursor: 'pointer' }}>
            Mark all read
          </a>
        )}
      </div>
      
      <List
        dataSource={notifications.slice(0, 5)}
        renderItem={(item) => (
          <List.Item 
            onClick={() => handleNotificationClick(item)}
            style={{ 
              padding: '12px 16px', 
              cursor: 'pointer',
              background: item.isRead ? '#fff' : '#e6f7ff',
              transition: 'background 0.2s',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.sender?.avatarUrl} icon={<UserOutlined />} />}
              title={<Text style={{ fontSize: '13px' }}>{item.message}</Text>}
              description={<Text type="secondary" style={{ fontSize: '11px' }}>{new Date(item.createdAt).toLocaleDateString()}</Text>}
            />
          </List.Item>
        )}
        locale={{ emptyText: <div style={{ padding: '16px', textAlign: 'center' }}><Text type="secondary">No notifications</Text></div> }}
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      />
    </Card>
  );

  // --- Existing Render Components (User Menu) ---
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
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          padding: '0 24px'
        }}
      >
        <Link to={logoDestination} style={{ display: 'flex', alignItems: 'center' }}>
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
                  fontSize: 16,
                  itemPaddingInline: 24,
                },
              },
            }}
          >
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
        
        {layout === 'dashboard' && (
          <div style={{ flex: 1 }} />
        )}

        <div
          style={{
            minWidth: '150px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center', // Aligns bell and avatar
            gap: '24px'           // Spaces bell and avatar
          }}
        >
          {isLoading ? (
            <Spin />
          ) : user ? (
            <>
              {/* --- NEW: Notification Bell --- */}
              <Dropdown 
                overlay={notificationMenu} 
                trigger={['click']} 
                placement="bottomRight"
                open={isNotifOpen}
                onOpenChange={setIsNotifOpen}
                arrow
              >
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                    <BellOutlined style={{ fontSize: '22px', color: 'rgba(0,0,0,0.65)' }} />
                  </Badge>
                </div>
              </Dropdown>

              {/* Existing User Profile Avatar */}
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
            </>
          ) : (
            <Space>
              <Button onClick={() => handleNavigate('/login')}>Log In</Button>
              <Button
                type="primary"
                onClick={() => handleNavigate('/signup')}
                style={{
                  background: 'linear-gradient(to right, #D10A50, #402579)',
                  borderColor: 'transparent',
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