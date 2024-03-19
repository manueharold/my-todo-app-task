import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    const handleConfirm = () => {
      onConfirm(); // Execute the action function when the user confirms
      onCancel(); // Hide the modal
    };

    const handleCancel = () => {
        onCancel(); // Hide the modal if the user cancels
      };

  
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={handleCancel} style={{ color: 'white' }}>Cancel</button>
          <button onClick={handleConfirm} style={{ color: 'white' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
