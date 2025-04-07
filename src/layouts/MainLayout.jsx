import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import WelcomeScreen from '../components/auth/WelcomeScreen';
import LoadingScreen from '../components/ui/LoadingScreen';
import '../styles/layouts/MainLayout.css';

const MainLayout = () => {
  const { user, isLoading } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <WelcomeScreen />;
  }
  
  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="main-content">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
