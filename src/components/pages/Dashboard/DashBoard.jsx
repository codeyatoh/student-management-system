import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserShield, FaSchool, FaChalkboard } from 'react-icons/fa';
import './Dashboard.css';
import { db } from '../../../config/firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';
import Sidebar from '../../layout/Sidebar/Sidebar';

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
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} location={location} />
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
