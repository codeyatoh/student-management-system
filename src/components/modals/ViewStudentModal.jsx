import React from 'react';
import './../modals/PixelAlert.css'; // Reusing the alert styles for consistency

const ViewStudentModal = ({ student, onClose }) => {
  if (!student) return null;

  const formatDate = (date) => {
    if (date && date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return date;
  };

  return (
    <div className="pixel-alert-overlay" onClick={onClose}>
      <div className="pixel-alert-box student-details-modal" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>Student Details</h3>
          <button className="pixel-alert-close" onClick={onClose}>×</button>
        </div>
        <div className="student-details-content">
          {student.photo_url && (
            <div className="student-photo-container">
              <img src={student.photo_url} alt={`${student.first_name} ${student.last_name}`} className="student-photo" />
            </div>
          )}
          <div className="student-info">
            <p><strong>Name:</strong> {`${student.first_name} ${student.last_name}`}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Contact:</strong> {student.contact_number}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Class ID:</strong> {student.class_id}</p>
            <p><strong>Date of Birth:</strong> {formatDate(student.date_of_birth)}</p>
            <p><strong>Enrollment Date:</strong> {formatDate(student.enrollment_date)}</p>
            <p><strong>Address:</strong> {student.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal; 