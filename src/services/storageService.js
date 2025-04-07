/**
 * Service to handle localStorage operations
 */
export const storageService = {
  /**
   * Get item from localStorage
   * @param {string} key - The storage key to retrieve
   * @returns {any} The parsed item or null
   */
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item: ${key}`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - The storage key
   * @param {any} value - The value to store
   * @returns {boolean} Success status
   */
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item: ${key}`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - The storage key to remove
   * @returns {boolean} Success status
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item: ${key}`, error);
      return false;
    }
  },

  /**
   * Clear all items from localStorage
   * @returns {boolean} Success status
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage', error);
      return false;
    }
  }
};
