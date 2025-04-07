import React from 'react';
import '../../styles/components/analytics/ChartContainer.css';

/**
 * Container for analytics charts with consistent styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {React.ReactNode} props.children - Chart content
 * @param {string} [props.className] - Additional CSS classes
 */
const ChartContainer = ({ title, children, className = '' }) => {
  return (
    <div className={`chart-container ${className}`}>
      <h3 className="chart-container__title">{title}</h3>
      <div className="chart-container__content">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
