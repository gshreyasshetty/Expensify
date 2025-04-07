import { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';
import PageTitle from '../components/ui/PageTitle';
import ExpenseList from '../components/expense/ExpenseList';
import FilterControls from '../components/expense/FilterControls';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import AddExpenseModal from '../components/expense/AddExpenseModal';
import { PlusIcon, FilterIcon } from '../components/icons';
import '../styles/pages/ExpensesPage.css';
const ExpensesPage = () => {
  const { expenses, budgets } = useAppContext();
  const [filters, setFilters] = useState({
    searchTerm: '',
    budgetId: 'all',
    sortBy: 'date',
    sortDirection: 'desc'
  });
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filteredExpenses = useMemo(() => {
    if (!expenses.length) return [];
    return expenses
      .filter(expense => {
        const matchesSearch = !filters.searchTerm || 
          expense.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesBudget = filters.budgetId === 'all' || 
          expense.budgetId === filters.budgetId;
        return matchesSearch && matchesBudget;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'date') {
          comparison = a.createdAt - b.createdAt;
        } else if (filters.sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else if (filters.sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        }
        return filters.sortDirection === 'desc' ? -comparison : comparison;
      });
  }, [expenses, filters]);
  const totalFiltered = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <div className="expenses-page">
      <header className="page-header">
        <PageTitle>Expenses Manager</PageTitle>
        <div className="header-actions">
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<FilterIcon />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button 
            variant="primary"
            onClick={() => setShowAddExpenseModal(true)}
            icon={<PlusIcon />}
            disabled={budgets.length === 0}
          >
            Add Expense
          </Button>
        </div>
      </header>
      {showFilters && (
        <FilterControls 
          filters={filters}
          setFilters={setFilters}
          budgets={budgets}
        />
      )}
      {expenses.length > 0 ? (
        <>
          <div className="expenses-summary">
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Expenses</span>
                <span className="stat-value">{expenses.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Filtered Expenses</span>
                <span className="stat-value">{filteredExpenses.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Amount (Filtered)</span>
                <span className="stat-value">{formatCurrency(totalFiltered)}</span>
              </div>
            </div>
          </div>
          {filteredExpenses.length > 0 ? (
            <ExpenseList 
              expenses={filteredExpenses} 
              budgets={budgets}
              showBudgetColumn={true}
            />
          ) : (
            <EmptyState
              title="No matching expenses"
              description="Try adjusting your filters or search term"
            />
          )}
        </>
      ) : (
        <EmptyState
          title="No expenses yet"
          description="Start by adding your first expense"
          action={{
            label: "Add Expense",
            onClick: () => setShowAddExpenseModal(true),
            disabled: budgets.length === 0
          }}
        />
      )}
      <AddExpenseModal 
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        budgets={budgets}
      />
    </div>
  );
};
export default ExpensesPage;
