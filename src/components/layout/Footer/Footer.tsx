import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter: React.FC = () => {
  return (
    <>
      <Footer style={{ background: '#fff', color: '#111827', paddingTop: '2rem 48px', paddingBottom: '3rem'}}>
        <Row gutter={[48, 48]} justify="center">
          
          <Col>
            <Space/>
          </Col>
          <Col>
            <Space/>
          </Col>
          <Col>
            <Space/>
          </Col>

          {/* Get In Touch */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#111827'}}>Get In Touch</Title>
            <Text style={{ color: '#737373', display: 'block', marginBottom: '1rem', fontSize: '1rem'  }}>
              CampusJam.Support@gmail.com
            </Text>
            <Space size="middle">
              <Link href="#" target="_blank" style={{ color: '#111827', fontSize: '2rem' }}>
                <FacebookOutlined />
              </Link>
              <Link href="#" target="_blank" style={{ color: '#111827', fontSize: '2rem' }}>
                <InstagramOutlined />
              </Link>
              <Link href="#" target="_blank" style={{ color: '#111827', fontSize: '2rem' }}>
                <TwitterOutlined />
              </Link>
            </Space>
          </Col>
          

          {/* Company Info */}
          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{ color: '#111827' }}>Company Info</Title>
            <Space direction="vertical" size="small">
              <Link href="#" style={{ color: '#737373', fontSize: '1rem' }}>About Us</Link>
              <Link href="#" style={{ color: '#737373', fontSize: '1rem' }}>FAQ</Link>
              <Link href="#" style={{ color: '#737373', fontSize: '1rem' }}>Blog</Link>
            </Space>
          </Col>

          {/* Features */}
          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{ color: '#111827' }}>Features</Title>
            <Space direction="vertical" size="small">
              <Link href="#" style={{ color: '#737373' , fontSize: '1rem'}}>Business Marketing</Link>
              <Link href="#" style={{ color: '#737373' , fontSize: '1rem'}}>User Analytic</Link>
              <Link href="#" style={{ color: '#737373' , fontSize: '1rem'}}>Live Chat</Link>
            </Space>
          </Col>
        </Row>
      </Footer>

      {/* Bottom Gradient Bar */}
      <Footer
        style={{
          background: 'linear-gradient(to right, #D10A50, #402579)',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        <Text style={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}>
          “Bringing Students Together, One Jam at a Time.”
        </Text>
      </Footer>
    </>
  );
};

export default AppFooter;