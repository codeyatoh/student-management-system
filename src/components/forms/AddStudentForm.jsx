import React, { useState, useEffect } from 'react';

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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) newErrors[key] = 'This field is required';
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (formData.contact_number && !/^\+?[\d\s-]{10,}$/.test(formData.contact_number)) newErrors.contact_number = 'Please enter a valid contact number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
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
              <label htmlFor="class_id">Class ID</label>
              <input
                type="text"
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className={errors.class_id ? 'error' : ''}
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