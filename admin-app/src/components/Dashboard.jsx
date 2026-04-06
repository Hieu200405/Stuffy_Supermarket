import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ products }) {
  // Mocking BI Data for Enterprise demo
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue ($)',
      data: [1200, 1900, 3000, 5000, 2300, 3400, 4500],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryCount),
    datasets: [{
      data: Object.values(categoryCount),
      backgroundColor: [
        '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'
      ],
      hoverOffset: 12
    }]
  };

  const behaviourData = {
    labels: ['Home View', 'Search', 'Add to Cart', 'AR Experience', 'Checkout'],
    datasets: [{
      label: 'User Sessions',
      data: [4200, 3100, 1200, 800, 400],
      backgroundColor: 'rgba(168, 85, 247, 0.7)',
      borderRadius: 12
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [5, 5] } }
    }
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Sales Chart */}
        <div style={{ 
          background: 'white', padding: '24px', borderRadius: '18px', border: '1px solid var(--border-light)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Trend</h4>
          <div style={{ height: '220px' }}>
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>

        {/* User Behaviour */}
        <div style={{ 
          background: 'white', padding: '24px', borderRadius: '18px', border: '1px solid var(--border-light)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Funnel</h4>
          <div style={{ height: '220px' }}>
            <Bar data={behaviourData} options={chartOptions} />
          </div>
        </div>

        {/* Inventory Split */}
        <div style={{ 
          background: 'white', padding: '24px', borderRadius: '18px', border: '1px solid var(--border-light)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Split</h4>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={categoryData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>
    </div>
  );
}
