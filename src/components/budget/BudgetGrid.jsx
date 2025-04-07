import React from 'react';
import BudgetCard from './BudgetCard';
import '../../styles/components/budget/BudgetGrid.css';

/**
 * Grid display of budget cards
 * 
 * @param {Object} props - Component props
 * @param {Array} props.budgets - List of budget objects
 */
const BudgetGrid = ({ budgets = [] }) => {
  if (!budgets.length) {
    return null;
  }
  
  return (
    <div className="budget-grid">
      {budgets.map(budget => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
};

export default BudgetGrid;
