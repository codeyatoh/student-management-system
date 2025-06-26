import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { validateClassForm } from '../../utils/classHelpers';
import { db } from '../../config/firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const AddClassForm = ({ open, onClose, onSubmit, classToEdit }) => {
  const initialAssignment = { teacher_name: '', classroom_id: '', schedule: { day: '', time: '' } };
  const [formData, setFormData] = useState({
    class_name: '',
    subject: '',
    assignments: [initialAssignment]
  });
  const [errors, setErrors] = useState({});
  const [classroomOptions, setClassroomOptions] = useState([]);

  useEffect(() => {
    // Fetch classrooms for dropdown
    const fetchClassrooms = async () => {
      try {
        const classroomsCollection = collection(db, 'classrooms');
        const q = query(classroomsCollection, orderBy('room_number'));
        const classroomSnapshot = await getDocs(q);
        const options = classroomSnapshot.docs.map(doc => ({
          value: doc.id,
          label: doc.data().room_number + (doc.data().building_name ? ` (${doc.data().building_name})` : '')
        }));
        setClassroomOptions(options);
      } catch (error) {
        setClassroomOptions([]);
      }
    };
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (open) {
      if (classToEdit) {
        setFormData({
          class_name: classToEdit.class_name || '',
          subject: classToEdit.subject || '',
          assignments: classToEdit.assignments && classToEdit.assignments.length > 0 ? classToEdit.assignments : [initialAssignment]
        });
      } else {
        setFormData({
          class_name: '',
          subject: '',
          assignments: [initialAssignment]
        });
      }
      setErrors({});
    }
  }, [open, classToEdit]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleAssignmentChange = (index, field, value) => {
    const newAssignments = [...formData.assignments];
    if (field === 'day' || field === 'time') {
      newAssignments[index].schedule[field] = value;
    } else {
      newAssignments[index][field] = value;
    }
    setFormData(prev => ({ ...prev, assignments: newAssignments }));
  };

  const addAssignment = () => {
    setFormData(prev => ({ ...prev, assignments: [...prev.assignments, initialAssignment] }));
  };

  const removeAssignment = (index) => {
    const newAssignments = formData.assignments.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, assignments: newAssignments }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateClassForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const formDataWithIds = {
        ...formData,
        assignments: formData.assignments.map(a => ({
          ...a,
          id: a.id || `as_${Math.random().toString(36).substring(2, 11)}`
        }))
      };
      onSubmit(formDataWithIds, classToEdit?.id);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="pixel-alert-overlay" onClick={handleCancel}>
      <div className="pixel-alert-box class-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>{classToEdit ? 'Edit Class' : 'Add New Class'}</h3>
          <button className="pixel-alert-close" onClick={handleCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="add-class-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="class_name">Class Name</label>
              <input
                type="text"
                id="class_name"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                className={errors.class_name ? 'error' : ''}
                placeholder="e.g., Creative Writing 101"
              />
              {errors.class_name && <span className="error-message">{errors.class_name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={errors.subject ? 'error' : ''}
                placeholder="e.g., Literature"
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>
          </div>
          
          <div className="form-group-dynamic">
            <label>Assignments</label>
            {formData.assignments.map((assignment, index) => (
              <div key={index} className="assignment-entry">
                <input
                  type="text"
                  value={assignment.teacher_name || ''}
                  onChange={e => handleAssignmentChange(index, 'teacher_name', e.target.value)}
                  placeholder="Enter Teacher Name"
                />
                <Select
                  value={classroomOptions.find(option => option.value === assignment.classroom_id)}
                  onChange={(option) => handleAssignmentChange(index, 'classroom_id', option ? option.value : '')}
                  options={classroomOptions}
                  placeholder="Select Classroom..."
                  classNamePrefix="react-select"
                  className="assignment-select"
                />
                <input
                  type="text"
                  value={assignment.schedule.day}
                  onChange={(e) => handleAssignmentChange(index, 'day', e.target.value)}
                  placeholder="e.g., MWF"
                />
                <input
                  type="text"
                  value={assignment.schedule.time}
                  onChange={(e) => handleAssignmentChange(index, 'time', e.target.value)}
                  placeholder="e.g., 9-10:30 AM"
                />
                {formData.assignments.length > 1 && (
                  <button type="button" onClick={() => removeAssignment(index)} className="remove-btn">-</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addAssignment} className="add-btn">+</button>
            {errors.assignments && <span className="error-message">{errors.assignments}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {classToEdit ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassForm; 