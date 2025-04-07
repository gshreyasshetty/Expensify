import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency, formatPercentage } from '../utils/helpers';

// Components
import PageTitle from '../components/ui/PageTitle';
import BudgetCard from '../components/budget/BudgetCard';
import ExpenseList from '../components/expense/ExpenseList';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import AddExpenseModal from '../components/expense/AddExpenseModal';

// Icons
import { PlusIcon, ArrowLeftIcon, TrashIcon } from '../components/icons';

import '../styles/pages/BudgetDetails.css';

const BudgetDetails = () => {
  const { id } = useParams();
  const { getBudget, getBudgetExpenses, calculateBudgetSpent, deleteBudget } = useAppContext();
  
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Load budget and expenses data
  useEffect(() => {
    const budgetData = getBudget(id);
    if (budgetData) {
      setBudget(budgetData);
      setExpenses(getBudgetExpenses(id));
    }
  }, [id, getBudget, getBudgetExpenses]);
  
  // If budget not found, return to dashboard
  if (!budget && !isNavigating) {
    return <Navigate to="/" />;
  }
  
  if (isNavigating) {
    return <Navigate to="/" />;
  }
  
  // Calculate budget metrics
  const spent = calculateBudgetSpent(id);
  const remaining = budget?.amount - spent;
  const percentUsed = budget?.amount > 0 ? spent / budget.amount : 0;
  
  const handleDeleteBudget = async () => {
    await deleteBudget(id);
    setIsNavigating(true);
  };
  
  return (
    <div className="budget-details">
      <div className="page-header">
        <Button 
          as={Link}
          to="/"
          variant="text"
          icon={<ArrowLeftIcon />}
        >
          Back to Dashboard
        </Button>
        
        <Button 
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
          icon={<TrashIcon />}
        >
          Delete Budget
        </Button>
      </div>
      
      <PageTitle>
        <span className="highlight" style={{ color: `hsl(${budget?.color})` }}>
          {budget?.name}
        </span> Overview
      </PageTitle>
      
      <div className="budget-summary">
        <div className="budget-card-container">
          <BudgetCard budget={budget} className="details-card" />
        </div>
        
        <div className="budget-stats">
          <div className="stat-item">
            <h3>Total Budgeted</h3>
            <p className="stat-value">{formatCurrency(budget?.amount)}</p>
          </div>
          
          <div className="stat-item">
            <h3>Total Spent</h3>
            <p className="stat-value">{formatCurrency(spent)}</p>
          </div>
          
          <div className="stat-item">
            <h3>Remaining</h3>
            <p className={`stat-value ${remaining < 0 ? 'negative' : ''}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
          
          <div className="stat-item">
            <h3>Budget Utilization</h3>
            <p className="stat-value">{formatPercentage(percentUsed)}</p>
          </div>
        </div>
      </div>
      
      <div className="expenses-section">
        <div className="section-header">
          <h2>Expenses</h2>
          <Button 
            variant="primary"
            onClick={() => setShowAddExpenseModal(true)}
            icon={<PlusIcon />}
          >
            Add Expense
          </Button>
        </div>
        
        {expenses.length > 0 ? (
          <ExpenseList 
            expenses={expenses} 
            showBudgetColumn={false}
          />
        ) : (
          <EmptyState
            title="No expenses yet"
            description={`Start adding expenses to your "${budget?.name}" budget`}
            action={{
              label: "Add Expense",
              onClick: () => setShowAddExpenseModal(true)
            }}
          />
        )}
      </div>
      
      {/* Modals */}
      <AddExpenseModal 
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        defaultBudgetId={id}
      />
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteBudget}
        title="Delete Budget"
        message={`Are you sure you want to delete the "${budget?.name}" budget? This will also delete all associated expenses and cannot be undone.`}
      />
    </div>
  );
};

export default BudgetDetails;
