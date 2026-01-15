import React, { useMemo } from 'react';
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const EarningsTab = ({ earnings }) => {
  const revenueChartRef = useRef(null);
  const earningsChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const earningsChartInstance = useRef(null);

  // ✅ Calculate earnings from rental data
  const calculatedEarnings = useMemo(() => {
    if (!earnings || earnings.length === 0) {
      return {
        totalEarnings: 0,
        vatPaid: 0,
        monthlyBreakdown: [],
        topListings: []
      };
    }

    // Calculate total earnings
    const totalEarnings = earnings.reduce((sum, rental) => {
      return sum + (rental.totalAmount || 0);
    }, 0);

    // Calculate VAT (13%)
    const vatPaid = Math.round(totalEarnings * 0.13);

    // Group by month for monthly breakdown
    const monthlyMap = {};
    earnings.forEach(rental => {
      const date = new Date(rental.createdAt);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = 0;
      }
      monthlyMap[monthKey] += rental.totalAmount || 0;
    });

    const monthlyBreakdown = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount
    }));

    // Group by product for top listings
    const productMap = {};
    earnings.forEach(rental => {
      const productTitle = rental.product?.title || 'Unknown Product';
      
      if (!productMap[productTitle]) {
        productMap[productTitle] = 0;
      }
      productMap[productTitle] += rental.totalAmount || 0;
    });

    const topListings = Object.entries(productMap)
      .map(([title, totalEarnings]) => ({
        listingTitle: title,
        totalEarnings
      }))
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 4); // Top 4 products

    return {
      totalEarnings,
      vatPaid,
      monthlyBreakdown,
      topListings
    };
  }, [earnings]);

  const formatNPR = (amount) => {
    if (amount === 0 || amount === null || amount === undefined) return 'NPR 0';
    return `NPR ${amount.toLocaleString('en-NP')}`;
  };

  useEffect(() => {
    if (revenueChartRef.current && calculatedEarnings.monthlyBreakdown.length > 0) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }

      const ctx = revenueChartRef.current.getContext('2d');
      revenueChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: calculatedEarnings.monthlyBreakdown.map(m => m.month),
          datasets: [{
            label: 'Revenue',
            data: calculatedEarnings.monthlyBreakdown.map(m => m.amount),
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

    if (earningsChartRef.current && calculatedEarnings.topListings.length > 0) {
      if (earningsChartInstance.current) {
        earningsChartInstance.current.destroy();
      }

      const ctx = earningsChartRef.current.getContext('2d');
      earningsChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: calculatedEarnings.topListings.map(l => l.listingTitle),
          datasets: [{
            data: calculatedEarnings.topListings.map(l => l.totalEarnings),
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
  }, [calculatedEarnings]);

  const currentMonth = calculatedEarnings.monthlyBreakdown.length > 0 
    ? calculatedEarnings.monthlyBreakdown[calculatedEarnings.monthlyBreakdown.length - 1].amount 
    : 0;

  // ✅ Empty state
  if (!earnings || earnings.length === 0) {
    return (
      <div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Earnings Summary</h2>
          <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
            Your rental income overview
          </p>
        </div>

        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <div className="empty-icon">💰</div>
          <p style={{ fontWeight: 600 }}>No earnings yet</p>
          <p style={{ 
            color: 'var(--muted-fg)', 
            fontSize: '.875rem',
            marginTop: '.5rem'
          }}>
            Your earnings will appear here once someone rents your products
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Earnings Summary</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
          Your rental income overview
        </p>
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
                {formatNPR(calculatedEarnings.totalEarnings)}
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
                {formatNPR(calculatedEarnings.vatPaid)}
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
          {calculatedEarnings.monthlyBreakdown.length > 0 ? (
            <canvas ref={revenueChartRef} height="250"></canvas>
          ) : (
            <div style={{ 
              height: '250px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--muted-fg)'
            }}>
              No monthly data available
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>Top Earning Listings</h3>
          {calculatedEarnings.topListings.length > 0 ? (
            <canvas ref={earningsChartRef} height="250"></canvas>
          ) : (
            <div style={{ 
              height: '250px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--muted-fg)'
            }}>
              No listing data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsTab;