import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import '../../styles/components/budget/AddBudgetModal.css';

/**
 * Modal for adding a new budget
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when closing the modal
 */
const AddBudgetModal = ({ isOpen, onClose }) => {
  const { createBudget } = useAppContext();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter a budget name');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createBudget({ 
        name: name.trim(), 
        amount: amountValue 
      });
      
      // Reset form and close modal
      setName('');
      setAmount('');
      onClose();
    } catch (error) {
      setError('Failed to create budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    // Reset form state when closing
    setName('');
    setAmount('');
    setError('');
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Budget"
      size="small"
    >
      <form className="add-budget-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="budgetName" className="form-label">Budget Name</label>
          <input
            id="budgetName"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries, Rent, Transportation"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="budgetAmount" className="form-label">Budget Amount</label>
          <div className="input-with-prefix">
            <span className="input-prefix">₹</span>
            <input
              id="budgetAmount"
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            variant="primary"
            isLoading={isSubmitting}
          >
            Create Budget
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
