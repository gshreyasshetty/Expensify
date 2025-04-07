import { useRouteError, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HomeIcon, ArrowLeftIcon } from '../components/icons';
import '../styles/pages/ErrorPage.css';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  const errorMessage = error?.message || error?.statusText || 'Something went wrong';
  
  return (
    <div className="error-page">
      <div className="error-container">
        <h1>Oops! We have a problem</h1>
        
        <div className="error-status">
          <span className="error-code">{error?.status || 'Error'}</span>
          <p className="error-message">{errorMessage}</p>
        </div>
        
        <div className="error-illustration">
          <img 
            src="/broken-piggy.svg" 
            alt="Broken piggy bank illustration" 
            className="error-image" 
          />
        </div>
        
        <div className="error-actions">
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            icon={<ArrowLeftIcon />}
          >
            Go Back
          </Button>
          
          <Button 
            variant="primary"
            as={Link}
            to="/"
            icon={<HomeIcon />}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
