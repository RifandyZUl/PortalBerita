/**
 * Date Formatter Utility
 * 
 * Centralized date formatting functions untuk frontend-user.
 * 
 * @module utils/dateFormatter
 */

/**
 * Format date to Indonesian locale string
 * 
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  try {
    return new Date(date).toLocaleDateString('id-ID', {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format date to short format (DD MMM YYYY)
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
  return formatDate(date, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format date to time ago format (e.g., "2 jam yang lalu")
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Time ago string
 */
export const formatTimeAgo = (date) => {
  if (!date) return '-';
  
  try {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return 'Baru saja';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    }

    return formatDate(date);
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return '-';
  }
};

