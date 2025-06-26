import React from 'react';
import './PixelAlert.css'; // Reusing the alert styles

const DeleteConfirmationModal = ({
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this student? This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'No',
}) => {
  return (
    <div className="pixel-alert-overlay" onClick={onCancel}>
      <div className="pixel-alert-box" onClick={e => e.stopPropagation()}>
        <div className="pixel-alert-header">
          <h3>{title}</h3>
          <button className="pixel-alert-close" onClick={onCancel}>×</button>
        </div>
        <div className="pixel-alert-message">
          <p>{message}</p>
        </div>
        <div className="confirmation-buttons">
          <button onClick={onConfirm} className="confirm-btn-delete">{confirmLabel}</button>
          <button onClick={onCancel} className="confirm-btn-cancel">{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 