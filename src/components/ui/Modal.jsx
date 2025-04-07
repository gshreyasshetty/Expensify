import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../icons';
import '../../styles/components/ui/Modal.css';

/**
 * Reusable modal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.title] - Modal title
 * @param {string} [props.size='medium'] - Modal size (small, medium, large)
 * @param {string} [props.className] - Additional CSS classes
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  className = ''
}) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const modalClasses = [
    'modal__container',
    `modal__container--${size}`,
    className
  ].filter(Boolean).join(' ');
  
  return createPortal(
    <div className="modal__overlay">
      <div className={modalClasses} ref={modalRef}>
        <button 
          className="modal__close" 
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        
        {title && <h2 className="modal__title">{title}</h2>}
        
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
