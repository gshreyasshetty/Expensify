import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency, formatPercentage, getBudgetStatusColor } from '../../utils/helpers';
import '../../styles/components/budget/BudgetCard.css';

/**
 * Card displaying budget information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.budget - Budget data
 * @param {string} [props.className] - Additional CSS classes
 */
const BudgetCard = ({ budget, className = '' }) => {
  const { calculateBudgetSpent } = useAppContext();
  
  if (!budget) return null;
  
  const spent = calculateBudgetSpent(budget.id);
  const remaining = budget.amount - spent;
  const percentUsed = budget.amount > 0 ? spent / budget.amount : 0;
  const statusColor = getBudgetStatusColor(percentUsed * 100);
  
  const cardStyle = {
    '--budget-color': `hsl(${budget.color})`,
  };
  
  return (
    <Link 
      to={`/budget/${budget.id}`} 
      className={`budget-card ${statusColor} ${className}`}
      style={cardStyle}
    >
      <div className="budget-card__header">
        <h3 className="budget-card__title">{budget.name}</h3>
        <span className="budget-card__amount">{formatCurrency(budget.amount)}</span>
      </div>
      
      <div className="budget-card__progress">
        <div 
          className={`budget-card__progress-bar budget-card__progress-bar--${statusColor}`}
          style={{ width: `${Math.min(percentUsed * 100, 100)}%` }}
        ></div>
      </div>
      
      <div className="budget-card__footer">
        <div className="budget-card__spent">
          <span className="budget-card__label">Spent</span>
          <span className="budget-card__value">{formatCurrency(spent)}</span>
        </div>
        
        <div className={`budget-card__remaining ${remaining < 0 ? 'negative' : ''}`}>
          <span className="budget-card__label">Remaining</span>
          <span className="budget-card__value">{formatCurrency(remaining)}</span>
        </div>
        
        <div className="budget-card__percentage">
          <span className="budget-card__label">Used</span>
          <span className="budget-card__value">{formatPercentage(percentUsed)}</span>
        </div>
      </div>
    </Link>
  );
};

export default BudgetCard;
