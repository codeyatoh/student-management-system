import React, { useState, useEffect } from 'react';

const AddClassroomForm = ({ open, onClose, onSubmit, classroomToEdit }) => {
  const [formData, setFormData] = useState({
    room_number: '',
    building_name: '',
    capacity: '',
    available_resources: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && classroomToEdit) {
      setFormData({
        room_number: classroomToEdit.room_number || '',
        building_name: classroomToEdit.building_name || '',
        capacity: classroomToEdit.capacity ? classroomToEdit.capacity.toString() : '',
        available_resources: classroomToEdit.available_resources ? classroomToEdit.available_resources.join(', ') : ''
      });
    } else if (open) {
      setFormData({
        room_number: '',
        building_name: '',
        capacity: '',
        available_resources: ''
      });
      setErrors({});
    }
  }, [open, classroomToEdit]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.room_number) newErrors.room_number = 'Room number is required';
    if (!formData.building_name) newErrors.building_name = 'Building name is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) newErrors.capacity = 'Capacity must be a positive number';
    if (!formData.available_resources) newErrors.available_resources = 'Available resources are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        capacity: Number(formData.capacity),
        available_resources: formData.available_resources.split(',').map(r => r.trim()).filter(Boolean)
      }, classroomToEdit?.id);
    }
  };

  const handleCancel = () => {
    setFormData({
      room_number: '',
      building_name: '',
      capacity: '',
      available_resources: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="pixel-alert-overlay" onClick={handleCancel}>
      <div className="pixel-alert-box classroom-form-modal" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>{classroomToEdit ? 'Edit Classroom' : 'Add New Classroom'}</h3>
          <button className="pixel-alert-close" onClick={handleCancel}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-student-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="room_number">Room Number</label>
              <input
                type="text"
                id="room_number"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                className={errors.room_number ? 'error' : ''}
                placeholder="e.g., 101, B202"
              />
              {errors.room_number && <span className="error-message">{errors.room_number}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="building_name">Building Name</label>
              <input
                type="text"
                id="building_name"
                name="building_name"
                value={formData.building_name}
                onChange={handleChange}
                className={errors.building_name ? 'error' : ''}
                placeholder="e.g., Main Building, Annex A"
              />
              {errors.building_name && <span className="error-message">{errors.building_name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={errors.capacity ? 'error' : ''}
                min="1"
                placeholder="e.g., 50"
              />
              {errors.capacity && <span className="error-message">{errors.capacity}</span>}
            </div>
            <div className="form-group full-width">
              <label htmlFor="available_resources">Available Resources (comma separated)</label>
              <textarea
                id="available_resources"
                name="available_resources"
                value={formData.available_resources}
                onChange={handleChange}
                className={errors.available_resources ? 'error' : ''}
                rows="3"
                placeholder="e.g., Projector, Whiteboard, WiFi"
              />
              {errors.available_resources && <span className="error-message">{errors.available_resources}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {classroomToEdit ? 'Update Classroom' : 'Add Classroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassroomForm; 