import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppFooter from './Footer/Footer';
import AppHeader from './Header/Header';


const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {/* Navbar here */}
      <AppHeader />


      <Content style={{ padding: '0 48px', marginTop: 64 }}>
        <div>
          <Outlet />
        </div>
      </Content>

      {/* Footer here */}
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;