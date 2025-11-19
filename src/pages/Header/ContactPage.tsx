import React from 'react';
import { Row, Col, Typography, Form, Input, Button, Card, Space } from 'antd'; 
import { SendOutlined } from '@ant-design/icons';
import campusJamLogo from '../../assets/images/campus-jam-logo-large.png';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// Colors
const brandGradient = 'linear-gradient(45deg, #d10a50 0%, #402579 100%)';

const ContactPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // Add email API form submission logic.
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        Contact Us
      </Title>
      
      <Row gutter={[32, 32]} align="stretch">

        {/* --- Left Column: The Form --- */}
        <Col xs={24} md={14} lg={12}>
          <Card style={{ borderRadius: '12px', height: '100%' }}>
            <Title level={3} style={{ marginBottom: '1.5rem' }}>
              Send us a message
            </Title>
            
            <Form
              name="contact"
              layout="vertical"
              onFinish={onFinish}
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

              <Form.Item style={{ marginBottom: 0 }}>
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
          </Card>
        </Col>

        {/* --- Right Column: Get In Touch --- */}
        <Col xs={24} md={10} lg={12}>
          <div style={{
            background: brandGradient,
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Space direction="vertical" size="large">
              <Title level={2} style={{ color: 'white', fontWeight: 700, margin: 0 }}>
                Get In Touch
              </Title>
              <Paragraph style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '1rem' }}>
                We'd love to hear from you! Whether you have questions,
                need support, or want to explore partnership
                opportunities, our team is ready to help.
              </Paragraph>
              
              <img 
                src= {campusJamLogo}
                alt="CampusJam Logo"
                style={{ width: '80%', maxWidth: '300px', height: 'auto' }}
              />
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;