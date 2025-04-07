import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import '../../styles/components/ui/LoadingScreen.css';

/**
 * Full-page loading screen
 */
const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <LoadingSpinner size="large" />
        <p className="loading-screen__text">Loading ProfitPULSE...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
