import React, { useState, useEffect } from 'react'; // 1. Added useEffect
import { Layout, Menu, Grid, ConfigProvider, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  CustomerServiceOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import AppHeader from './Header/Header';


import WelcomeModal from '../features/WelcomeModal'; 

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

 
  const [showWelcome, setShowWelcome] = useState(false);

 
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

 
  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
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
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader layout="dashboard" />

      <Layout style={{ marginTop: 64 }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={screens.lg ? 80 : 0}
          style={{
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
            zIndex: 1,
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <div style={{ padding: '16px' }}>
            <Button
              type="primary"
              block
              icon={<PlusOutlined />}
              onClick={() => navigate('/sessions/create')}
              style={{
                background: 'linear-gradient(to right, #D10A50, #402579)',
                borderColor: 'transparent',
                fontWeight: 600,
                overflow: 'hidden',
              }}
            >
              {!collapsed && 'Create Session'}
            </Button>
          </div>

          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemHeight: 56,
                  itemMarginBlock: 8,
                },
              },
            }}
          >
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={sidebarItems}
              style={{
                marginTop: '0px',
                borderRight: 'none',
              }}
            />
          </ConfigProvider>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? (screens.lg ? 80 : 0) : 200,
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