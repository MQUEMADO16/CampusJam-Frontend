import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Card, Space } from 'antd';
import {
  PlayCircleOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import campusJamLogo from '../../assets/images/campus-jam-logo.png';
import homeBg from '../../assets/images/home-bg.png';

const { Title, Text } = Typography;

// --- Styled Components ---

const PageWrapper = styled.div`
  // --- This is the Negative Margin Fix ---
  // Assumes MainLayout padding is { top: 24, left: 48, right: 48 }
  margin-top: -24px;
  margin-left: -48px;
  margin-right: -48px;
  // --- End Fix ---

  background-image: url(${homeBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: white;
  position: relative;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.3); // Darker overlay
  width: 100%;
  padding-bottom: 120px; // Add padding to the bottom
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 40px 20px;
  // Fill viewport height (minus 64px header)
  min-height: calc(100vh - 64px); 
  position: relative;
  z-index: 2;
`;

// Styled Gradient Button
const GradientButton = styled(Button)`
  font-weight: 600;
  font-size: 1.125rem; // 18px
  height: auto;
  padding: 12px 32px;
  border: none;
  background: linear-gradient(to right, #D10A50, #402579);
  
  &.ant-btn-primary:not(:disabled):hover {
    background: linear-gradient(to right, #b80946, #331d5f);
  }
`;

const FeaturesSection = styled.div`
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  
  // Pulls the cards up to overlap the hero
  margin-top: -100px;
  position: relative;
  z-index: 3;
`;

// Styled Feature Card (to match screenshot)
const FeatureCard = styled(Card)`
  text-align: center;
  border-radius: 40px; // Large, rounded corners
  height: 100%;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  padding: 16px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-body {
    padding: 24px 16px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 40px;
  color: #722ED1;
  margin-bottom: 16px;
`;

// --- Landing Page Component ---

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PageWrapper>
      <Overlay>
        {/* Hero Section */}
        <HeroSection>
          <Space
            direction="vertical"
            align="center"
            style={{ textAlign: 'center' }}
            size="large"
          >
            <img
              src={campusJamLogo}
              alt="Campus Jam Logo"
              // Match screenshot logo size
              style={{ width: 160, marginBottom: 16, borderRadius: '8px' }} 
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/160x160/722ED1/FFFFFF?text=Logo&font=inter')}
            />
            <Title level={1} style={{ color: 'white', margin: 0, fontSize: '3.5rem', fontWeight: 700 }}>
              Your Campus Music Scene, Connected.
            </Title>
            <Text style={{ color: '#e0e0e0', fontSize: '1.25rem', maxWidth: 600 }}>
              Connect with campus musicians. Your jam awaits.
            </Text>
            <div style={{ marginTop: 24 }}>
              <GradientButton
                type="primary"
                size="large"
                onClick={() => handleNavigate('/signup')} // Go to signup
              >
                Find a Session
              </GradientButton>
            </div>
          </Space>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <FeatureCard bordered={false}>
                <FeatureIcon>
                  <PlayCircleOutlined />
                </FeatureIcon>
                <Title level={4} style={{ fontWeight: 600 }}>DISCOVER</Title>
                <Text type="secondary" style={{ fontSize: '0.95rem' }}>
                  Find jam sessions around campus. Discover your school’s sound.
                </Text>
              </FeatureCard>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <FeatureCard bordered={false}>
                <FeatureIcon>
                  <TeamOutlined />
                </FeatureIcon>
                <Title level={4} style={{ fontWeight: 600 }}>CONNECT</Title>
                <Text type="secondary" style={{ fontSize: '0.95rem' }}>
                  Link up with fellow student musicians. Expand your network.
                </Text>
              </FeatureCard>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <FeatureCard bordered={false}>
                <FeatureIcon>
                  <CustomerServiceOutlined />
                </FeatureIcon>
                <Title level={4} style={{ fontWeight: 600 }}>CREATE</Title>
                <Text type="secondary" style={{ fontSize: '0.95rem' }}>
                  Craft your sound together. Share your music with your community.
                </Text>
              </FeatureCard>
            </Col>
          </Row>
        </FeaturesSection>
      </Overlay>
    </PageWrapper>
  );
};

export default LandingPage;