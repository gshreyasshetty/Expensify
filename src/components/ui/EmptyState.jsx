import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import '../../styles/components/ui/EmptyState.css';

/**
 * Empty state component for when there's no data to display
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The main message to display
 * @param {string} props.description - Additional descriptive text
 * @param {React.ReactNode} [props.icon] - Optional custom icon
 * @param {Object} [props.action] - Optional call to action
 * @param {string} props.action.label - Button text
 * @param {Function} [props.action.onClick] - Click handler
 * @param {string} [props.action.to] - Link destination if it's a link
 * @param {boolean} [props.action.disabled] - Whether the action is disabled
 */
const EmptyState = ({ 
  title, 
  description, 
  icon,
  action,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      
      <div className="empty-state__content">
        <h2 className="empty-state__title">{title}</h2>
        {description && <p className="empty-state__description">{description}</p>}
      </div>
      
      {action && (
        <div className="empty-state__action">
          {action.to ? (
            <Button 
              as={Link} 
              to={action.to} 
              variant="primary"
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ) : (
            <Button 
              onClick={action.onClick} 
              variant="primary"
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
