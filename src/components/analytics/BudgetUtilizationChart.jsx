import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { formatCurrency, formatPercentage } from '../../utils/helpers';
import '../../styles/components/analytics/BudgetUtilizationChart.css';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Bar chart showing budget utilization (spent vs. remaining)
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Budget data for the chart
 */
const BudgetUtilizationChart = ({ data = [] }) => {
  if (!data.length) {
    return <div className="chart-empty">No budget data available</div>;
  }
  
  // Sort data by percentage used (highest first)
  const sortedData = [...data].sort((a, b) => b.percentUsed - a.percentUsed);
  
  // Prepare chart data
  const chartData = {
    labels: sortedData.map(item => item.name),
    datasets: [
      {
        label: 'Spent',
        data: sortedData.map(item => item.spent),
        backgroundColor: sortedData.map(item => item.color),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
      },
      {
        label: 'Remaining',
        data: sortedData.map(item => Math.max(0, item.remaining)), // Don't show negative remaining
        backgroundColor: 'rgba(200, 200, 200, 0.5)',
        borderColor: 'rgba(200, 200, 200, 0.8)',
        borderWidth: 1,
      }
    ]
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const datasetLabel = context.dataset.label;
            return `${datasetLabel}: ${formatCurrency(value)}`;
          },
          afterBody: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const budget = sortedData[index];
            return [
              `Total Budget: ${formatCurrency(budget.budget)}`,
              `Utilization: ${formatPercentage(budget.percentUsed)}`
            ];
          }
        }
      }
    }
  };
  
  return (
    <div className="budget-utilization-chart">
      <Bar data={chartData} options={options} height={300} />
    </div>
  );
};

export default BudgetUtilizationChart;
