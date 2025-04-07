import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import { UserIcon, MoonIcon, SunIcon } from '../icons';
// Update the import path from .js to .jsx
import { LogoSVG, WelcomeIllustrationSVG } from '../../assets/images/logo.jsx';
import '../../styles/components/auth/WelcomeScreen.css';

const WelcomeScreen = () => {
  const { createUser } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [illustrationError, setIllustrationError] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name to continue');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createUser(name.trim());
    } catch (error) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="welcome-screen">
      <div className="welcome-background">
        <div className="animated-shape shape-1"></div>
        <div className="animated-shape shape-2"></div>
      </div>
      
      <div className="theme-toggle">
        <button 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="theme-button"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
      
      <div className="welcome-content">
        <div className="welcome-left">
          <div className="logo-container">
            {logoError ? (
              <LogoSVG width={54} height={54} className="logo" />
            ) : (
              <img 
                src="/logo.svg" 
                alt="Expensify Logo" 
                className="logo"
                width="54"
                height="54"
                onError={() => setLogoError(true)}
              />
            )}
            <h1 className="app-name">Expensify</h1>
          </div>
          
          <div className="welcome-text">
            <h2>Smart Financial Management Starts Here</h2>
            <p>
              Take control of your finances with our intuitive budgeting app.
              Track expenses, manage budgets, and get personalized insights to achieve your financial goals.
            </p>
          </div>
          
          <form className="welcome-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group input-highlight">
              <label htmlFor="userName">What should we call you?</label>
              <input
                id="userName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                className="form-input"
                required
              />
            </div>
            
            <Button 
              type="submit"
              variant="primary"
              icon={<UserIcon />}
              isLoading={isSubmitting}
              fullWidth
              className="get-started-btn"
            >
              {isSubmitting ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>
        </div>
        
        <div className="welcome-right">
          {illustrationError ? (
            <WelcomeIllustrationSVG className="welcome-illustration" width={400} height={300} />
          ) : (
            <img 
              src="/welcome-illustration.svg" 
              alt="Financial management illustration" 
              className="welcome-illustration"
              width="400"
              height="300"
              onError={() => setIllustrationError(true)}
            />
          )}
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <span className="feature-emoji">📊</span>
              </div>
              <div className="feature-text">
                <h3>Smart Budget Tracking</h3>
                <p>Create custom budgets and track your spending in real-time</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <span className="feature-emoji">🤖</span>
              </div>
              <div className="feature-text">
                <h3>AI-Powered Insights</h3>
                <p>Get personalized recommendations to improve your financial health</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <span className="feature-emoji">📈</span>
              </div>
              <div className="feature-text">
                <h3>Financial Analytics</h3>
                <p>Visualize your spending patterns with interactive charts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
