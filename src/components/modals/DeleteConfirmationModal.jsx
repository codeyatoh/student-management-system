import React from 'react';
import './PixelAlert.css'; // Reusing the alert styles

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="pixel-alert-overlay" onClick={onCancel}>
      <div className="pixel-alert-box" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>Confirm Deletion</h3>
          <button className="pixel-alert-close" onClick={onCancel}>×</button>
        </div>
        <div className="pixel-alert-message">
          <p>Are you sure you want to delete this student?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="confirmation-buttons">
          <button onClick={onConfirm} className="confirm-btn-delete">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 