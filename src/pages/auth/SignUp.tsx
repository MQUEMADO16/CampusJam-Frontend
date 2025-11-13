import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import SignUpForm from '../../components/features/SignUpForm';

const { Title, Text } = Typography;

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

const SignUpPageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0px 16px; // REDUCED vertical padding from 24px
`;

const SignUpCard = styled(Card)`
  width: 100%;
  max-width: 900px; // Wider to fit the 2-column form
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 20px 32px; // REDUCED vertical padding from 24px
  border: none;
  animation: ${fadeIn} 0.6s ease-out forwards;
  overflow: hidden;
  
  // Remove default AntD card body padding
  .ant-card-body {
    padding: 0;
  }
`;

const HeaderWrapper = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;


const SignUp: React.FC = () => {
  return (
    <SignUpPageWrapper>
      <SignUpCard>
        <HeaderWrapper>
          <Title level={2} style={{ marginBottom: 0 }}>
            Create your account
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Join CampusJam to create and discover jam sessions.
          </Text>
        </HeaderWrapper>

        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <SignUpForm />
      
      </SignUpCard>
    </SignUpPageWrapper>
  );
};

export default SignUp;