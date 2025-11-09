import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Card, Space } from 'antd';
import {
  PlayCircleOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import campusJamLogo from '../../assets/images/campus-jam-logo.png';
import homeBg from '../../assets/images/home-bg.png';


const { Title, Text } = Typography;

const LandingPage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  // Base style for the cards
  const baseCardStyle: React.CSSProperties = {
    textAlign: 'center',
    borderRadius: 70,
    height: '100%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
    cursor: 'pointer',
  };

  // Style to apply on hover
  const hoverStyle: React.CSSProperties = {
    transform: 'translateY(-5px)', // Lifts the card up
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)', // Larger shadow
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '200px', 
        color: 'white',
        position: 'relative',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 20px',
          width: '100%', 
          minHeight: '300px',
        }}
      >
        {/* Hero Section */}
        <Space
          direction="vertical"
          align="center"
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <img
            src={campusJamLogo}
            alt="Campus Jam Logo"
            style={{ width: 300, marginBottom: 20, borderRadius: '8px' }}
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/140x140/722ED1/FFFFFF?text=Logo&font=inter')}
          />
          <Title level={1} style={{ color: 'white', marginBottom: 10, fontSize: 50 }}>
            Your Campus Music Scene, Connected.
          </Title>
          <Text style={{ color: '#ddd', fontSize: 30 }}>
            Connect with campus musicians. Your jam awaits.
          </Text>
          <div style={{ marginTop: 20 }}>
            <Space size="large">
              <Button type="primary" size="large" style={{ fontWeight: 600, fontSize: '1.5rem', padding: '0 30px' }} onClick={() => handleNavigate('/login')}>
                Find a Session
              </Button>
            </Space>
          </div>
        </Space>

        {/* Features Section */}
        <div
          style={{
            backgroundColor: 'transparent',
            width: '90%',
            padding: '40px 20px',
            maxWidth: 1100,
          }}
        >
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card
                bordered={false}
                style={{
                  ...baseCardStyle,
                  ...(hoveredCard === 1 ? hoverStyle : {}), // Apply hover style conditionally
                }}
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <PlayCircleOutlined
                  style={{ fontSize: 38, color: '#722ED1', marginBottom: 12 }}
                />
                <Title level={3}>DISCOVER</Title>
                <Text>
                  Find jam sessions around campus. Discover your school’s sound.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card
                bordered={false}
                style={{
                  ...baseCardStyle,
                  ...(hoveredCard === 2 ? hoverStyle : {}), 
                }}
                onMouseEnter={() => setHoveredCard(2)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <TeamOutlined
                  style={{ fontSize: 38, color: '#722ED1', marginBottom: 12 }}
                />
                <Title level={3}>CONNECT</Title>
                <Text>
                  Link up with fellow student musicians. Expand your network.
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card
                bordered={false}
                style={{
                  ...baseCardStyle,
                  ...(hoveredCard === 3 ? hoverStyle : {}), // Apply hover style conditionally
                }}
                onMouseEnter={() => setHoveredCard(3)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CustomerServiceOutlined
                  style={{ fontSize: 38, color: '#722ED1', marginBottom: 12 }}
                />
                <Title level={3}>CREATE</Title>
                <Text>
                  Craft your sound together. Share your music with your community.
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;