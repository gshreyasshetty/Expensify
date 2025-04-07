import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import '../../styles/components/expense/AddExpenseModal.css';

/**
 * Modal for adding a new expense
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {string} [props.defaultBudgetId] - Pre-selected budget ID
 */
const AddExpenseModal = ({ 
  isOpen, 
  onClose,
  defaultBudgetId = '' 
}) => {
  const { createExpense, budgets } = useAppContext();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [budgetId, setBudgetId] = useState(defaultBudgetId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Update budgetId when defaultBudgetId changes
  useEffect(() => {
    if (defaultBudgetId) {
      setBudgetId(defaultBudgetId);
    } else if (budgets.length > 0 && !budgetId) {
      setBudgetId(budgets[0].id);
    }
  }, [defaultBudgetId, budgets, budgetId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter an expense name');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }
    
    if (!budgetId) {
      setError('Please select a budget');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createExpense({
        name: name.trim(),
        amount: amountValue,
        budgetId
      });
      
      // Reset form and close modal
      setName('');
      setAmount('');
      // Don't reset budgetId to keep the last selection
      onClose();
    } catch (error) {
      setError('Failed to create expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    // Reset form state when closing
    setName('');
    setAmount('');
    // Don't reset budgetId to keep the last selection
    setError('');
    onClose();
  };
  
  // If no budgets available, don't allow adding expenses
  if (budgets.length === 0) {
    return null;
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Expense"
      size="small"
    >
      <form className="add-expense-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="expenseName" className="form-label">Expense Name</label>
          <input
            id="expenseName"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries, Dinner, Movie"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="expenseAmount" className="form-label">Amount</label>
          <div className="input-with-prefix">
            <span className="input-prefix">₹</span>
            <input
              id="expenseAmount"
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
        
        {!defaultBudgetId && (
          <div className="form-group">
            <label htmlFor="expenseBudget" className="form-label">Budget Category</label>
            <select
              id="expenseBudget"
              className="form-control"
              value={budgetId}
              onChange={(e) => setBudgetId(e.target.value)}
              required
              disabled={isSubmitting}
            >
              {budgets.map(budget => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
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
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
