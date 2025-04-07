import React from 'react';
import Button from './Button';
import Modal from './Modal';
import { TrashIcon } from '../icons';
import '../../styles/components/ui/DeleteConfirmModal.css';

/**
 * Confirmation modal for delete operations
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.onConfirm - Function to call when confirming the deletion
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {boolean} [props.isDeleting] - Loading state during deletion
 */
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this? This action cannot be undone.',
  isDeleting = false
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="delete-confirm-modal"
    >
      <div className="delete-confirm-modal__header">
        <div className="delete-confirm-modal__icon">
          <TrashIcon />
        </div>
        <h2 className="delete-confirm-modal__title">{title}</h2>
      </div>
      
      <div className="delete-confirm-modal__content">
        <p className="delete-confirm-modal__message">{message}</p>
      </div>
      
      <div className="delete-confirm-modal__actions">
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        
        <Button 
          variant="danger" 
          onClick={handleConfirm}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
