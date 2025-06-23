import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Login logic
      if (formData.username && formData.password) {
        navigate('/dashboard');
      } else {
        setErrors({
          username: !formData.username ? 'Username is required' : '',
          password: !formData.password ? 'Password is required' : ''
        });
      }
    } else {
      // Register logic
      if (formData.username && formData.password && formData.password === formData.confirmPassword) {
        alert('Registration successful!');
        setIsLogin(true); // Switch to login view
      } else {
        setErrors({
          username: !formData.username ? 'Username is required' : '',
          password: !formData.password ? 'Password is required' : '',
          confirmPassword: formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="login-container">
      <h1 className="title">Student Management</h1>
      <div className="login-card">
        <div className="login-header">
          <div className="window-controls">
            <span className="control red"></span>
            <span className="control yellow"></span>
            <span className="control green"></span>
          </div>
          <h1>{isLogin ? 'Sign In' : 'Register'}</h1>
          <div></div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <span className="password-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="login-button">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <a onClick={toggleForm}>
              {isLogin ? 'Register' : 'Sign In'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
