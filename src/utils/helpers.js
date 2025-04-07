export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, Math.random() * ms));
export const generateRandomColor = (index = 0) => {
  const hue = (index * 137.5) % 360;
  return `${hue}, 70%, 45%`;
};
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};
export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
};
export const getBudgetStatusColor = (percentUsed) => {
  if (percentUsed >= 100) return 'danger';
  if (percentUsed >= 85) return 'warning';
  if (percentUsed >= 60) return 'caution';
  return 'success';
};
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
