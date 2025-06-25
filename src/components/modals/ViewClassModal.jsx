import React from 'react';
import { getTeacherName, getClassroomName } from '../../utils/classHelpers';

const ViewClassModal = ({ classData, onClose }) => {
  if (!classData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Class Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="class-details-content">
          <div className="class-info">
            <p><strong>Class Name:</strong> {classData.class_name}</p>
            <p><strong>Subject:</strong> {classData.subject}</p>
            <p><strong>Schedule:</strong> {classData.schedule}</p>
            <p><strong>Teacher:</strong> {getTeacherName(classData.teacher_id)}</p>
            <p><strong>Classroom:</strong> {getClassroomName(classData.classroom_id)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClassModal; 