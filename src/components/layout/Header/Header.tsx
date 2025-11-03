import React from 'react';
import { Layout, Menu, Button, Space, Typography, ConfigProvider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import logoSrc from '../../../assets/images/campus-jam-logo.png'

const { Header } = Layout;
const { Title } = Typography;

const ACTIVE_COLOR = '#D10A50'; 

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  // This handles navigation for both Menu and Buttons
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
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
        {/* You can replace the emoji with your <img> tag later */}
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
    </Header>
  );
};

export default AppHeader;