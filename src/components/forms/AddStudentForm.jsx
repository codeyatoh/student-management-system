import React, { useState, useEffect } from 'react';
import { validateStudentForm } from '../../utils/studentHelpers';
import Select from 'react-select';
import { db } from '../../config/firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const AddStudentForm = ({ open, onClose, onSubmit, studentToEdit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    email: '',
    address: '',
    enrollment_date: '',
    class_id: '',
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [classOptions, setClassOptions] = useState([]);

  useEffect(() => {
    // Fetch classes for dropdown
    const fetchClasses = async () => {
      try {
        const classesCollection = collection(db, 'classes');
        const q = query(classesCollection, orderBy('class_name'));
        const classSnapshot = await getDocs(q);
        const options = classSnapshot.docs.map(doc => ({
          value: doc.id,
          label: doc.data().class_name
        }));
        setClassOptions(options);
      } catch (error) {
        setClassOptions([]);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (open && studentToEdit) {
      const formattedData = {
        ...studentToEdit,
        date_of_birth: studentToEdit.date_of_birth?.toDate ? studentToEdit.date_of_birth.toDate().toISOString().split('T')[0] : '',
        enrollment_date: studentToEdit.enrollment_date?.toDate ? studentToEdit.enrollment_date.toDate().toISOString().split('T')[0] : '',
      };
      setFormData(formattedData);
      if (studentToEdit.photo_url) {
        setPhotoPreview(studentToEdit.photo_url);
      }
    } else {
      // Reset form when modal is closed or opened for adding
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        address: '',
        enrollment_date: '',
        class_id: '',
        photo: null
      });
      setPhotoPreview(null);
      setErrors({});
    }
  }, [open, studentToEdit]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (file) {
        setPhotoPreview(URL.createObjectURL(file));
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleClassChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, class_id: selectedOption ? selectedOption.value : '' }));
    if (errors.class_id) setErrors(prev => ({ ...prev, class_id: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateStudentForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData, studentToEdit?.id);
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        address: '',
        enrollment_date: '',
        class_id: '',
        photo: null
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      contact_number: '',
      email: '',
      address: '',
      enrollment_date: '',
      class_id: '',
      photo: null
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="pixel-alert-overlay" onClick={handleCancel}>
      <div className="pixel-alert-box student-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>{studentToEdit ? 'Edit Student' : 'Add New Student'}</h3>
          <button className="pixel-alert-close" onClick={handleCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="add-student-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={errors.date_of_birth ? 'error' : ''}
              />
              {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="contact_number">Contact Number</label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className={errors.contact_number ? 'error' : ''}
              />
              {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
                rows="3"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="enrollment_date">Enrollment Date</label>
              <input
                type="date"
                id="enrollment_date"
                name="enrollment_date"
                value={formData.enrollment_date}
                onChange={handleChange}
                className={errors.enrollment_date ? 'error' : ''}
              />
              {errors.enrollment_date && <span className="error-message">{errors.enrollment_date}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="class_id">Class</label>
              <Select
                id="class_id"
                name="class_id"
                value={classOptions.find(option => option.value === formData.class_id) || null}
                onChange={handleClassChange}
                options={classOptions}
                placeholder="Select Class..."
                isClearable
                classNamePrefix="react-select"
                className={errors.class_id ? 'error' : ''}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: '2.6rem',
                    height: '2.6rem',
                    borderRadius: '4px',
                    borderColor: errors.class_id ? '#dc3545' : '#2c2c54',
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
              {errors.class_id && <span className="error-message">{errors.class_id}</span>}
            </div>
            <div className="form-group photo-upload-group">
              <label htmlFor="photo">Photo Upload</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
              />
              <label htmlFor="photo" className="file-upload-label">
                Choose File
              </label>
              {errors.photo && <span className="error-message">{errors.photo}</span>}
              <div className="photo-preview-container">
                {photoPreview ? (
                  <img src={photoPreview} alt="Student Preview" className="photo-preview" />
                ) : (
                  <div className="photo-preview-placeholder">
                    <span>Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {studentToEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm; 