import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/components/analytics/BudgetDistributionChart.css';

// Register required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Pie chart showing budget distribution
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Budget data for the chart
 */
const BudgetDistributionChart = ({ data = [] }) => {
  if (!data.length) {
    return <div className="chart-empty">No budget data available</div>;
  }
  
  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.budget),
        backgroundColor: data.map(item => item.color),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
      }
    ]
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <div className="budget-distribution-chart">
      <Pie data={chartData} options={options} height={300} />
    </div>
  );
};

export default BudgetDistributionChart;
