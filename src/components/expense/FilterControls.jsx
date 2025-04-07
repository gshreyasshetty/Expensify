import React from 'react';
import '../../styles/components/expense/FilterControls.css';

/**
 * Controls for filtering and sorting expenses
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.setFilters - Function to update filters
 * @param {Array} props.budgets - List of available budgets
 */
const FilterControls = ({ filters, setFilters, budgets = [] }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="searchTerm" className="filter-label">Search</label>
        <input
          id="searchTerm"
          type="text"
          className="filter-input"
          placeholder="Search expenses..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        />
      </div>
      
      <div className="filter-group">
        <label htmlFor="budgetFilter" className="filter-label">Budget</label>
        <select
          id="budgetFilter"
          className="filter-select"
          value={filters.budgetId}
          onChange={(e) => handleFilterChange('budgetId', e.target.value)}
        >
          <option value="all">All Budgets</option>
          {budgets.map(budget => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="sortBy" className="filter-label">Sort By</label>
        <select
          id="sortBy"
          className="filter-select"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="name">Name</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="sortDirection" className="filter-label">Order</label>
        <select
          id="sortDirection"
          className="filter-select"
          value={filters.sortDirection}
          onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
