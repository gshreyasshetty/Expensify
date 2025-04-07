import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { storageService } from '../services/storageService';
import { generateRandomColor } from '../utils/helpers';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app data
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await storageService.getItem('userName');
        const budgetsData = await storageService.getItem('budgets') || [];
        const expensesData = await storageService.getItem('expenses') || [];
        
        setUser(userData);
        setBudgets(budgetsData);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // User functions
  const createUser = useCallback(async (userName) => {
    try {
      await storageService.setItem('userName', userName);
      setUser(userName);
      toast.success(`Welcome, ${userName}!`);
    } catch (error) {
      toast.error('Failed to create account');
      throw error;
    }
  }, []);

  const deleteUser = useCallback(async () => {
    try {
      await storageService.removeItem('userName');
      await storageService.removeItem('budgets');
      await storageService.removeItem('expenses');
      
      setUser(null);
      setBudgets([]);
      setExpenses([]);
      
      toast.success('Account deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete account');
      throw error;
    }
  }, []);

  // Budget functions
  const createBudget = useCallback(async (budgetData) => {
    try {
      const newBudget = {
        id: crypto.randomUUID(),
        name: budgetData.name,
        amount: Number(budgetData.amount),
        createdAt: Date.now(),
        color: generateRandomColor(budgets.length),
      };
      
      const updatedBudgets = [...budgets, newBudget];
      await storageService.setItem('budgets', updatedBudgets);
      
      setBudgets(updatedBudgets);
      toast.success('Budget created successfully!');
      
      return newBudget;
    } catch (error) {
      toast.error('Failed to create budget');
      throw error;
    }
  }, [budgets]);

  const deleteBudget = useCallback(async (budgetId) => {
    try {
      // Delete the budget
      const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
      await storageService.setItem('budgets', updatedBudgets);
      setBudgets(updatedBudgets);
      
      // Delete associated expenses
      const updatedExpenses = expenses.filter(expense => expense.budgetId !== budgetId);
      await storageService.setItem('expenses', updatedExpenses);
      setExpenses(updatedExpenses);
      
      toast.success('Budget deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete budget');
      throw error;
    }
  }, [budgets, expenses]);

  // Expense functions
  const createExpense = useCallback(async (expenseData) => {
    try {
      const newExpense = {
        id: crypto.randomUUID(),
        name: expenseData.name,
        amount: Number(expenseData.amount),
        budgetId: expenseData.budgetId,
        createdAt: Date.now(),
      };
      
      const updatedExpenses = [...expenses, newExpense];
      await storageService.setItem('expenses', updatedExpenses);
      
      setExpenses(updatedExpenses);
      toast.success(`Expense "${expenseData.name}" created successfully!`);
      
      return newExpense;
    } catch (error) {
      toast.error('Failed to create expense');
      throw error;
    }
  }, [expenses]);

  const deleteExpense = useCallback(async (expenseId) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      await storageService.setItem('expenses', updatedExpenses);
      
      setExpenses(updatedExpenses);
      toast.success('Expense deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete expense');
      throw error;
    }
  }, [expenses]);

  // Calculated values
  const getBudget = useCallback((budgetId) => {
    return budgets.find(budget => budget.id === budgetId);
  }, [budgets]);

  const getBudgetExpenses = useCallback((budgetId) => {
    return expenses.filter(expense => expense.budgetId === budgetId);
  }, [expenses]);

  const calculateBudgetSpent = useCallback((budgetId) => {
    return getBudgetExpenses(budgetId).reduce((total, expense) => total + expense.amount, 0);
  }, [getBudgetExpenses]);

  const calculateBudgetRemaining = useCallback((budgetId) => {
    const budget = getBudget(budgetId);
    const spent = calculateBudgetSpent(budgetId);
    return budget ? budget.amount - spent : 0;
  }, [getBudget, calculateBudgetSpent]);

  const value = {
    user,
    budgets,
    expenses,
    isLoading,
    // User functions
    createUser,
    deleteUser,
    // Budget functions
    createBudget,
    deleteBudget,
    getBudget,
    // Expense functions
    createExpense,
    deleteExpense,
    getBudgetExpenses,
    // Calculation functions
    calculateBudgetSpent,
    calculateBudgetRemaining,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
