import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
//import Navbar from './Navbar'; // Import Navbar here

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {/* Navbar here */}

      <Content style={{ padding: '0 48px', marginTop: 64 }}>
        <div>
          <Outlet />
        </div>
      </Content>

      {/* Footer here */}
    </Layout>
  );
};

export default MainLayout;