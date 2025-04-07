import React from 'react';
import '../../styles/components/ui/PageTitle.css';

/**
 * Page title component with consistent styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Title content
 * @param {string} [props.className] - Additional CSS classes
 */
const PageTitle = ({ children, className = '', ...props }) => {
  const titleClasses = ['page-title', className].filter(Boolean).join(' ');
  
  return (
    <h1 className={titleClasses} {...props}>
      {children}
    </h1>
  );
};

export default PageTitle;
