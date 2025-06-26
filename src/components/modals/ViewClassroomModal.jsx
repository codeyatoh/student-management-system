import React, { useState } from 'react';
import './PixelAlert.css';

const ViewClassroomModal = ({ classroom, students, classes, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  if (!classroom) return null;

  const maleStudents = students.filter(s => s.gender === 'male');
  const femaleStudents = students.filter(s => s.gender === 'female');
  const assignedCount = students.length;
  const remainingSlots = classroom.capacity - assignedCount;

  let filteredStudents = students;
  if (activeTab === 'male') filteredStudents = maleStudents;
  if (activeTab === 'female') filteredStudents = femaleStudents;

  // Classes assigned to this classroom (by assignment)
  const assignedClasses = classes
    .map(cls => {
      const assignment = Array.isArray(cls.assignments)
        ? cls.assignments.find(a => a.classroom_id === classroom.id)
        : null;
      if (!assignment) return null;
      return {
        ...cls,
        schedule: assignment.schedule ? `${assignment.schedule.day} ${assignment.schedule.time}` : '',
        teacher: assignment.teacher_name || 'N/A'
      };
    })
    .filter(Boolean);

  return (
    <div className="pixel-alert-overlay" onClick={onClose}>
      <div className="pixel-alert-box" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>Classroom Details</h3>
          <button className="pixel-alert-close" onClick={onClose}>×</button>
        </div>
        <div className="classroom-details-content" style={{ padding: '1.5rem' }}>
          <div className="classroom-info" style={{ marginBottom: '1.5rem' }}>
            <p><strong>Room Number:</strong> {classroom.room_number}</p>
            <p><strong>Building Name:</strong> {classroom.building_name}</p>
            <p><strong>Capacity:</strong> {classroom.capacity}</p>
            <p><strong>Remaining slots:</strong> {remainingSlots}</p>
          </div>
          <div className="classroom-students-list" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.7rem' }}>
              <button
                className={`add-student-btn${activeTab === 'all' ? ' active' : ''}`}
                style={activeTab === 'all' ? { minWidth: 90, background: '#3498db', color: '#fff' } : { minWidth: 90 }}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`add-student-btn${activeTab === 'male' ? ' active' : ''}`}
                style={activeTab === 'male' ? { minWidth: 90, background: '#3498db', color: '#fff' } : { minWidth: 90 }}
                onClick={() => setActiveTab('male')}
              >
                Male
              </button>
              <button
                className={`add-student-btn${activeTab === 'female' ? ' active' : ''}`}
                style={activeTab === 'female' ? { minWidth: 90, background: '#3498db', color: '#fff' } : { minWidth: 90 }}
                onClick={() => setActiveTab('female')}
              >
                Female
              </button>
            </div>
            <h4 style={{ marginBottom: '0.7rem' }}>Assigned Students ({filteredStudents.length})</h4>
            {filteredStudents.length === 0 ? (
              <p style={{ color: '#888' }}>No students assigned to this classroom.</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr style={{ background: '#4b4b8b', color: '#fff' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>No.</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{student.first_name} {student.last_name}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{student.email}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', textTransform: 'capitalize' }}>{student.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="classroom-classes-list">
            <h4 style={{ marginBottom: '0.7rem' }}>Classes in this Classroom ({classes.length})</h4>
            {classes.length === 0 ? (
              <p style={{ color: '#888' }}>No classes assigned to this classroom.</p>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr style={{ background: '#4b4b8b', color: '#fff' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Class Name</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Subject</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Schedule</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedClasses.map((classItem, idx) => (
                    <tr key={classItem.id}>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{classItem.class_name}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{classItem.subject}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{classItem.schedule}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{classItem.teacher}</td>
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

export default ViewClassroomModal; 