import { FaChalkboardTeacher, FaUserShield, FaSchool, FaChalkboard, FaUser } from 'react-icons/fa';

// Dashboard stats configuration
export const getDashboardStats = (teacherCount, adminCount, studentCount = 0, classCount = 0) => [
  // { label: 'Teachers', value: teacherCount, color: '#55efc4', icon: 'teachers' },
  { label: 'Admins', value: adminCount, color: '#ff7675', icon: 'admins' },
  { label: 'Students', value: studentCount, color: '#a29bfe', icon: 'students' },
  { label: 'Classes', value: classCount, color: '#74b9ff', icon: 'classes' },
];

// Format numbers for display
export const formatStatNumber = (number) => {
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  }
  return number.toString();
};

// Get color based on stat value
export const getStatColor = (value, maxValue = 100) => {
  const percentage = (value / maxValue) * 100;
  if (percentage >= 80) return '#00ca4e'; // Green for high values
  if (percentage >= 50) return '#ffc107'; // Yellow for medium values
  return '#dc3545'; // Red for low values
}; 