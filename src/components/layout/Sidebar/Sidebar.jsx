import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaUser, FaChalkboardTeacher, FaUserShield, FaChalkboard,
  FaSchool, FaChevronLeft, FaSignOutAlt
} from 'react-icons/fa';
import nightbyteLogo from '../../../assets/images/nightbyte.png';
import './Sidebar.css';

const Sidebar = ({ isSidebarCollapsed, toggleSidebar, location }) => (
  <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
    <div className="logo-container">
      <div className="logo">
        <img src={nightbyteLogo} alt="NightByte Logo" />
      </div>
    </div>
    <div className="toggle-btn" id="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
      <FaChevronLeft />
    </div>
    <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}> 
      <FaTachometerAlt />
      <span>Dashboard</span>
    </Link>
    <Link to="/students" className={`menu-item ${location.pathname === '/students' ? 'active' : ''}`}> 
      <FaUser />
      <span>Students</span>
    </Link>
    <Link to="/add-teacher" className={`menu-item ${location.pathname === '/add-teacher' ? 'active' : ''}`}> 
      <FaChalkboardTeacher />
      <span>Teachers</span>
    </Link>
    <Link to="/add-classroom" className={`menu-item ${location.pathname === '/add-classroom' ? 'active' : ''}`}> 
      <FaChalkboard />
      <span>Classrooms</span>
    </Link>
    <Link to="/add-class" className={`menu-item ${location.pathname === '/add-class' ? 'active' : ''}`}> 
      <FaSchool />
      <span>Add Class</span>
    </Link>
    <Link to="/" className="menu-item"> 
      <FaSignOutAlt />
      <span>Logout</span>
    </Link>
  </div>
);

export default Sidebar; 