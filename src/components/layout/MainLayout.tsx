import React, { useState, useEffect } from 'react';
import { Layout, Alert } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppFooter from './Footer/Footer';
import AppHeader from './Header/Header';

const { Content } = Layout;

interface AppAlert {
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AppAlert | null>(null);

  // Check for an alert message in the location state
  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      // IMPORTANT: Clear the location state
      // This stops the alert from re-appearing if the user reloads
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]); // Run this effect when the location changes

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      <AppHeader layout="main" />

      {alert && (
        <Alert
          message={alert.text}
          type={alert.type}
          closable
          onClose={() => setAlert(null)} // Allow user to close it
          style={{
            position: 'fixed',
            top: 80, // 64px header + 16px padding
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999, // Ensure it's on top of everything
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        />
      )}

      <Content style={{ padding: '0 48px', marginTop: 64 }}>
        <div>
          <Outlet />
        </div>
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default MainLayout;