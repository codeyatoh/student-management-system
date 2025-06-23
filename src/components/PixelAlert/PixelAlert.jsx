import React from 'react';
import './PixelAlert.css';

const PixelAlert = ({ message, onClose, type = 'success' }) => {
  return (
    <div className={`pixel-alert-overlay`}>
      <div className={`pixel-alert-box ${type}`}>
        <div className="pixel-alert-header">
          <span>{type === 'success' ? 'Success!' : 'Error!'}</span>
          <button className="pixel-alert-close" onClick={onClose}>✕</button>
        </div>
        <div className="pixel-alert-message">{message}</div>
      </div>
    </div>
  );
};

export default PixelAlert; 