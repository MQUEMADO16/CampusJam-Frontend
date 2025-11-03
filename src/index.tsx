import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp } from 'antd';
import App from './App';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/auth.context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AntApp>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AntApp>
  </React.StrictMode>
);

reportWebVitals();
