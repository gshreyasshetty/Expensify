import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/components/analytics/ExpenseTimelineChart.css';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Line chart showing expense trends over time
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Timeline data for the chart
 */
const ExpenseTimelineChart = ({ data = [] }) => {
  if (!data.length) {
    return <div className="chart-empty">No expense data available</div>;
  }
  
  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Expenses',
        data: data.map(item => item.total),
        fill: false,
        borderColor: 'hsl(215, 85%, 50%)',
        backgroundColor: 'hsla(215, 85%, 50%, 0.5)',
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Total Expenses: ${formatCurrency(context.raw)}`;
          }
        }
      }
    }
  };
  
  return (
    <div className="expense-timeline-chart">
      <Line data={chartData} options={options} height={300} />
    </div>
  );
};

export default ExpenseTimelineChart;
