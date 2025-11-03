import React from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

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
      }}
    >
      {/* Logo Section */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        {/* You can replace the emoji with your <img> tag later */}
        <span style={{ fontSize: '1.75rem', marginRight: '8px' }}>🎸</span>
        <Title
          level={4}
          style={{ 
            margin: 0,
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CampusJam
        </Title>
      </Link>

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

      {/* Auth Buttons Section */}
      <Space>
        <Button onClick={() => handleNavigate('/login')}>Log In</Button>
        <Button 
          type="primary" 
          onClick={() => handleNavigate('/signup')}
          style={{
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          }}
        >
          Sign Up
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;