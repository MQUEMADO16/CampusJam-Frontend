import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, ConfigProvider, theme, Spin } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate, Link } from 'react-router-dom';

import AuthService from '../../services/auth.service';
import { useAuth } from '../../context/auth.context';

// TODO: clean up the css styling, might want to move this to a separate location

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoginPageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoginCard = styled(Card)`
  width: 400px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 20px 30px;
  border: none;
  animation: ${fadeIn} 0.6s ease-out forwards;
  overflow: hidden;
`;

const HeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const GradientButton = styled(Button)`
  border-radius: 8px;
  height: 45px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 118, 255, 0.3);
  
  /* --- This is the new transition logic --- */
  
  /* 1. Set the base background to the HOVER color */
  background-color: #7B54C4; /* Your light purple hover color */
  position: relative;
  overflow: hidden;
  z-index: 1;

  /* 2. Keep the text on top */
  & > span {
    position: relative;
    z-index: 2;
  }

  /* 3. Create the gradient as a pseudo-element on top */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, #D10A50, #402579);
    transition: opacity 0.3s ease-out;
    z-index: 1;
  }

  /* 4. On hover, fade out the gradient */
  &:hover::before {
    opacity: 0;
  }
  /* --- End of new logic --- */


  /* AntD override for primary button text color */
  &.ant-btn-primary:not(:disabled) {
    color: #fff;
  }
`;

const StyledInput = styled(Input)`
  border-radius: 8px;
`;

const StyledInputPassword = styled(Input.Password)`
  border-radius: 8px;
`;

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#555',
};

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: contextLogin, user, isLoading: authLoading } = useAuth(); // Get user and loading state

  // --- Redirect if already logged in ---
  useEffect(() => {
    if (!authLoading && user) {
      // User is already logged in, redirect them.
      navigate('/my-sessions');
    }
  }, [user, authLoading, navigate]);

  // --- Logic Implementation ---
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      
      const { user, token } = await AuthService.login({
        email: values.email,
        password: values.password,
      });

      // Update global auth state
      contextLogin(user, token);

      // Show success and redirect
      message.success('Login successful! Welcome.');
      navigate('/my-sessions');

    } catch (error) {
      // Show the error message from the service
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('An unknown error occurred.');
      }
    } finally {
      // Stop the loading spinner
      setLoading(false);
    }
  };

  // --- Render Logic ---
  // Don't render the form if auth is loading or user is found
  if (authLoading || user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <LoginPageWrapper>
      <LoginCard hoverable>
        <HeaderWrapper>
          <Title level={2} style={{ color: '#333', marginBottom: 8 }}>
            CampusJam Login
          </Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Your session awaits.
          </Text>
        </HeaderWrapper>

        {/* --- Cleaned Up Form --- */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <ConfigProvider theme={{ ...theme.defaultConfig }}>
            <Form.Item
              name="email"
              label={<label style={labelStyle}>Email</label>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Enter a valid email address' },
              ]}
            >
              <StyledInput
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Your email address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<label style={labelStyle}>Password</label>}
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <StyledInputPassword
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Your password"
                size="large"
              />
            </Form.Item>
          </ConfigProvider>

          <Form.Item style={{ marginBottom: 20 }}>
            <GradientButton
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading} // Add loading state to button
            >
              Log In
            </GradientButton>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 15 }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Don’t have an account?{' '}
              {/* Use <Link> instead of <a> for client-side routing */}
              <Link to="/signup" style={{ color: '#2575fc', fontWeight: 'bold' }}>
                Register Now
              </Link>
            </Text>
          </div>
        </Form>
      </LoginCard>
    </LoginPageWrapper>
  );
};

export default Login;

