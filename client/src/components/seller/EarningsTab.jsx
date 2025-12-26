import React from 'react';
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const EarningsTab = ({ earnings }) => {
  const revenueChartRef = useRef(null);
  const earningsChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const earningsChartInstance = useRef(null);

  const formatNPR = (amount) => `NPR ${amount.toLocaleString('en-NP')}`;

  useEffect(() => {
    if (revenueChartRef.current && earnings.monthlyBreakdown) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }

      const ctx = revenueChartRef.current.getContext('2d');
      revenueChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: earnings.monthlyBreakdown.map(m => m.month),
          datasets: [{
            label: 'Revenue',
            data: earnings.monthlyBreakdown.map(m => m.amount),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => 'NPR ' + (value / 1000) + 'K'
              }
            }
          }
        }
      });
    }

    if (earningsChartRef.current && earnings.topListings) {
      if (earningsChartInstance.current) {
        earningsChartInstance.current.destroy();
      }

      const ctx = earningsChartRef.current.getContext('2d');
      earningsChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: earnings.topListings.map(l => l.listingTitle || l.title),
          datasets: [{
            data: earnings.topListings.map(l => l.totalEarnings || l.earnings),
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (earningsChartInstance.current) {
        earningsChartInstance.current.destroy();
      }
    };
  }, [earnings]);

  const currentMonth = earnings.monthlyBreakdown?.[earnings.monthlyBreakdown.length - 1]?.amount || 0;

  return (
    <div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Earnings Summary</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--primary)'
            }}>
              💰
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {formatNPR(earnings.totalEarnings)}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--muted-fg)', marginTop: '.25rem' }}>
                Total Earnings
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--chart-2)'
            }}>
              📈
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {formatNPR(currentMonth)}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--muted-fg)', marginTop: '.25rem' }}>
                This Month
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon" style={{
              background: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--warning)'
            }}>
              🧾
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {formatNPR(earnings.vatPaid)}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--muted-fg)', marginTop: '.25rem' }}>
                VAT Paid (13%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <canvas ref={revenueChartRef} height="250"></canvas>
        </div>

        <div className="chart-card">
          <h3>Top Listings</h3>
          <canvas ref={earningsChartRef} height="250"></canvas>
        </div>
      </div>
    </div>
  );
};

export default EarningsTab;