import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Result
        status="403"
        title="403 - Access Denied"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Link to="/my-sessions">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default AccessDenied;