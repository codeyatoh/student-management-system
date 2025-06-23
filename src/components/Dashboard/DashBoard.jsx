import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUser, FaChalkboardTeacher, FaUserShield, FaChalkboard, 
  FaSchool, FaArrowLeft, FaArrowRight 
} from 'react-icons/fa';
import './Dashboard.css';
import nightbyteLogo from './assets/nightbyte.png';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Debugging: Log the current pathname and active status
  console.log('Current Pathname:', location.pathname);
  console.log('Is Dashboard link active?', location.pathname === '/dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const stats = [
    { label: 'Students', value: 0, color: '#ff7675', icon: <FaUser /> },
    { label: 'Teachers', value: 0, color: '#55efc4', icon: <FaChalkboardTeacher /> },
    { label: 'Class', value: 0, color: '#a29bfe', icon: <FaSchool /> },
    { label: 'Classrooms', value: 0, color: '#74b9ff', icon: <FaChalkboard /> },
  ];

  return (
    <div className={`dashboard-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <button onClick={toggleSidebar} className="sidebar-toggle">
              {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </div>
        </div>
        <div className="sidebar-profile">
          <img src={nightbyteLogo} alt="Profile" className="profile-pic" />
          {isSidebarOpen && (
            <div className="profile-info">
              <div className="profile-name">bunsai</div>
              <div className="profile-role">admin</div>
            </div>
          )}
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <span className="sidebar-icon" data-tooltip="Dashboard"><FaTachometerAlt /></span>
              {isSidebarOpen && <span className="sidebar-text">Dashboard</span>}
            </Link>
            {/* Debugging: Log the applied class for Dashboard link */}
            {console.log('Dashboard Link Class:', `sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`)}
          </li>
          <li>
            <Link to="/add-student" className={`sidebar-link ${location.pathname === '/add-student' ? 'active' : ''}`}>
              <span className="sidebar-icon" data-tooltip="Students"><FaUser /></span>
              {isSidebarOpen && <span className="sidebar-text">Students</span>}
            </Link>
          </li>
          <li>
            <Link to="/add-teacher" className={`sidebar-link ${location.pathname === '/add-teacher' ? 'active' : ''}`}>
              <span className="sidebar-icon" data-tooltip="Teachers"><FaChalkboardTeacher /></span>
              {isSidebarOpen && <span className="sidebar-text">Teachers</span>}
            </Link>
          </li>
          <li>
            <Link to="/add-classroom" className={`sidebar-link ${location.pathname === '/add-classroom' ? 'active' : ''}`}>
              <span className="sidebar-icon" data-tooltip="Classrooms"><FaChalkboard /></span>
              {isSidebarOpen && <span className="sidebar-text">Classrooms</span>}
            </Link>
          </li>
          <li>
            <Link to="/add-class" className={`sidebar-link ${location.pathname === '/add-class' ? 'active' : ''}`}>
              <span className="sidebar-icon" data-tooltip="Add Class"><FaSchool /></span>
              {isSidebarOpen && <span className="sidebar-text">Add Class</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h2>Student Management System</h2>
          <div className="user-info">
            <Link to="/" className="logout-btn">Log Out</Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map(stat => (
            <div key={stat.label} className="stat-card" style={{ backgroundColor: stat.color }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h4>{stat.label}</h4>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
