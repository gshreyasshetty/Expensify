import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MenuIcon, SunIcon, MoonIcon } from '../icons';
import '../../styles/components/layout/Header.css';

/**
 * Application header component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar visibility
 */
const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="header">
      <button 
        className="header__menu-button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <MenuIcon />
      </button>
      
      <div className="header__actions">
        <button 
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
