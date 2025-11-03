import React from 'react';
import { Row, Col, Typography, Form, Input, Button, Card, ConfigProvider } from 'antd'; 
import { SendOutlined } from '@ant-design/icons';
import campusJamLogo from '../../assets/campusJamLogo.png';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// Colors
const brandGradient = 'linear-gradient(45deg, #d10a50 0%, #402579 100%)';
const cardBgColor = '#6c5555ff'; // Can change later.

const ContactPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Add email API form submission logic.
  };

  // Custom theme for form items to make labels white
  const formItemTheme = {
    token: {
      colorText: '#e2e8f0', // Label color
      colorTextSecondary: '#a0aec0', // Subtext/help color
    },
  };

  return (
    <Card style={{ background: cardBgColor, border: 'none', borderRadius: '12px' }}>
      <Row gutter={[48, 32]} align="middle">

        {/* --- Left Column: The Form --- */}
        <Col xs={24} md={12}>
          <Title level={3} style={{ color: 'white', marginBottom: '1.5rem' }}>
            Send us a message
          </Title>
          
          {/* Wrap Form in the ConfigProvider */}
          <ConfigProvider theme={formItemTheme}>
            <Form
              name="contact"
              layout="vertical"
              onFinish={onFinish}
              // The 'theme' prop is removed from here
              requiredMark={false} 
            >
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}
              >
                <Input size="large" placeholder="you@example.com" />
              </Form.Item>
              
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input size="large" placeholder="Partnership Inquiry" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Your Message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea rows={4} placeholder="Hi there, I'd like to talk about..." />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<SendOutlined />}
                  style={{ 
                    background: brandGradient, 
                    borderColor: 'transparent',
                    height: 'auto', 
                    padding: '0.75rem 1.5rem', 
                    fontSize: '1rem' 
                  }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </ConfigProvider> {/* 4. End of the ConfigProvider wrapper */}
        </Col>

        {/* --- Right Column: Get In Touch --- */}
        <Col xs={24} md={12} style={{ textAlign: 'center', padding: '2rem' }}>
          <Title level={2} style={{ color: 'white', fontWeight: 700 }}>
            Get In Touch
          </Title>
          <Paragraph style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '2rem' }}>
            We'd love to hear from you! Whether you have questions about
            our services, need support, or want to explore partnership
            opportunities, our team is ready to help.
          </Paragraph>
          
          {/* Add your guitar pick logo here */}
          <img 
            // src={guitarPickLogo} // <-- Uncomment this line when you import your logo
            src= {campusJamLogo} // Placeholder
            alt="CampusJam Guitar Pick"
            style={{ width: '80%', maxWidth: '300px', height: 'auto' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ContactPage;