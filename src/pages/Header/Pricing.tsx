import React, { useState } from 'react';
import { Card, Row, Col, Button, List, Typography, Badge, Space, theme } from 'antd'; // 1. Import 'Badge'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

//Colors
const brandGradient = 'linear-gradient(45deg, #d10a50 0%, #402579 100%)';
const brandPurple = '#402579'; 

const basicFeatures = [
  { text: 'Host 1 jam session per month', enabled: true },
  { text: 'Basic profile customization', enabled: true },
  { text: 'Access to public jam sessions', enabled: true },
  { text: 'Access to private jam sessions', enabled: false },
  { text: 'Advanced analytics', enabled: false },
];

const proFeatures = [
  { text: 'Unlimited jam sessions', enabled: true },
  { text: 'Full profile customization', enabled: true },
  { text: 'Access to private jam sessions', enabled: true },
  { text: 'Advanced analytics', enabled: true },
  { text: 'Priority support', enabled: true },
];

const PricingPage: React.FC = () => {
  const { token } = theme.useToken();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const commonCardStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <div style={{ padding: '4rem 0', background: token.colorBgLayout }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Title level={2}>Pricing</Title>
        <Paragraph type="secondary" style={{ fontSize: '1.25rem', maxWidth: 600, margin: 'auto' }}>
          Choose the plan that's right for you and take your CampusJam
          experience to the next level.
        </Paragraph>
      </div>

      {/* Pricing Cards */}
      <Row gutter={[32, 32]} justify="center" align="stretch">
        
        {/* Basic Card */}
        <Col xs={24} md={10}>
          <Card
            title="Basic"
            headStyle={{ fontSize: '1.5rem', fontWeight: 600 }}
            style={{
              ...commonCardStyle,
              transform: hoveredCard === 'basic' ? 'translateY(-10px)' : 'none',
              borderColor: hoveredCard === 'basic' ? brandPurple : token.colorBorderSecondary, // Use purple on hover
            }}
            bodyStyle={{ flex: 1 }}
            onMouseEnter={() => setHoveredCard('basic')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Paragraph type="secondary" style={{ fontSize: '1.1rem' }}>Free for Life</Paragraph>
            <Title level={1} style={{ margin: '0.5rem 0' }}>
              $0<Text style={{ fontSize: '1.25rem', color: token.colorTextSecondary }}>/month</Text>
            </Title>
            <List
              dataSource={basicFeatures}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', padding: '0.5rem 0' }}>
                  <Space>
                    {item.enabled ?
                      <CheckCircleOutlined style={{ color: brandPurple }} /> : // Use brand purple
                      <CloseCircleOutlined style={{ color: token.colorTextDisabled }} />
                    }
                    <Text disabled={!item.enabled}>{item.text}</Text>
                  </Space>
                </List.Item>
              )}
              style={{ margin: '2rem 0' }}
            />
            <Button
              type="primary"
              size="large"
              block
              style={{
                background: brandGradient,
                borderColor: 'transparent',
                boxShadow: hoveredCard === 'basic' ? token.boxShadow : 'none',
              }}
            >
              Get Started
            </Button>
          </Card>
        </Col>

        {/* Pro Card - Most Popular */}
        <Col xs={24} md={10}>
          {/* 3. Wrap Card in Badge.Ribbon for the "fancy" tag */}
          <Badge.Ribbon 
            text="Most Popular" 
            style={{ background: brandGradient }}
          >
            <Card
              title="Pro"
              headStyle={{ fontSize: '1.5rem', fontWeight: 600 }}
              style={{
                ...commonCardStyle,
                border: `2px solid ${brandPurple}`, // 4. Use brand purple for border
                transform: hoveredCard === 'pro' ? 'translateY(-10px)' : 'none',
                boxShadow: hoveredCard === 'pro' ? token.boxShadow : token.boxShadowSecondary,
              }}
              bodyStyle={{ flex: 1 }}
              onMouseEnter={() => setHoveredCard('pro')}
              onMouseLeave={() => setHoveredCard(null)}
              // We don't need the 'extra' prop anymore
            >
              <Paragraph type="secondary" style={{ fontSize: '1.1rem' }}>Unlock all features</Paragraph>
              <Title level={1} style={{ margin: '0.5rem 0' }}>
                $10<Text style={{ fontSize: '1.25rem', color: token.colorTextSecondary }}>/month</Text>
              </Title>
              <List
                dataSource={proFeatures}
                renderItem={(item) => (
                  <List.Item style={{ border: 'none', padding: '0.5rem 0' }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: brandPurple }} /> {/* 5. Use brand purple */}
                      <Text>{item.text}</Text>
                    </Space>
                  </List.Item>
                )}
                style={{ margin: '2rem 0' }}
              />
              <Button
                type="primary"
                size="large"
                block
                style={{
                  background: brandGradient, 
                  borderColor: 'transparent',
                  boxShadow: hoveredCard === 'pro' ? token.boxShadow : 'none',
                }}
              >
                Go Pro
              </Button>
            </Card>
          </Badge.Ribbon>
        </Col>
      </Row>
    </div>
  );
};

export default PricingPage;