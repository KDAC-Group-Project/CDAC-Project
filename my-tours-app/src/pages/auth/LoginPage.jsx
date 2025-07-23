import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

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
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              token: 'admin-token-123'
            }
          });
        } else if (email === 'user@example.com' && password === 'user123') {
          resolve({
            status: 'success',
            data: {
              firstName: 'John',
              lastName: 'Doe',
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
    if (email.length === 0) {
      toast.warn('Please enter email');
      return;
    }
    if (password.length === 0) {
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
        
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
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
    <div className='container'>
      <div className="text-center">
          <h2 className="mt-6">
            Welcome Back
          </h2>
          <p className="mt-2 ">
            Sign in to your Tours & Travels account
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
            <p className="text-xs text-blue-700 mt-1">
              Admin: admin@toursandtravels.com / admin123
            </p>
            <p className="text-xs text-blue-700">
              User: user@example.com / user123
            </p>
          </div>
        </div>

      <div className='form'>
        <div className='mb-3'>
          <label htmlFor=''>Email</label>
          <input
            id='email'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            className='form-control'
            placeholder='username@test.com'
          />
        </div>

        <div className='mb-3'>
          <label htmlFor=''>Password</label>
           <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id='password'
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  className='form-control'
                  placeholder='#######'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>

        <div>
            <button
              onClick={onLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
         </div>

        <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up here
                </Link>
              </p>
            </div>
      </div>
    </div>
  )
}

export default LoginPage