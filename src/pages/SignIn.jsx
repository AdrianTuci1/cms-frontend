import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusinessType } from '../config/businessTypes';

const SignIn = () => {
  const businessType = getBusinessType();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Implement actual authentication logic here
      // For now, we'll just simulate a successful login
      console.log('Login attempt with:', formData);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1>Welcome to {businessType.name}</h1>
        <h2>Sign In</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          
          <button type="submit" className="signin-button">
            Sign In
          </button>
          
          <div className="form-footer">
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
            <p>
              Don't have an account?{' '}
              <a href="/signup" className="signup-link">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn; 