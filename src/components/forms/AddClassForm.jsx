import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { validateClassForm } from '../../utils/classHelpers';
import { db } from '../../config/firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const AddClassForm = ({ open, onClose, onSubmit, classToEdit }) => {
  const [formData, setFormData] = useState({
    class_name: '',
    subject: '',
    schedule: '',
    teacher_id: '',
    classroom_id: ''
  });
  const [errors, setErrors] = useState({});
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [classroomOptions, setClassroomOptions] = useState([]);

  useEffect(() => {
    // Fetch teachers for dropdown
    const fetchTeachers = async () => {
      try {
        const teachersCollection = collection(db, 'teachers');
        const q = query(teachersCollection, orderBy('first_name'));
        const teacherSnapshot = await getDocs(q);
        const options = teacherSnapshot.docs.map(doc => ({
          value: doc.id,
          label: (doc.data().first_name || '') + (doc.data().last_name ? ' ' + doc.data().last_name : '')
        }));
        setTeacherOptions(options);
      } catch (error) {
        setTeacherOptions([]);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    // Fetch classrooms for dropdown
    const fetchClassrooms = async () => {
      try {
        const classroomsCollection = collection(db, 'classrooms');
        const q = query(classroomsCollection, orderBy('name'));
        const classroomSnapshot = await getDocs(q);
        const options = classroomSnapshot.docs.map(doc => ({
          value: doc.id,
          label: doc.data().name
        }));
        setClassroomOptions(options);
      } catch (error) {
        setClassroomOptions([]);
      }
    };
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (open && classToEdit) {
      setFormData({
        class_name: classToEdit.class_name || '',
        subject: classToEdit.subject || '',
        schedule: classToEdit.schedule || '',
        teacher_id: classToEdit.teacher_id || '',
        classroom_id: classToEdit.classroom_id || ''
      });
    } else {
      // Reset form when modal is closed or opened for adding
      setFormData({
        class_name: '',
        subject: '',
        schedule: '',
        teacher_id: '',
        classroom_id: ''
      });
      setErrors({});
    }
  }, [open, classToEdit]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTeacherChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, teacher_id: selectedOption ? selectedOption.value : '' }));
    if (errors.teacher_id) setErrors(prev => ({ ...prev, teacher_id: '' }));
  };

  const handleClassroomChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, classroom_id: selectedOption ? selectedOption.value : '' }));
    if (errors.classroom_id) setErrors(prev => ({ ...prev, classroom_id: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateClassForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData, classToEdit?.id);
      setFormData({
        class_name: '',
        subject: '',
        schedule: '',
        teacher_id: '',
        classroom_id: ''
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      class_name: '',
      subject: '',
      schedule: '',
      teacher_id: '',
      classroom_id: ''
    });
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
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="schedule">Schedule</label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className={errors.schedule ? 'error' : ''}
              />
              {errors.schedule && <span className="error-message">{errors.schedule}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="teacher_id">Teacher</label>
              <Select
                id="teacher_id"
                name="teacher_id"
                value={teacherOptions.find(option => option.value === formData.teacher_id) || null}
                onChange={handleTeacherChange}
                options={teacherOptions}
                placeholder="Select Teacher..."
                isClearable
                classNamePrefix="react-select"
                className={errors.teacher_id ? 'error' : ''}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: '2.6rem',
                    height: '2.6rem',
                    borderRadius: '4px',
                    borderColor: errors.teacher_id ? '#dc3545' : '#2c2c54',
                    boxShadow: state.isFocused ? '0 0 0 2px #ffbd44' : 'none',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                    color: '#2c2c54',
                    background: '#fff',
                    paddingLeft: '0',
                  }),
                  valueContainer: base => ({
                    ...base,
                    padding: '0 0.7rem',
                  }),
                  input: base => ({
                    ...base,
                    margin: '0',
                    padding: '0',
                  }),
                  placeholder: base => ({
                    ...base,
                    color: '#b0b0d0',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                  }),
                  singleValue: base => ({
                    ...base,
                    color: '#2c2c54',
                  }),
                  menu: base => ({
                    ...base,
                    zIndex: 9999,
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#4b4b8b'
                      : state.isFocused
                      ? '#e0e0ff'
                      : '#fff',
                    color: state.isSelected ? '#fff' : '#2c2c54',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                  }),
                  dropdownIndicator: base => ({
                    ...base,
                    color: '#2c2c54',
                  }),
                  clearIndicator: base => ({
                    ...base,
                    color: '#dc3545',
                  }),
                }}
              />
              {errors.teacher_id && <span className="error-message">{errors.teacher_id}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="classroom_id">Classroom</label>
              <Select
                id="classroom_id"
                name="classroom_id"
                value={classroomOptions.find(option => option.value === formData.classroom_id) || null}
                onChange={handleClassroomChange}
                options={classroomOptions}
                placeholder="Select Classroom..."
                isClearable
                classNamePrefix="react-select"
                className={errors.classroom_id ? 'error' : ''}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: '2.6rem',
                    height: '2.6rem',
                    borderRadius: '4px',
                    borderColor: errors.classroom_id ? '#dc3545' : '#2c2c54',
                    boxShadow: state.isFocused ? '0 0 0 2px #ffbd44' : 'none',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                    color: '#2c2c54',
                    background: '#fff',
                    paddingLeft: '0',
                  }),
                  valueContainer: base => ({
                    ...base,
                    padding: '0 0.7rem',
                  }),
                  input: base => ({
                    ...base,
                    margin: '0',
                    padding: '0',
                  }),
                  placeholder: base => ({
                    ...base,
                    color: '#b0b0d0',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                  }),
                  singleValue: base => ({
                    ...base,
                    color: '#2c2c54',
                  }),
                  menu: base => ({
                    ...base,
                    zIndex: 9999,
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#4b4b8b'
                      : state.isFocused
                      ? '#e0e0ff'
                      : '#fff',
                    color: state.isSelected ? '#fff' : '#2c2c54',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.9rem',
                  }),
                  dropdownIndicator: base => ({
                    ...base,
                    color: '#2c2c54',
                  }),
                  clearIndicator: base => ({
                    ...base,
                    color: '#dc3545',
                  }),
                }}
              />
              {errors.classroom_id && <span className="error-message">{errors.classroom_id}</span>}
            </div>
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