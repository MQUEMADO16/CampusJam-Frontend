import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import UserProfile from './pages/profile/UserProfile';

import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

const { Content } = Layout;


function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Navbar Here */}

        <Content style={{ padding: '0 48px', marginTop: 64 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}> {/* Style parent page attributes here */}
            <Routes>

              {/* Route pages here. Add relevant pages to the 'element' attribute as they are made. */}
              {/* --- Authentication & Public Pages --- */}
              <Route
                path="/"
                element={<div>Landing Page (Public Homepage)</div>}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<SignUp />}
              />

              {/* --- Core App & Session Pages --- */}
              <Route
                path="/sessions"
                element={<div>Jam Board Page (List of all public sessions)</div>}
              />
              <Route
                path="/sessions/:sessionId"
                element={<div>Session Detail Page (for a single session)</div>}
              />
              <Route
                path="/create-session"
                element={<div>Create Session Page (Form)</div>}
              />
              <Route
                path="/sessions/:sessionId/edit"
                element={<div>Edit Session Page (Form)</div>}
              />

              {/* --- User & Profile Pages --- */}
              <Route
                path="/profile/:userId"
                element={<UserProfile />}
              />
              <Route
                path="/settings/profile"
                element={<div>User Settings Page (Private view for editing)</div>}
              />
              <Route
                path="/my-sessions"
                element={<div>My Sessions Page (Dashboard for joined sessions)</div>}
              />

              {/* --- Catch-all 404 Page --- */}
              <Route
                path="*"
                element={<NotFound />}
              />

              {/* --- Catch-all 403 Page --- */}
              <Route
                path="access-denied"
                element={<AccessDenied />}
              />

            </Routes>
          </div>
        </Content>

        {/* Footer here */}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
