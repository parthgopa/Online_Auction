import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import UserLogin from './components/user/UserLogin';
import UserSignup from './components/user/UserSignup';
// import AuthSuccess from './components/auth/AuthSuccess';
// import Dashboard from './components/pages/Dashboard';
// import Profile from './components/user/Profile';
// import ProtectedRoute from './components/auth/ProtectedRoute';

// Context

// Google OAuth Client ID (you'll need to set this in your environment)
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/signup" element={<UserSignup />} />
                {/* <Route path="/auth/success" element={<AuthSuccess />} /> */}
                
                {/* Protected Routes */}
                {/* <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
