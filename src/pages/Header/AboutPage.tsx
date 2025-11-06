import React from 'react';
import campusJamLogo from '../../assets/images/campus-jam-logo-large.png'; 
import { Row, Col, Typography, Avatar, Space } from 'antd'; 

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem 0' }}>
      <Row gutter={[48, 24]} align="middle">
        
        {/* Text Content */}
        <Col xs={24} md={14}>
          {/* Added <Space> for better vertical text sytling */}
          <Space direction="vertical" size="large" style={{ width: '1000%' }}>
            
            {/* Use the logo as an Avatar next to the title */}
            <Space align="center" size="middle">
              <Avatar size={100} src={campusJamLogo} />
              <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                Our Mission
              </Title>
            </Space>

            <Paragraph style={{ fontSize: '1.5rem', lineHeight: 1 }}>
              CampusJam is where college musicians unite. Our mission
              is to transform the campus experience by providing a
              dedicated platform for students to connect, collaborate,
              and create.
            </Paragraph>
            <Paragraph style={{ fontSize: '1.5rem', lineHeight: 1 }}>
              Whether you're a budding guitarist seeking a
              jam session or a seasoned vocalist looking for a band, we
              make it easy to find your rhythm. We believe every student
              deserves a stage to share their talent, and we're here to
              turn your passion for music into a vibrant community.
            </Paragraph>
            <Paragraph style={{ fontSize: '1.5rem', lineHeight: 1, fontWeight: 500 }}>
              Join us and let's make campus life a concert, one jam at a time.
            </Paragraph>
          </Space>
        </Col>

      </Row>
    </div>
  );
};

export default AboutPage;