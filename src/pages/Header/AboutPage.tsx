import React from 'react';
import campusJamLogo from '../../assets/images/campus-jam-logo-large.png';
import { Row, Col, Typography, Space, Divider } from 'antd'; 

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem 1rem' }}>
      <Row gutter={[48, 32]} align="middle" justify="center">
        
        {/* Visual Column: The Logo */}
        <Col xs={24} md={10} style={{ textAlign: 'center' }}>
          <img 
            src={campusJamLogo} 
            alt="CampusJam Logo" 
            style={{ 
              maxWidth: '350px', 
              width: '100%', 
              height: 'auto',
              borderRadius: '16px'
            }} 
          />
        </Col>
        
        {/* Text Content Column */}
        <Col xs={24} md={14}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              Welcome to CampusJam
            </Title>
            
            <Title level={4} type="secondary" style={{ marginTop: 0, fontWeight: 500 }}>
              Our Mission
            </Title>
            
            <Divider style={{ margin: '8px 0', background: '#aaaaaa', height: '1px' }} />

            <Paragraph style={{ fontSize: '1.15rem', lineHeight: 1.6 }}>
              CampusJam is where college musicians unite. Our mission
              is to transform the campus experience by providing a
              dedicated platform for students to connect, collaborate,
              and create.
            </Paragraph>
            <Paragraph style={{ fontSize: '1.15rem', lineHeight: 1.6 }}>
              Whether you're a budding guitarist seeking a
              jam session or a seasoned vocalist looking for a band, we
              make it easy to find your rhythm. We believe every student
              deserves a stage to share their talent, and we're here to
              turn your passion for music into a vibrant community.
            </Paragraph>
            <Paragraph style={{ fontSize: '1.2rem', lineHeight: 1.6, fontWeight: 500, paddingTop: '0.5rem' }}>
              Join us and let's make campus life a concert, one jam at a time.
            </Paragraph>
          </Space>
        </Col>

      </Row>
    </div>
  );
};

export default AboutPage;