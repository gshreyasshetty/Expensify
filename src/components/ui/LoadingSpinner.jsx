import React from 'react';
import '../../styles/components/ui/LoadingSpinner.css';

/**
 * Loading spinner component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner (small, medium, large)
 * @param {string} [props.color] - Custom color override
 */
const LoadingSpinner = ({ 
  size = 'medium',
  color,
  className = ''
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={spinnerClasses} 
      style={color ? { borderTopColor: color } : undefined}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
