import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Backend API URL - make sure this matches your backend port (3000)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);
  setErrors({});

  try {
    console.log('📡 Sending login request to:', `${API_URL}/auth/login`);
    
    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });

    console.log('✅ Login response:', response.data);

    if (response.status === 200) {
      // Store user data
      const userData = response.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', response.data.token);

      // IMPORTANT: Force page reload to update navbar
     navigate('/dashboard');
      // OR navigate and reload: navigate('/dashboard'); window.location.reload();
      
      // Don't use alert - it blocks the redirect
      // alert('Login successful!');
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 401) {
        setErrors({ general: 'Invalid email or password' });
      } else {
        setErrors({ general: error.response.data.message || 'Login failed' });
      }
    } else if (error.request) {
      setErrors({ general: 'Network error. Please check your connection.' });
    } else {
      setErrors({ general: 'An error occurred. Please try again.' });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <Link to="/" className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 bg-primary rounded-full mr-2"></div>
          <span className="text-2xl font-bold text-gray-800">PeerParcel</span>
        </Link>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Sign in to your account
        </p>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-primary hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        {/* Demo Credentials (optional - remove in production)
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Email: test@example.com</p>
          <p>Password: test123</p>
        </div> */}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-600 hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;