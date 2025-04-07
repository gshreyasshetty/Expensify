import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { aiService } from '../services/aiService';
import { formatCurrency } from '../utils/helpers';

// Components
import PageTitle from '../components/ui/PageTitle';
import DashboardStats from '../components/dashboard/DashboardStats';
import BudgetGrid from '../components/budget/BudgetGrid';
import ExpenseList from '../components/expense/ExpenseList';
import FinancialInsights from '../components/dashboard/FinancialInsights';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import AddBudgetModal from '../components/budget/AddBudgetModal';
import AddExpenseModal from '../components/expense/AddExpenseModal';

// Icons
import { PlusIcon, ChartBarIcon } from '../components/icons';

import '../styles/pages/Dashboard.css';

const Dashboard = () => {
  const { user, budgets, expenses } = useAppContext();
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  
  // Calculate totals
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  
  // Get recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
  
  // Load AI insights when data is available
  useEffect(() => {
    const fetchInsights = async () => {
      if (budgets.length > 0 && expenses.length > 0) {
        setIsLoadingInsights(true);
        
        try {
          const insights = await aiService.getFinancialInsights(budgets, expenses);
          setAiInsights(insights);
        } catch (error) {
          console.error('Failed to load AI insights:', error);
        } finally {
          setIsLoadingInsights(false);
        }
      }
    };
    
    fetchInsights();
  }, [budgets, expenses]);
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <PageTitle>
          Welcome, <span className="highlight">{user}</span>
        </PageTitle>
        
        <div className="dashboard-actions">
          <Button 
            variant="primary"
            onClick={() => setShowAddBudgetModal(true)}
            icon={<PlusIcon />}
          >
            Add Budget
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => setShowAddExpenseModal(true)}
            icon={<PlusIcon />}
            disabled={budgets.length === 0}
          >
            Add Expense
          </Button>
        </div>
      </header>
      
      {/* Dashboard Stats */}
      <DashboardStats 
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        totalRemaining={totalRemaining}
      />
      
      {budgets.length > 0 ? (
        <div className="dashboard-content">
          {/* Budgets Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Your Budgets</h2>
              <Button as={Link} to="/analytics" variant="text" icon={<ChartBarIcon />}>
                View Analytics
              </Button>
            </div>
            
            <BudgetGrid budgets={budgets} />
          </section>
          
          {/* AI Insights Section */}
          {(aiInsights || isLoadingInsights) && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Financial Insights</h2>
              </div>
              
              <FinancialInsights 
                insights={aiInsights} 
                isLoading={isLoadingInsights} 
              />
            </section>
          )}
          
          {/* Recent Expenses Section */}
          {expenses.length > 0 && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Recent Expenses</h2>
                <Button as={Link} to="/expenses" variant="text">
                  View All
                </Button>
              </div>
              
              <ExpenseList 
                expenses={recentExpenses} 
                showBudgetColumn={true}
              />
            </section>
          )}
        </div>
      ) : (
        <EmptyState
          title="No budgets yet"
          description="Create your first budget to start tracking your finances"
          action={{
            label: "Create Budget",
            onClick: () => setShowAddBudgetModal(true)
          }}
        />
      )}
      
      {/* Modals */}
      <AddBudgetModal 
        isOpen={showAddBudgetModal}
        onClose={() => setShowAddBudgetModal(false)}
      />
      
      <AddExpenseModal 
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
      />
    </div>
  );
};

export default Dashboard;
