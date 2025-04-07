/**
 * Creates a small artificial delay (for loading states)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Resolves after the delay
 */
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, Math.random() * ms));

/**
 * Generates a random HSL color
 * @param {number} index - Index value for color generation
 * @returns {string} HSL color value
 */
export const generateRandomColor = (index = 0) => {
  // Use golden ratio for better color distribution
  const hue = (index * 137.5) % 360;
  return `${hue}, 70%, 45%`;
};

/**
 * Formats a date to locale string
 * @param {number|Date} timestamp - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Formats a currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (defaults to INR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a percentage value
 * @param {number} value - Decimal value to format as percentage
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
};

/**
 * Calculates budget status color based on percentage used
 * @param {number} percentUsed - Percentage of budget used
 * @returns {string} CSS color class
 */
export const getBudgetStatusColor = (percentUsed) => {
  if (percentUsed >= 100) return 'danger';
  if (percentUsed >= 85) return 'warning';
  if (percentUsed >= 60) return 'caution';
  return 'success';
};

/**
 * Groups an array of objects by a specified key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
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

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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
