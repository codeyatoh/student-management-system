import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import './PixelAlert.css';

const ViewClassModal = ({ classData, onClose }) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!classData || !classData.assignments) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);

      try {
        const detailedAssignments = await Promise.all(
          classData.assignments.map(async (assignment) => {
            let teacherName = 'N/A';
            if (assignment.teacher_id) {
              const teacherDoc = await getDoc(doc(db, 'teachers', assignment.teacher_id));
              if (teacherDoc.exists()) {
                const t = teacherDoc.data();
                teacherName = `${t.first_name || ''} ${t.last_name || ''}`.trim();
              }
            }

            let classroomName = 'N/A';
            if (assignment.classroom_id) {
              const classroomDoc = await getDoc(doc(db, 'classrooms', assignment.classroom_id));
              if (classroomDoc.exists()) {
                const c = classroomDoc.data();
                classroomName = `${c.room_number || ''} (${c.building_name || ''})`.trim();
              }
            }

            return {
              ...assignment,
              teacherName,
              classroomName,
            };
          })
        );
        setAssignments(detailedAssignments);
      } catch (error) {
        console.error("Error fetching assignment details:", error);
        setAssignments([]);
      }
      
      setIsLoading(false);
    };

    fetchDetails();
  }, [classData]);

  if (!classData) return null;

  return (
    <div className="pixel-alert-overlay" onClick={onClose}>
      <div className="pixel-alert-box class-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>Class Details</h3>
          <button className="pixel-alert-close" onClick={onClose}>×</button>
        </div>
        <div className="class-details-content">
          <p><strong>Class Name:</strong> {classData.class_name}</p>
          <p><strong>Subject:</strong> {classData.subject}</p>
          
          <div className="details-section">
            <strong>Class Schedules:</strong>
            {isLoading ? <p>Loading...</p> : (
              <table className="mini-table assignments-table">
                <thead>
                  <tr style={{ background: '#4b4b8b', color: '#fff' }}>
                    <th style={{ color: '#fff' }}>TEACHER</th>
                    <th style={{ color: '#fff' }}>CLASSROOM</th>
                    <th style={{ textAlign: 'center', color: '#fff' }}>DAY</th>
                    <th style={{ textAlign: 'center', color: '#fff' }}>TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, idx) => (
                    <tr key={idx}>
                      <td>{assignment.teacher_name}</td>
                      <td>{assignment.classroomName}</td>
                      <td style={{ textAlign: 'center' }}>{assignment.schedule && assignment.schedule.day ? assignment.schedule.day : ''}</td>
                      <td style={{ textAlign: 'center' }}>{assignment.schedule && assignment.schedule.time ? assignment.schedule.time : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClassModal; 