import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';
import { db } from '../../../config/firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';
import Sidebar from '../../layout/Sidebar/Sidebar';
import { getDashboardStats, formatStatNumber } from '../../../utils/dashboardHelpers';
import { FaChalkboardTeacher, FaUserShield, FaUser, FaSchool } from 'react-icons/fa';

const iconMap = {
  teachers: <FaChalkboardTeacher />,
  admins: <FaUserShield />,
  students: <FaUser />,
  classes: <FaSchool />,
};

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true';
  });
  const location = useLocation();
  const [teacherCount, setTeacherCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  useEffect(() => {
    // Listen for real-time updates for teachers
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snapshot) => {
      setTeacherCount(snapshot.size);
    });
    
    // Listen for real-time updates for admins
    const unsubAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
      setAdminCount(snapshot.size);
    });
    
    // Listen for real-time updates for students
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudentCount(snapshot.size);
    });
    
    // Listen for real-time updates for classes
    const unsubClasses = onSnapshot(collection(db, 'classes'), (snapshot) => {
      setClassCount(snapshot.size);
    });
    
    return () => {
      unsubTeachers();
      unsubAdmins();
      unsubStudents();
      unsubClasses();
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      localStorage.setItem('sidebarCollapsed', !prev);
      return !prev;
    });
  };

  // Use utility function to get stats configuration
  const stats = getDashboardStats(teacherCount, adminCount, studentCount, classCount);

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
              <div className="stat-icon">{iconMap[stat.icon]}</div>
              <div className="stat-info">
                <h4>{stat.label}</h4>
                <p>{formatStatNumber(stat.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
