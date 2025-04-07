import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency, formatPercentage, groupBy } from '../utils/helpers';
import { aiService } from '../services/aiService';

// Components
import PageTitle from '../components/ui/PageTitle';
import FinancialInsights from '../components/dashboard/FinancialInsights';
import ChartContainer from '../components/analytics/ChartContainer';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import AddBudgetModal from '../components/budget/AddBudgetModal';

// Chart components
import BudgetDistributionChart from '../components/analytics/BudgetDistributionChart';
import ExpenseTimelineChart from '../components/analytics/ExpenseTimelineChart';
import BudgetUtilizationChart from '../components/analytics/BudgetUtilizationChart';

// Icons
import { PlusIcon } from '../components/icons';

import '../styles/pages/AnalyticsPage.css';

const AnalyticsPage = () => {
  const { budgets, expenses } = useAppContext();
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  
  // Load AI insights
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
  
  // Prepare data for charts
  const prepareBudgetData = () => {
    return budgets.map(budget => {
      const budgetExpenses = expenses.filter(expense => expense.budgetId === budget.id);
      const spent = budgetExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: budget.name,
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
        color: `hsl(${budget.color})`,
        percentUsed: budget.amount > 0 ? spent / budget.amount : 0
      };
    });
  };
  
  const prepareTimelineData = () => {
    // Group expenses by date (month)
    const groupedByMonth = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = {
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total: 0,
          timestamp: date.getTime()
        };
      }
      
      groupedByMonth[monthKey].total += expense.amount;
    });
    
    // Convert to array and sort by date
    return Object.values(groupedByMonth)
      .sort((a, b) => a.timestamp - b.timestamp);
  };
  
  // Prepare chart data
  const budgetData = prepareBudgetData();
  const timelineData = prepareTimelineData();
  
  // Calculate summary stats
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const overallUtilization = totalBudgeted > 0 ? totalSpent / totalBudgeted : 0;
  
  if (budgets.length === 0 || expenses.length === 0) {
    return (
      <div className="analytics-page">
        <PageTitle>Financial Analytics</PageTitle>
        
        <EmptyState
          title={budgets.length === 0 ? "No budgets yet" : "No expenses yet"}
          description={
            budgets.length === 0 
              ? "Create budgets and add expenses to see analytics" 
              : "Add expenses to your budgets to see analytics"
          }
          action={{
            label: budgets.length === 0 ? "Create Budget" : "Go to Dashboard",
            onClick: () => budgets.length === 0 ? setShowAddBudgetModal(true) : null,
            to: budgets.length > 0 ? "/" : undefined
          }}
        />
        
        <AddBudgetModal 
          isOpen={showAddBudgetModal}
          onClose={() => setShowAddBudgetModal(false)}
        />
      </div>
    );
  }
  
  return (
    <div className="analytics-page">
      <PageTitle>Financial Analytics</PageTitle>
      
      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Budgeted</h3>
          <p className="amount">{formatCurrency(totalBudgeted)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Spent</h3>
          <p className="amount">{formatCurrency(totalSpent)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Remaining</h3>
          <p className={`amount ${totalBudgeted - totalSpent < 0 ? 'negative' : ''}`}>
            {formatCurrency(totalBudgeted - totalSpent)}
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Budget Utilization</h3>
          <p className="amount">{formatPercentage(overallUtilization)}</p>
        </div>
      </div>
      
      <div className="analytics-charts">
        <ChartContainer title="Budget Distribution">
          <BudgetDistributionChart data={budgetData} />
        </ChartContainer>
        
        <ChartContainer title="Budget Utilization">
          <BudgetUtilizationChart data={budgetData} />
        </ChartContainer>
        
        <ChartContainer title="Expense Timeline">
          <ExpenseTimelineChart data={timelineData} />
        </ChartContainer>
      </div>
      
      <div className="analytics-insights">
        <h2>Financial Insights</h2>
        <FinancialInsights 
          insights={aiInsights} 
          isLoading={isLoadingInsights}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
