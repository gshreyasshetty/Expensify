import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import '../../styles/components/dashboard/FinancialInsights.css';

/**
 * Component to display AI-generated financial insights
 * 
 * @param {Object} props - Component props
 * @param {Object|null} props.insights - AI insights data
 * @param {boolean} props.isLoading - Loading state
 */
const FinancialInsights = ({ insights, isLoading }) => {
  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="financial-insights financial-insights--loading">
        <div className="financial-insights__loading">
          <LoadingSpinner />
          <p>Analyzing your financial data...</p>
        </div>
      </div>
    );
  }
  
  // If no insights available
  if (!insights) {
    return (
      <div className="financial-insights financial-insights--empty">
        <p className="financial-insights__message">
          AI insights will appear here once you have more financial data.
        </p>
      </div>
    );
  }
  
  // If there was an error
  if (insights.error) {
    return (
      <div className="financial-insights financial-insights--error">
        <p className="financial-insights__error">
          {insights.error}
        </p>
        {insights.detailedError && (
          <p className="financial-insights__error-details">
            Details: {insights.detailedError}
          </p>
        )}
        <button 
          className="financial-insights__retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Extract financial health score if available
  const hasScore = insights.financialScore !== null && insights.financialScore !== undefined;
  
  // Process sections to improve formatting and remove unwanted spacing
  const processedSections = insights.sections.map(section => {
    // Clean the section text - remove extra whitespace while preserving necessary line breaks
    let processedSection = section.trim()
      // Remove multiple consecutive line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Remove spaces at the beginning of lines
      .replace(/\n\s+/g, '\n');
    
    // Replace leading asterisks with proper bullet points
    processedSection = processedSection.replace(/^\s*\*+\s*(.+)$/gm, '<li>$1</li>');
    processedSection = processedSection.replace(/^\s*•\s*(.+)$/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    processedSection = processedSection.replace(/(<li>.+<\/li>(\n|$))+/g, '<ul>$&</ul>');
    
    // Add header formatting for section titles
    processedSection = processedSection.replace(
      /^(Overall Financial Assessment|Budget-Specific Insights|Savings Opportunities|Investment Suggestions|Financial Health Score):?/gm,
      '<h3>$1</h3>'
    );
    
    // Bold text between double asterisks
    processedSection = processedSection.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Remove any remaining single asterisks that might be causing issues
    processedSection = processedSection.replace(/\s*\*\s*/g, ' ');
    
    // Enhance financial health score section to remove trailing characters
    if (processedSection.includes('<h3>Financial Health Score</h3>')) {
      processedSection = processedSection.replace(/(\d+)\s*\/\s*10\s*\.{2,}.*/s, '$1/10');
      processedSection = processedSection.replace(/(\d+)\s*\/\s*10\.*\s*$/s, '$1/10');
    }
    
    // Process paragraphs - ensuring no unwanted spacing is created
    let formattedSection = '';
    let inList = false;
    
    // Split by potential paragraph breaks but preserve list structures
    const lines = processedSection.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if we're in a list context
      if (line.includes('<ul>')) inList = true;
      if (line.includes('</ul>')) inList = false;
      
      // Handle content based on context
      if (line.startsWith('<h3>') || line.startsWith('<ul>') || line.startsWith('</ul>') || inList) {
        // Headers and list items - add as is
        formattedSection += line;
      } else if (line.startsWith('<li>')) {
        // Individual list items outside a list - wrap in ul
        formattedSection += `<ul>${line}</ul>`;
      } else {
        // Regular paragraph content - wrap in p tags if not already
        if (!line.startsWith('<p>') && !line.includes('</p>')) {
          formattedSection += `<p>${line}</p>`;
        } else {
          formattedSection += line;
        }
      }
    }
    
    return formattedSection;
  });
  
  return (
    <div className="financial-insights">
      {hasScore && (
        <div className="financial-insights__score">
          <div className="score-indicator">
            <div 
              className="score-indicator__value" 
              data-score={Math.round(insights.financialScore)}
            >
              {Math.round(insights.financialScore)}
            </div>
            <div className="score-indicator__label">
              Financial Health Score
            </div>
          </div>
        </div>
      )}
      
      <div className="financial-insights__content">
        {processedSections.map((section, index) => (
          <div 
            key={index} 
            className="financial-insights__section"
            dangerouslySetInnerHTML={{ __html: section }}
          />
        ))}
      </div>
    </div>
  );
};

export default FinancialInsights;
