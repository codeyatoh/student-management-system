import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUser, FaChalkboardTeacher, FaUserShield, FaChalkboard, 
  FaSchool, FaChevronLeft, FaSignOutAlt 
} from 'react-icons/fa';
import './Dashboard.css';
import nightbyteLogo from '../../assets/nightbyte.png';
import { db } from '../../assets/firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [teacherCount, setTeacherCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    // Listen for real-time updates for teachers
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snapshot) => {
      setTeacherCount(snapshot.size);
    });
    // Listen for real-time updates for admins
    const unsubAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
      setAdminCount(snapshot.size);
    });
    return () => {
      unsubTeachers();
      unsubAdmins();
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const stats = [
    { label: 'Teachers', value: teacherCount, color: '#55efc4', icon: <FaChalkboardTeacher /> },
    { label: 'Admins', value: adminCount, color: '#ff7675', icon: <FaUserShield /> },
    { label: 'Class', value: 0, color: '#a29bfe', icon: <FaSchool /> },
    { label: 'Classrooms', value: 0, color: '#74b9ff', icon: <FaChalkboard /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
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

        <Link to="/add-student" className={`menu-item ${location.pathname === '/add-student' ? 'active' : ''}`}> 
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

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h2>Student Management System</h2>
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
