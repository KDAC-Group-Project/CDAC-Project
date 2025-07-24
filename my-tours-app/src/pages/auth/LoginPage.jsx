import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';
import './LoginPage.css'; // <--- custom styles here

function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@toursandtravels.com' && password === 'admin123') {
          resolve({
            status: 'success',
            data: {
              name: 'Admin User',
              role: 'admin',
              token: 'admin-token-123'
            }
          });
        } else if (email === 'user@example.com' && password === 'user123') {
          resolve({
            status: 'success',
            data: {
              name: 'John Doe',
              role: 'user',
              token: 'user-token-123'
            }
          });
        } else {
          resolve({
            status: 'error',
            message: 'Invalid credentials'
          });
        }
      }, 1000);
    });
  };

  const onLogin = async () => {
    if (!email) {
      toast.warn('Please enter email');
      return;
    }
    if (!password) {
      toast.warn('Please enter password');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);

      if (result.status === 'success') {
        const { name, role, token } = result.data;

        sessionStorage.setItem('name', name);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('token', token);

        setUser({ name, role });

        toast.success('Welcome to Final Destination!');
        navigate(role === 'admin' ? '/admin' : '/user');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Error while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="background-image" />

      <div className="container d-flex align-items-center justify-content-center min-vh-100 position-relative">
        <div className="card shadow-sm p-4 login-card">
          <div className="text-center mb-4">
            <h3>Welcome Back</h3>
            <p className="text-muted">Sign in to your Tours & Travels account</p>
            <div className="alert alert-primary p-2 mt-3">
              <p className="mb-1 small"><strong>Demo Credentials</strong></p>
              <p className="mb-0 small">Admin: admin@toursandtravels.com / admin123</p>
              <p className="mb-0 small">User: user@example.com / user123</p>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              placeholder="username@test.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Lock size={16} />
              </span>
              <input
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="********"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="d-grid mb-3">
            <button
              onClick={onLogin}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" />
              ) : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <small className="text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none">
                Sign up here
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
