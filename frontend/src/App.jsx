import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from './contexts/AuthContext';
import { store } from './store/store';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem('token');
    const firstName = sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');
    const role = sessionStorage.getItem('role');

    if (token && firstName && lastName && role) {
      setUser({
        firstName,
        lastName,
        role: role.toLowerCase()
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ user, setUser }}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              {user ? (
                user.role === 'admin' ? (
                  <Route path="/admin/*" element={<AdminLayout />} />
                ) : (
                  <Route path="/user/*" element={<UserLayout />} />
                )
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
              
              {/* Redirect based on role */}
              {user && (
                <Route 
                  path="*" 
                  element={
                    <Navigate 
                      to={user.role === 'admin' ? '/admin' : '/user'} 
                      replace 
                    />
                  } 
                />
              )}
            </Routes>
            
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;