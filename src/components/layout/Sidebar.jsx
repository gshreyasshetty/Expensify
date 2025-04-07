import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { 
  HomeIcon, 
  WalletIcon, 
  ChartBarIcon, 
  LogoutIcon,
  CloseIcon
} from '../icons';
import { LogoSVG } from '../../assets/images/logo.jsx';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';
import '../../styles/components/layout/Sidebar.css';

/**
 * Sidebar navigation component
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, deleteUser } = useAppContext();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [logoError, setLogoError] = useState(false);
  
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            {logoError ? (
              <LogoSVG width={30} height={30} className="sidebar__logo-img" />
            ) : (
              <img 
                src="/logo.svg" 
                alt="Expensify Logo" 
                className="sidebar__logo-img" 
                width="30"
                height="30"
                onError={() => setLogoError(true)}
              />
            )}
            {isOpen && <span className="sidebar__logo-text">Expensify</span>}
          </div>
          
          <button 
            className="sidebar__close-button"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>
        
        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            <li className="sidebar__nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                }
                end
              >
                <HomeIcon className="sidebar__nav-icon" />
                {isOpen && <span className="sidebar__nav-text">Dashboard</span>}
              </NavLink>
            </li>
            
            <li className="sidebar__nav-item">
              <NavLink 
                to="/expenses" 
                className={({ isActive }) => 
                  `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                }
              >
                <WalletIcon className="sidebar__nav-icon" />
                {isOpen && <span className="sidebar__nav-text">Expenses</span>}
              </NavLink>
            </li>
            
            <li className="sidebar__nav-item">
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                }
              >
                <ChartBarIcon className="sidebar__nav-icon" />
                {isOpen && <span className="sidebar__nav-text">Analytics</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar__footer">
          <button 
            className="sidebar__logout-button"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogoutIcon className="sidebar__nav-icon" />
            {isOpen && <span className="sidebar__nav-text">Logout</span>}
          </button>
          
          {isOpen && (
            <div className="sidebar__user">
              <div className="sidebar__user-avatar">
                {user?.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar__user-info">
                <p className="sidebar__user-name">{user}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
      
      <DeleteConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={deleteUser}
        title="Log Out & Delete Account"
        message="Are you sure you want to log out and delete your account? This will delete all your budgets and expenses data."
      />
    </>
  );
};

export default Sidebar;
