import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import './LoginPage.css';
import { db } from '../../assets/firebase-config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import PixelAlert from '../PixelAlert/PixelAlert';
import bcrypt from 'bcryptjs';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    contact_number: '',
    role: 'Teacher',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Login logic (using email and password)
      if (formData.email && formData.password) {
        setLoading(true);
        let found = false;
        let userRole = '';
        // Check admins
        const adminQuery = query(
          collection(db, 'admins'),
          where('email', '==', formData.email),
          where('password', '==', formData.password)
        );
        const adminSnapshot = await getDocs(adminQuery);
        if (!adminSnapshot.empty) {
          found = true;
          userRole = 'Admin';
        }
        // Check teachers if not found in admins
        if (!found) {
          const teacherQuery = query(
            collection(db, 'teachers'),
            where('email', '==', formData.email),
            where('password', '==', formData.password)
          );
          const teacherSnapshot = await getDocs(teacherQuery);
          if (!teacherSnapshot.empty) {
            found = true;
            userRole = 'Teacher';
          }
        }
        setLoading(false);
        if (found) {
          setAlert({ open: true, message: `Login successful! (${userRole})`, type: 'success' });
          setTimeout(() => {
            setAlert({ open: false, message: '', type: 'success' });
            navigate('/dashboard');
          }, 1200);
        } else {
          setAlert({ open: true, message: 'Invalid email or password', type: 'error' });
          setTimeout(() => setAlert({ open: false, message: '', type: 'success' }), 1800);
          setErrors({
            email: 'Invalid email or password',
            password: 'Invalid email or password',
          });
        }
      } else {
        setErrors({
          email: !formData.email ? 'Email is required' : '',
          password: !formData.password ? 'Password is required' : ''
        });
      }
    } else {
      // Register logic
      if (
        formData.email &&
        formData.password &&
        formData.first_name &&
        formData.last_name &&
        formData.contact_number &&
        formData.role
      ) {
        setLoading(true);
        try {
          const collectionName = formData.role === 'Admin' ? 'admins' : 'teachers';
          const hashedPassword = await bcrypt.hash(formData.password, 10);
          await addDoc(collection(db, collectionName), {
            email: formData.email,
            password: hashedPassword,
            first_name: formData.first_name,
            last_name: formData.last_name,
            contact_number: formData.contact_number,
            role: formData.role,
          });
          setLoading(false);
          setAlert({ open: true, message: 'Registration successful!', type: 'success' });
          setTimeout(() => {
            setAlert({ open: false, message: '', type: 'success' });
            setIsLogin(true); // Switch to login view
          }, 1200);
        } catch (error) {
          setLoading(false);
          setAlert({ open: true, message: 'Registration failed: ' + error.message, type: 'error' });
          setTimeout(() => setAlert({ open: false, message: '', type: 'success' }), 1800);
        }
      } else {
        setErrors({
          email: !formData.email ? 'Email is required' : '',
          password: !formData.password ? 'Password is required' : '',
          first_name: !formData.first_name ? 'First name is required' : '',
          last_name: !formData.last_name ? 'Last name is required' : '',
          contact_number: !formData.contact_number ? 'Contact number is required' : '',
          role: !formData.role ? 'Role is required' : '',
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
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      contact_number: '',
      role: 'Teacher',
    });
  };

  return (
    <div className="login-container">
      <div className="background-geometry">
        <div className="shape circle1"></div>
        <div className="shape circle2"></div>
        <div className="shape circle3"></div>
        <div className="shape square1"></div>
        <div className="shape square2"></div>
        <div className="shape triangle1"></div>
        <div className="shape triangle2"></div>
        <div className="shape circle4"></div>
        <div className="shape circle5"></div>
        <div className="shape square3"></div>
        <div className="shape square4"></div>
        <div className="shape triangle3"></div>
        <div className="shape triangle4"></div>
      </div>
      <h1 className="title" data-text="Student Management">Student Management</h1>
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
          {isLogin ? (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
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
                    placeholder="Password"
                  />
                  <span className="password-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
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
                      placeholder="Password"
                    />
                    <span className="password-icon" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                  </div>
                  {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact_number">Contact Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      id="contact_number"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                  {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <div className="input-wrapper">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      style={{ fontFamily: 'Press Start 2P, cursive', width: '100%', padding: '1rem 1rem 1rem 3rem', border: 'none', background: 'transparent', fontSize: '0.75rem' }}
                    >
                      <option value="Teacher">Teacher</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  {errors.role && <span className="error-message">{errors.role}</span>}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading
              ? (isLogin ? 'Signing In...' : 'Registering...')
              : isLogin ? 'Sign In' : 'Register'}
          </button>
          {alert.open && (
            <PixelAlert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ open: false, message: '', type: 'success' })}
            />
          )}
        </form>
        
        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
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
