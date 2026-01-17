import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import StatCard from '../../components/admin/StatCard';
import QuickStatCard from '../../components/admin/QuickStatCard';
import ChartCard from '../../components/admin/ChartCard';
import ActivityCard from '../../components/admin/ActivityCard';
import UsersTable from '../../components/admin/UsersTable';
import ListingsTable from '../../components/admin/ListingsTable';
import OrdersTable from '../../components/admin/OrdersTable';
import PaymentsTable from '../../components/admin/PaymentsTable';
import VerificationsTable from '../../components/admin/VerificationsTable';
import PromosTable from '../../components/admin/PromosTable';
import VatCalculator from '../../components/admin/VatCalculator';
import PromoModal from '../../components/admin/PromoModal';

function AdminPages() {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('dashboard');
  
  // ✅ Real dashboard data from API
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  // States for other pages (will be updated later with real data)
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [promos, setPromos] = useState([]);
  
  // Filter states
  const [userSearch, setUserSearch] = useState('');
  const [listingFilter, setListingFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [vatModalOpen, setVatModalOpen] = useState(false);
  const [promoModalOpen, setPromoModalOpen] = useState(false);

  const pageHeaders = {
    dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Admin' },
    users: { title: 'Users & Sellers', subtitle: 'Manage platform users' },
    listings: { title: 'Listings', subtitle: 'Approve and manage rental listings' },
    orders: { title: 'Orders', subtitle: 'Monitor rental orders' },
    payments: { title: 'Payments', subtitle: 'Manage payments and VAT' },
    verification: { title: 'Student Verification', subtitle: 'Verify student IDs' },
    promotions: { title: 'Promotions', subtitle: 'Manage promo codes' },
    analytics: { title: 'Analytics', subtitle: 'Platform insights' },
  };

  // ✅ Fetch dashboard data when dashboard page is active
  useEffect(() => {
    if (activePage === 'dashboard') {
      fetchDashboardData();
    }
  }, [activePage]);

  // ✅ Fetch real dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Fetching admin dashboard data...');
      
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
        console.log('✅ Dashboard data loaded:', response.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      showToast('Error', 'Failed to load dashboard data');
    } finally {
      setDashboardLoading(false);
    }
  };

  // Actions (placeholder - will be updated with real API calls later)
  const handleBanUser = (user) => showToast('User Banned', `${user.name} has been banned`);
  
  const handleApproveListing = (listing) => {
    setListings(listings.map(l => l.id === listing.id ? { ...l, status: 'approved' } : l));
    showToast('Listing Approved', `${listing.title} has been approved`);
  };
  
  const handleRejectListing = (listing) => {
    setListings(listings.map(l => l.id === listing.id ? { ...l, status: 'rejected' } : l));
    showToast('Listing Rejected', `${listing.title} has been rejected`);
  };
  
  const handleApproveVerification = (v) => {
    setVerifications(verifications.map(ver => ver.id === v.id ? { ...ver, status: 'approved' } : ver));
    showToast('Student Verified', `${v.userName} is now verified`);
  };
  
  const handleRejectVerification = (v) => {
    setVerifications(verifications.map(ver => ver.id === v.id ? { ...ver, status: 'rejected' } : ver));
    showToast('Verification Rejected', `${v.userName} was rejected`);
  };
  
  const handleTogglePromo = (promo) => {
    setPromos(promos.map(p => p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
    showToast(promo.isActive ? 'Promo Deactivated' : 'Promo Activated', `${promo.code} has been ${!promo.isActive ? 'activated' : 'deactivated'}`);
  };
  
  const handleDeletePromo = (promo) => {
    setPromos(promos.filter(p => p.id !== promo.id));
    showToast('Promo Deleted', `${promo.code} has been deleted`);
  };
  
  const handleCreatePromo = (formData) => {
    const newPromo = {
      id: Date.now().toString(),
      code: formData.code,
      discount: parseFloat(formData.discount),
      type: formData.type,
      isActive: true,
      usageCount: 0,
      expiresAt: formData.expiresAt,
    };
    setPromos([newPromo, ...promos]);
    setPromoModalOpen(false);
    showToast('Promo Created', `Promo code ${formData.code} has been created`);
  };

  // Charts config - Dynamic labels from API
  const userGrowthChart = {
    type: 'line',
    data: {
      labels: dashboardData?.charts?.userGrowth?.labels || ['Today'],
      datasets: [{
        label: 'Users',
        data: dashboardData?.charts?.userGrowth?.data || [0],
        borderColor: 'hsl(211, 100%, 50%)',
        backgroundColor: 'hsla(211, 100%, 50%, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'hsl(214, 32%, 91%)' } },
        x: { grid: { display: false } }
      }
    }
  };

  const categoryChart = {
    type: 'doughnut',
    data: {
      labels: dashboardData?.charts?.categoryDistribution?.labels || ['Furniture', 'Appliances'],
      datasets: [{
        data: dashboardData?.charts?.categoryDistribution?.data || [0, 0],
        backgroundColor: ['hsl(211, 100%, 50%)', 'hsl(142, 76%, 36%)'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: '60%'
    }
  };

  const revenueChart = {
    type: 'bar',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      datasets: [{
        label: 'Revenue',
        data: [45000, 62000, 78000, 95000, 110000, 145000, 125000],
        backgroundColor: 'hsl(142, 76%, 36%)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'hsl(214, 32%, 91%)' }, ticks: { callback: v => v/1000 + 'K' } },
        x: { grid: { display: false } }
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="main-content">
        <Header title={pageHeaders[activePage].title} subtitle={pageHeaders[activePage].subtitle} />
        <div className="page-content">

          {/* ✅ DASHBOARD - REAL DATA */}
          {activePage === 'dashboard' && (
            <section className="page-section active">
              {dashboardLoading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '400px',
                  fontSize: '1.125rem',
                  color: '#64748b'
                }}>
                  Loading dashboard data...
                </div>
              ) : dashboardData ? (
                <>
                  <div className="stats-grid">
                    <StatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} 
                      value={dashboardData.stats.totalUsers} 
                      label="Total Users" 
                      iconClass="primary" 
                    />
                    <StatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>} 
                      value={dashboardData.stats.activeListings} 
                      label="Active Listings" 
                      iconClass="success" 
                    />
                    <StatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} 
                      value={dashboardData.stats.totalOrders} 
                      label="Total Orders" 
                      iconClass="warning" 
                    />
                    <StatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>} 
                      value={`Rs. ${Math.round(dashboardData.stats.monthlyRevenue / 1000)}K`} 
                      label="Monthly Revenue" 
                      iconClass="primary" 
                    />
                  </div>

                  <div className="quick-stats">
                    <QuickStatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>} 
                      value={dashboardData.stats.pendingListings} 
                      label="Pending Listings" 
                      iconStyle={{ background: 'hsl(38, 92%, 95%)', color: 'var(--warning)' }} 
                    />
                    <QuickStatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} 
                      value={dashboardData.stats.pendingOrders} 
                      label="Pending Orders" 
                      iconStyle={{ background: 'hsl(211, 100%, 95%)', color: 'var(--primary)' }} 
                    />
                    <QuickStatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>} 
                      value={dashboardData.stats.activeSellers} 
                      label="Active Sellers" 
                      iconStyle={{ background: 'hsl(142, 76%, 95%)', color: 'var(--success)' }} 
                    />
                    <QuickStatCard 
                      icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} 
                      value="N/A" 
                      label="Student Discounts" 
                      iconStyle={{ background: 'hsl(280, 65%, 95%)', color: 'var(--chart-4)' }} 
                    />
                  </div>

                  <div className="charts-grid">
                    <ChartCard title="User Growth" subtitle="Since first signup" chartId="userGrowth" chartConfig={userGrowthChart} />
                    <ChartCard 
                      title="Rentals by Category" 
                      subtitle="Distribution overview" 
                      chartId="category" 
                      chartConfig={categoryChart} 
                      legend={
                        <>
                          {dashboardData.charts?.categoryDistribution?.labels?.map((label, index) => (
                            <div className="legend-item" key={index}>
                              <div className="legend-dot" style={{ 
                                background: ['hsl(211, 100%, 50%)', 'hsl(142, 76%, 36%)'][index] 
                              }}></div>
                              {label} ({dashboardData.charts.categoryDistribution.percentages[index]}%)
                            </div>
                          ))}
                        </>
                      } 
                    />
                  </div>

                  <div className="activity-grid">
                    <ActivityCard 
                      title="Recent Orders" 
                      items={dashboardData.recentActivity?.orders?.length > 0 ? dashboardData.recentActivity.orders.map(order => ({
                        title: `Order #${order.id.substring(0, 8)}`,
                        subtitle: order.renterName,
                        value: `Rs. ${order.amount.toLocaleString()}`,
                        badge: order.status,
                        badgeType: order.status === 'booked' ? 'warning' : order.status === 'active' ? 'primary' : 'success'
                      })) : [{ title: 'No recent orders', subtitle: '', value: '', badge: '', badgeType: '' }]}
                    />
                    <ActivityCard 
                      title="Pending Listings" 
                      items={dashboardData.recentActivity?.pendingListings?.length > 0 ? dashboardData.recentActivity.pendingListings.map(listing => ({
                        title: listing.title,
                        subtitle: 'Awaiting approval',
                        value: `Rs. ${listing.pricePerMonth}/month`,
                        badge: 'Pending',
                        badgeType: 'warning'
                      })) : [{ title: 'No pending listings', subtitle: '', value: '', badge: '', badgeType: '' }]}
                    />
                  </div>
                </>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  color: '#ef4444' 
                }}>
                  <div>Failed to load dashboard data</div>
                  <button 
                    onClick={fetchDashboardData}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
            </section>
          )}

          {/* USERS PAGE - Placeholder */}
          {activePage === 'users' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Users & Sellers Management</div>
                  <div className="section-subtitle">Manage user roles, ban users, and view activity logs</div>
                </div>
                <span className="badge badge-outline">{users.length} Total Users</span>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No user data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

          {/* LISTINGS PAGE - Placeholder */}
          {activePage === 'listings' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Listings Management</div>
                  <div className="section-subtitle">Approve or reject rental listings</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No listing data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

          {/* ORDERS PAGE - Placeholder */}
          {activePage === 'orders' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Orders Management</div>
                  <div className="section-subtitle">Monitor and manage rental orders</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No order data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

          {/* PAYMENTS PAGE - Placeholder */}
          {activePage === 'payments' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Payments & Compliance</div>
                  <div className="section-subtitle">Manage payments with eSewa & Khalti (Mock) and Nepal VAT</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No payment data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

          {/* VERIFICATION PAGE - Placeholder */}
          {activePage === 'verification' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Student ID Verification</div>
                  <div className="section-subtitle">Verify student IDs for discount eligibility</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No verification data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

          {/* PROMOTIONS PAGE - Placeholder */}
          {activePage === 'promotions' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Promotions & Promo Codes</div>
                  <div className="section-subtitle">Create and manage promotional offers</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No promo data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

          {/* ANALYTICS PAGE - Placeholder */}
          {activePage === 'analytics' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Analytics Dashboard</div>
                  <div className="section-subtitle">Platform performance metrics and insights</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div>No analytics data available yet. This feature will be implemented soon.</div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* MODALS */}
      <VatCalculator isOpen={vatModalOpen} onClose={() => setVatModalOpen(false)} />
      <PromoModal isOpen={promoModalOpen} onClose={() => setPromoModalOpen(false)} onSubmit={handleCreatePromo} />
    </div>
  );
}

export default AdminPages;