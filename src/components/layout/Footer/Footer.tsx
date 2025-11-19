import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter: React.FC = () => {

  const footerStyle: React.CSSProperties = {
    background: '#fff', // Reverted to white background
    color: '#111827', // Original dark text
    padding: '3rem 48px',
    
    // This mimics the AppHeader's shadow, but on top
    borderTop: '1px solid #f0f0f0',
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)', 
    // z-index ensures shadow is above content that might scroll "under" it
    position: 'relative', 
    zIndex: 1,
  };

  const titleStyle: React.CSSProperties = {
    color: '#111827', // Original dark title
  };

  const linkStyle: React.CSSProperties = {
    color: '#737373', // Original light grey link
    fontSize: '1rem',
  };

  const iconLinkStyle: React.CSSProperties = {
    color: '#111827', // Original dark icon
    fontSize: '2rem',
  };

  return (
    <>
      {/* Apply the static light style with top shadow */}
      <Footer style={footerStyle}>
        <Row gutter={[48, 48]} justify="center">

          {/* Get In Touch */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={titleStyle}>Get In Touch</Title>
            <Text style={{ ...linkStyle, display: 'block', marginBottom: '1rem', color: '#737373' }}>
              CampusJam.Support@gmail.com
            </Text>
            <Space size="middle">
              <Link href="#" target="_blank" style={iconLinkStyle}>
                <FacebookOutlined />
              </Link>
              <Link href="#" target="_blank" style={iconLinkStyle}>
                <InstagramOutlined />
              </Link>
              <Link href="#" target="_blank" style={iconLinkStyle}>
                <TwitterOutlined />
              </Link>
            </Space>
          </Col>
          

          {/* Company Info (Updated links) */}
          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={titleStyle}>Company Info</Title>
            <Space direction="vertical" size="small">
              <Link href="/about" style={linkStyle}>About Us</Link>
              <Link href="/contact" style={linkStyle}>Contact</Link>
              <Link href="#" style={linkStyle}>Blog</Link>
            </Space>
          </Col>

          {/* Resources (Updated links) */}
          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={titleStyle}>Resources</Title>
            <Space direction="vertical" size="small">
              <Link href="/pricing" style={linkStyle}>Pricing</Link>
              <Link href="#" style={linkStyle}>FAQ</Link>
              <Link href="#" style={linkStyle}>Help Center</Link>
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