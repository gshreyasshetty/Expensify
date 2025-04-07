import React from 'react';
import '../../styles/components/ui/Button.css';

/**
 * Button component that supports various styles and can act as different elements
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button style: primary, secondary, outline, text, danger
 * @param {React.ElementType} [props.as='button'] - Render as different element (button, a, etc.)
 * @param {React.ReactNode} [props.icon] - Optional icon to display
 * @param {boolean} [props.fullWidth] - Whether the button should take full width
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.className] - Additional CSS classes
 */
const Button = ({
  children,
  variant = 'primary',
  as: Component = 'button',
  icon,
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full-width' : '',
    isLoading ? 'btn--loading' : '',
    icon ? 'btn--with-icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <span className="btn__spinner"></span>}
      {icon && !isLoading && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__text">{children}</span>}
    </Component>
  );
};

export default Button;
