import React from 'react';
import { formatCurrency, formatPercentage } from '../../utils/helpers';
import '../../styles/components/dashboard/DashboardStats.css';

/**
 * Dashboard statistics summary component
 * 
 * @param {Object} props - Component props
 * @param {number} props.totalBudgeted - Total budgeted amount
 * @param {number} props.totalSpent - Total spent amount
 * @param {number} props.totalRemaining - Total remaining amount
 */
const DashboardStats = ({ 
  totalBudgeted = 0, 
  totalSpent = 0, 
  totalRemaining = 0 
}) => {
  // Calculate percentage spent
  const percentSpent = totalBudgeted > 0 ? totalSpent / totalBudgeted : 0;
  
  // Determine status based on spending
  const getStatusClass = () => {
    if (percentSpent >= 1) return 'danger';
    if (percentSpent >= 0.85) return 'warning';
    if (percentSpent >= 0.7) return 'caution';
    return 'success';
  };
  
  const statusClass = getStatusClass();
  
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-card__content">
          <h3 className="stat-card__title">Total Budgeted</h3>
          <p className="stat-card__value">{formatCurrency(totalBudgeted)}</p>
        </div>
        <div className="stat-card__icon stat-card__icon--budgeted">
          <span className="stat-card__icon-text">₹</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card__content">
          <h3 className="stat-card__title">Total Spent</h3>
          <p className="stat-card__value">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="stat-card__icon stat-card__icon--spent">
          <span className="stat-card__icon-text">₹</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card__content">
          <h3 className="stat-card__title">Remaining</h3>
          <p className={`stat-card__value ${totalRemaining < 0 ? 'negative' : ''}`}>
            {formatCurrency(totalRemaining)}
          </p>
        </div>
        <div className={`stat-card__icon stat-card__icon--${totalRemaining < 0 ? 'danger' : 'remaining'}`}>
          <span className="stat-card__icon-text">₹</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-card__content">
          <h3 className="stat-card__title">Budget Utilization</h3>
          <p className="stat-card__value">{formatPercentage(percentSpent)}</p>
          
          <div className="progress-container">
            <div 
              className={`progress-bar progress-bar--${statusClass}`} 
              style={{ width: `${Math.min(percentSpent * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className={`stat-card__icon stat-card__icon--${statusClass}`}>
          <span className="stat-card__icon-text">%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
