import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { TrashIcon } from '../icons';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';
import '../../styles/components/expense/ExpenseList.css';

/**
 * Component to display a table of expenses
 * 
 * @param {Object} props - Component props
 * @param {Array} props.expenses - List of expense objects
 * @param {boolean} [props.showBudgetColumn=true] - Whether to show the budget column
 */
const ExpenseList = ({ 
  expenses = [], 
  showBudgetColumn = true 
}) => {
  const { deleteExpense, getBudget } = useAppContext();
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
  };
  
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteExpense(expenseToDelete.id);
    } finally {
      setIsDeleting(false);
      setExpenseToDelete(null);
    }
  };
  
  if (!expenses.length) {
    return null;
  }
  
  // Get budget name for an expense
  const getBudgetName = (budgetId) => {
    const budget = getBudget(budgetId);
    return budget ? budget.name : 'Unknown';
  };
  
  // Get budget color for an expense
  const getBudgetColor = (budgetId) => {
    const budget = getBudget(budgetId);
    return budget ? budget.color : '0, 0%, 50%';
  };
  
  return (
    <>
      <div className="expense-list">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Expense</th>
              <th>Amount</th>
              <th>Date</th>
              {showBudgetColumn && <th>Budget</th>}
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id} className="expense-row">
                <td className="expense-name">{expense.name}</td>
                <td className="expense-amount">{formatCurrency(expense.amount)}</td>
                <td className="expense-date">{formatDate(expense.createdAt)}</td>
                
                {showBudgetColumn && (
                  <td className="expense-budget">
                    <Link 
                      to={`/budget/${expense.budgetId}`}
                      className="budget-tag"
                      style={{ '--budget-color': `hsl(${getBudgetColor(expense.budgetId)})` }}
                    >
                      {getBudgetName(expense.budgetId)}
                    </Link>
                  </td>
                )}
                
                <td className="expense-actions">
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(expense)}
                    aria-label={`Delete ${expense.name} expense`}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <DeleteConfirmModal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Expense"
        message={expenseToDelete ? `Are you sure you want to delete "${expenseToDelete.name}" expense?` : ''}
      />
    </>
  );
};

export default ExpenseList;
