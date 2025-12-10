import React, { useState, useEffect } from 'react';
import { Layout, Menu, Grid, ConfigProvider, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  CustomerServiceOutlined, 
  UserOutlined, 
  TeamOutlined, 
  PlusOutlined, 
  MessageOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import AppHeader from './Header/Header';
import WelcomeModal from '../features/WelcomeModal'; 

// 1. Import useAuth to get the current user's ID
import { useAuth } from '../../context/auth.context';

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const PURPLE_LIGHT = '#59428a';   // soft top gradient
const PURPLE_DARK = '#3b275f';    // dark bottom gradient
const PURPLE_ACCENT = '#7f4de0';  // for hovers, highlights
const BRAND_PINK = '#D10A50';     // accent color

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  // 2. Get the user from context
  const { user } = useAuth();

  const [showWelcome, setShowWelcome] = useState(false);

  // 3. Updated Effect: Check strictly using the User's ID
  useEffect(() => {
    // Only proceed if we have a user (they are logged in)
    if (user && user._id) {
      const key = `hasSeenWelcome_${user._id}`;
      const hasSeen = localStorage.getItem(key);
      
      // If this specific user hasn't seen it, show it
      if (!hasSeen) {
        setShowWelcome(true);
      }
    }
  }, [user]); // Re-run this check whenever the user changes

  // 4. Updated Close Handler: Save the key with the User's ID
  const handleCloseWelcome = () => {
    if (user && user._id) {
      localStorage.setItem(`hasSeenWelcome_${user._id}`, 'true');
    }
    setShowWelcome(false);
  };

  const sidebarItems = [
    {
      key: '/my-sessions',
      icon: <UserOutlined />,
      label: 'My Sessions',
    },
    {
      key: '/sessions',
      icon: <CustomerServiceOutlined />,
      label: 'Browse Sessions',
    },
    {
      key: '/connections',
      icon: <TeamOutlined />,
      label: 'My Connections',
    },
    {
      key: '/messages', 
      icon: <MessageOutlined />,
      label: 'Messages',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader layout="dashboard" />

      <Layout style={{ marginTop: 64 }}>
        <Sider
          theme="dark"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={screens.lg ? 80 : 0}
          width={220}
          trigger={
            <div
              style={{
                background: '#3e2963',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#fff',
              }}
            >
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </div>
          }
          style={{
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
            zIndex: 1,
            background: `linear-gradient(to bottom, ${PURPLE_LIGHT}, ${PURPLE_DARK})`,
            boxShadow: '2px 0 8px rgba(29, 35, 41, 0.05)',
          }}
        >
          <div style={{ padding: '24px 16px 16px 16px' }}>
            <Button
              type="primary"
              block
              icon={<PlusOutlined />}
              onClick={() => navigate('/sessions/create')}
              style={{
                background: `linear-gradient(135deg, ${BRAND_PINK}, ${PURPLE_ACCENT})`,
                border: 'none',
                fontWeight: 600,
                color: '#fff',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
              }}
            >
              {!collapsed && 'Create Session'}
            </Button>
          </div>

          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemHeight: 50,
                  itemMarginBlock: 6,
                  darkItemBg: 'transparent',
                  darkItemColor: 'rgba(255,255,255,0.75)',
                  darkItemHoverColor: '#fff',
                  darkItemSelectedColor: '#fff',
                  darkItemSelectedBg: 'rgb(224, 58, 144,0.75)',
                  horizontalItemHoverBg: PURPLE_ACCENT,
                },
              },
            }}
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={sidebarItems}
              style={{
                marginTop: 8,
                background: 'transparent',
                borderRight: 'none',
              }}
            />
          </ConfigProvider>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? (screens.lg ? 80 : 0) : 220,
            transition: 'margin-left 0.2s',
          }}
        >
          <Content style={{ padding: '24px 48px 0' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome} 
      />

    </Layout>
  );
};

export default DashboardLayout;