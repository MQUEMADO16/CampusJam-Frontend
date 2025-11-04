import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import App from './App';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/auth.context';

const APP_THEME = {
  token: {
    // This is the main "base" color
    colorPrimary: '#D10A50',
    
    // This is the "hover" color
    colorPrimaryHover: '#7B54C4',
    
    // This is the "click" color
    colorPrimaryActive: '#2c1953',
  },
  // Component-specific overrides
  components: {
    Menu: {
      // Keep the menu text red on select
      itemSelectedColor: '#D10A50',
    }
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider theme={APP_THEME}>
      <AntApp>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AntApp>
    </ConfigProvider>

  </React.StrictMode>
);

reportWebVitals();
