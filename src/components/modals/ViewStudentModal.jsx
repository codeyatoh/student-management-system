import React, { useState, useEffect } from 'react';
import './../modals/PixelAlert.css'; // Reusing the alert styles for consistency
import { db } from '../../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const ViewStudentModal = ({ student, onClose }) => {
  const [enrolledAssignments, setEnrolledAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      if (student && student.enrollments && student.enrollments.length > 0) {
        setIsLoading(true);
        try {
          // Fetch all data needed for mapping
          const [classSnapshot, classroomSnapshot] = await Promise.all([
            getDocs(collection(db, 'classes')),
            getDocs(collection(db, 'classrooms'))
          ]);
          
          const classMap = classSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { id: doc.id, ...doc.data() };
            return acc;
          }, {});

          const classroomMap = classroomSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          }, {});
          
          const details = student.enrollments.map(enrollment => {
            const cls = classMap[enrollment.classId];
            if (!cls || !cls.assignments) return null;
            const assignment = cls.assignments.find(a => a.id === enrollment.assignmentId);
            if (!assignment) return null;
            const classroom = classroomMap[assignment.classroom_id];
            return {
              classId: cls.id,
              assignmentId: assignment.id,
              className: cls.class_name,
              subject: cls.subject,
              teacherName: assignment.teacher_name || 'N/A',
              classroomName: classroom ? `${classroom.room_number} (${classroom.building_name})` : 'N/A',
              schedule: `${assignment.schedule.day} ${assignment.schedule.time}`,
            };
          }).filter(Boolean);

          setEnrolledAssignments(details);
        } catch (error) {
          console.error("Error fetching enrollment details: ", error);
          setEnrolledAssignments([]);
        }
        setIsLoading(false);
      } else {
        setEnrolledAssignments([]);
      }
    };
    fetchEnrollmentDetails();
  }, [student]);

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
          <div className="student-photo-container">
            <img src={student.photo_url || 'https://via.placeholder.com/150'} alt={`${student.first_name} ${student.last_name}`} className="student-photo" />
          </div>
          <div className="student-info">
            <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Date of Birth:</strong> {formatDate(student.date_of_birth)}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Contact:</strong> {student.contact_number}</p>
            <p><strong>Address:</strong> {student.address}</p>
            <p><strong>Enrollment Date:</strong> {formatDate(student.enrollment_date)}</p>
          </div>
        </div>
        <div className="student-classes-section">
          <h3 style={{ fontWeight: 'bold', color: '#2c2c54', fontSize: '1.1rem', margin: '1.5rem 0 0.5rem 0' }}>
            Enrolled Subjects ({enrolledAssignments.length})
          </h3>
          {isLoading ? (
            <p>Loading classes...</p>
          ) : enrolledAssignments.length > 0 ? (
            <table className="mini-table" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Class</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Classroom</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Schedule</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {enrolledAssignments.map((assignment, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {assignment.className} {assignment.subject ? `(${assignment.subject})` : ''}
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{assignment.classroomName}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{assignment.schedule}</td>
                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{assignment.teacherName || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Not enrolled in any assignments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal; 