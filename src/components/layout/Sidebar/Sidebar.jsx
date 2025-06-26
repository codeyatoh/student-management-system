import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaUser, FaChalkboardTeacher, FaUserShield, FaChalkboard,
  FaSchool, FaChevronLeft, FaSignOutAlt
} from 'react-icons/fa';
import nightbyteLogo from '../../../assets/images/nightbyte.png';
import './Sidebar.css';
import PixelAlert from '../../modals/PixelAlert';
import DeleteConfirmationModal from '../../modals/DeleteConfirmationModal';

const Sidebar = ({ isSidebarCollapsed, toggleSidebar, location }) => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setShowLogoutAlert(true);
    setTimeout(() => {
      setShowLogoutAlert(false);
      navigate('/');
    }, 1200);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="logo-container">
        <div className="logo">
          <img src={nightbyteLogo} alt="NightByte Logo" />
        </div>
      </div>
      <div className="toggle-btn" id="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <FaChevronLeft />
      </div>
      <div className="menu-list">
        <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}> 
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>
        <Link to="/students" className={`menu-item ${location.pathname === '/students' ? 'active' : ''}`}> 
          <FaUser />
          <span>Students</span>
        </Link>
        <Link to="/classes" className={`menu-item ${location.pathname === '/classes' ? 'active' : ''}`}> 
          <FaSchool />
          <span>Classes</span>
        </Link>
        <Link to="/add-classroom" className={`menu-item ${location.pathname === '/add-classroom' ? 'active' : ''}`}> 
          <FaChalkboard />
          <span>Classrooms</span>
        </Link>
      </div>
      <a href="/" className="menu-item logout" onClick={handleLogout}> 
        <FaSignOutAlt />
        <span>Logout</span>
      </a>
      {showLogoutConfirm && (
        <DeleteConfirmationModal
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmLabel="Yes"
          cancelLabel="No"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
      {showLogoutAlert && (
        <PixelAlert
          message="Logout successful!"
          type="success"
          onClose={() => setShowLogoutAlert(false)}
        />
      )}
    </div>
  );
};

export default Sidebar; 