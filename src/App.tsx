import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import UserProfile from './pages/profile/UserProfile';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import UserProfileSettings from './pages/profile/UserProfileSettings';
import PricingPage from './pages/Header/Pricing';
import SessionDetail from './pages/sessions/SessionDetail';
import AboutPage from './pages/Header/AboutPage';
import ContactUs from './pages/Header/ContactPage';
import Dashboard from './pages/sessions/Dashboard';
import LandingPage from './pages/Landing/Landing';
import FriendsList from './pages/profile/Connections';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Group 1: Routes WITHOUT Navbar --- */}
        {/* These render standalone without the MainLayout wrapper */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* --- Group 2: Routes WITH Navbar (Public Pages) --- */}
        {/* This <Route> uses MainLayout as its element.
            All child routes will render inside MainLayout's <Outlet /> */}
        <Route path="/" element={<MainLayout />}>
          {/* path="/" is now the 'index' of this group */}
          <Route
            index
            element={<LandingPage />}/>
          
          <Route 
            path="pricing" element={<PricingPage />} />

          <Route 
            path="about" element={<AboutPage />} />
          
          <Route 
            path="contact" element={<ContactUs />} />

          
          
          <Route path="profile/:userId" element={<UserProfile />} />
        </Route>

        {/* --- Group 3: Routes WITH Sidebar (Private Pages) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* All private app pages go here */}
            <Route
              path="sessions"
              element={<Dashboard />}
            />
            <Route
              path="sessions/:sessionId"
              element={<SessionDetail />}
            />
            <Route
              path="settings/profile"
              element={<UserProfileSettings />}
            />
            <Route
              path="my-sessions"
              element={<div>My Sessions Page (Dashboard for joined sessions)</div>}
            />
            <Route
              path="connections"
              element={<FriendsList />}
            />
          </Route>
        </Route>

        {/* --- Catch-all 404 Page (must be at the end) --- */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;