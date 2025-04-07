import React from 'react';
import '../../styles/components/layout/Footer.css';

/**
 * Application footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">
          &copy; {currentYear} Expensify. All rights reserved.
        </p>
        <p className="footer__version">
          Version 2.0.0
        </p>
      </div>
    </footer>
  );
};

export default Footer;
