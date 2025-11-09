import React, { useState } from 'react';
import { Layout, Menu, Grid, ConfigProvider } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  CustomerServiceOutlined, // For "Browse Sessions"
  UserOutlined, // For "My Sessions"
  TeamOutlined, // For "My Connections"
} from '@ant-design/icons';
import AppHeader from './Header/Header';

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    {
      key: '/my-sessions', // This is the user's "home"
      icon: <UserOutlined />,
      label: 'My Sessions',
    },
    {
      key: '/sessions', // This is for discovery
      icon: <CustomerServiceOutlined />,
      label: 'Browse Sessions',
    },
    {
      key: '/connections', // This is for the social graph
      icon: <TeamOutlined />,
      label: 'My Connections',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader layout="dashboard" />z

      <Layout style={{ marginTop: 64 }}> {/* Offset for the fixed header */}
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
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  // Increase vertical height of each menu item
                  itemHeight: 56,
                  // Add a small margin between items
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
                marginTop: '24px',
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
    </Layout>
  );
};

export default DashboardLayout;