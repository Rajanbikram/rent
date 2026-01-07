import React, { useState, useEffect } from 'react';
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

// Mock data (will be replaced with API calls)
const initialUsers = [
  { id: '1', name: 'Aarav Sharma', email: 'aarav@gmail.com', role: 'user', joinDate: '2024-01-15', rating: 4.5, status: 'active', isStudentVerified: true },
  { id: '2', name: 'Priya Thapa', email: 'priya@gmail.com', role: 'seller', joinDate: '2024-02-20', rating: 4.8, status: 'active', isStudentVerified: false },
  { id: '3', name: 'Bikash Gurung', email: 'bikash@gmail.com', role: 'seller', joinDate: '2024-03-10', rating: 2.1, status: 'active', isStudentVerified: false },
  { id: '4', name: 'Sita Rai', email: 'sita@gmail.com', role: 'user', joinDate: '2024-04-05', rating: 4.2, status: 'banned', isStudentVerified: true },
  { id: '5', name: 'Raj Magar', email: 'raj@gmail.com', role: 'user', joinDate: '2024-05-18', rating: 3.9, status: 'active', isStudentVerified: false },
  { id: '6', name: 'Maya Tamang', email: 'maya@gmail.com', role: 'seller', joinDate: '2024-06-22', rating: 4.7, status: 'active', isStudentVerified: true },
  { id: '7', name: 'Kiran Shrestha', email: 'kiran@gmail.com', role: 'user', joinDate: '2024-07-08', rating: 4.0, status: 'active', isStudentVerified: false },
  { id: '8', name: 'Anita Basnet', email: 'anita@gmail.com', role: 'seller', joinDate: '2024-08-14', rating: 1.8, status: 'active', isStudentVerified: false },
];

const initialListings = [
  { id: '1', title: 'Modern Sofa Set', seller: 'Priya Thapa', category: 'Furniture', pricePerDay: 500, status: 'approved', createdAt: '2024-12-20' },
  { id: '2', title: 'Samsung Refrigerator', seller: 'Maya Tamang', category: 'Appliances', pricePerDay: 300, status: 'pending', createdAt: '2024-12-28' },
  { id: '3', title: 'Study Desk', seller: 'Bikash Gurung', category: 'Furniture', pricePerDay: 150, status: 'pending', createdAt: '2024-12-30' },
  { id: '4', title: 'Washing Machine', seller: 'Priya Thapa', category: 'Appliances', pricePerDay: 400, status: 'approved', createdAt: '2024-12-15' },
  { id: '5', title: 'Office Chair', seller: 'Anita Basnet', category: 'Furniture', pricePerDay: 100, status: 'rejected', createdAt: '2024-12-22' },
  { id: '6', title: 'Air Conditioner', seller: 'Maya Tamang', category: 'Appliances', pricePerDay: 600, status: 'pending', createdAt: '2025-01-01' },
];

const orders = [
  { id: 'ORD001', listingTitle: 'Modern Sofa Set', renter: 'Aarav Sharma', seller: 'Priya Thapa', startDate: '2025-01-05', endDate: '2025-01-15', totalAmount: 5000, status: 'pending', paymentMethod: 'esewa' },
  { id: 'ORD002', listingTitle: 'Washing Machine', renter: 'Raj Magar', seller: 'Priya Thapa', startDate: '2025-01-02', endDate: '2025-01-10', totalAmount: 3200, status: 'active', paymentMethod: 'khalti' },
  { id: 'ORD003', listingTitle: 'Study Desk', renter: 'Kiran Shrestha', seller: 'Bikash Gurung', startDate: '2024-12-20', endDate: '2024-12-30', totalAmount: 1500, status: 'completed', paymentMethod: 'esewa' },
  { id: 'ORD004', listingTitle: 'Samsung Refrigerator', renter: 'Sita Rai', seller: 'Maya Tamang', startDate: '2025-01-08', endDate: '2025-01-20', totalAmount: 3600, status: 'pending', paymentMethod: 'khalti' },
  { id: 'ORD005', listingTitle: 'Air Conditioner', renter: 'Aarav Sharma', seller: 'Maya Tamang', startDate: '2025-01-10', endDate: '2025-01-25', totalAmount: 9000, status: 'pending', paymentMethod: 'esewa' },
];

const payments = [
  { id: 'PAY001', orderId: 'ORD001', amount: 5000, vatAmount: 650, paymentMethod: 'esewa', status: 'pending', createdAt: '2025-01-02' },
  { id: 'PAY002', orderId: 'ORD002', amount: 3200, vatAmount: 416, paymentMethod: 'khalti', status: 'completed', createdAt: '2025-01-02' },
  { id: 'PAY003', orderId: 'ORD003', amount: 1500, vatAmount: 195, paymentMethod: 'esewa', status: 'completed', createdAt: '2024-12-20' },
  { id: 'PAY004', orderId: 'ORD004', amount: 3600, vatAmount: 468, paymentMethod: 'khalti', status: 'pending', createdAt: '2025-01-01' },
  { id: 'PAY005', orderId: 'ORD005', amount: 9000, vatAmount: 1170, paymentMethod: 'esewa', status: 'pending', createdAt: '2025-01-02' },
];

const initialVerifications = [
  { id: '1', userId: '1', userName: 'Aarav Sharma', studentId: 'TU-2022-1234', university: 'Tribhuvan University', status: 'approved', submittedAt: '2024-12-15' },
  { id: '2', userId: '4', userName: 'Sita Rai', studentId: 'KU-2023-5678', university: 'Kathmandu University', status: 'approved', submittedAt: '2024-12-20' },
  { id: '3', userId: '6', userName: 'Maya Tamang', studentId: 'PU-2024-9012', university: 'Pokhara University', status: 'pending', submittedAt: '2025-01-01' },
  { id: '4', userId: '7', userName: 'Kiran Shrestha', studentId: 'TU-2023-3456', university: 'Tribhuvan University', status: 'pending', submittedAt: '2025-01-02' },
];

const initialPromos = [
  { id: '1', code: 'NEWYEAR2025', discount: 15, type: 'percentage', isActive: true, usageCount: 45, expiresAt: '2025-01-31' },
  { id: '2', code: 'STUDENT10', discount: 10, type: 'percentage', isActive: true, usageCount: 120, expiresAt: '2025-06-30' },
  { id: '3', code: 'FLAT500', discount: 500, type: 'fixed', isActive: false, usageCount: 30, expiresAt: '2024-12-31' },
  { id: '4', code: 'DASHAIN25', discount: 25, type: 'percentage', isActive: false, usageCount: 200, expiresAt: '2024-10-31' },
];

function AdminPages() {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('dashboard');
  const [users] = useState(initialUsers);
  const [listings, setListings] = useState(initialListings);
  const [verifications, setVerifications] = useState(initialVerifications);
  const [promos, setPromos] = useState(initialPromos);
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

  // Actions
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

  // Charts config
  const userGrowthChart = {
    type: 'line',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      datasets: [{
        label: 'Users',
        data: [120, 180, 250, 320, 420, 550, 620],
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
      labels: ['Furniture', 'Appliances', 'Electronics', 'Others'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['hsl(211, 100%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 65%, 60%)'],
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

          {/* DASHBOARD */}
          {activePage === 'dashboard' && (
            <section className="page-section active">
              <div className="stats-grid">
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} value="620" label="Total Users" trend="+12%" iconClass="primary" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>} value="234" label="Active Listings" trend="+8%" iconClass="success" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} value="1,250" label="Total Orders" trend="+15%" iconClass="warning" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>} value="Rs. 125K" label="Monthly Revenue" trend="+23%" iconClass="primary" />
              </div>

              <div className="quick-stats">
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>} value="3" label="Pending Listings" iconStyle={{ background: 'hsl(38, 92%, 95%)', color: 'var(--warning)' }} />
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} value="3" label="Pending Orders" iconStyle={{ background: 'hsl(211, 100%, 95%)', color: 'var(--primary)' }} />
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>} value="85" label="Active Sellers" iconStyle={{ background: 'hsl(142, 76%, 95%)', color: 'var(--success)' }} />
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} value="320" label="Student Discounts" iconStyle={{ background: 'hsl(280, 65%, 95%)', color: 'var(--chart-4)' }} />
              </div>

              <div className="charts-grid">
                <ChartCard title="User Growth" subtitle="New users over time" trend="+12.5%" chartId="userGrowth" chartConfig={userGrowthChart} />
                <ChartCard title="Rentals by Category" subtitle="Distribution overview" chartId="category" chartConfig={categoryChart} legend={<><div className="legend-item"><div className="legend-dot" style={{ background: 'hsl(211, 100%, 50%)' }}></div>Furniture (45%)</div><div className="legend-item"><div className="legend-dot" style={{ background: 'hsl(142, 76%, 36%)' }}></div>Appliances (30%)</div><div className="legend-item"><div className="legend-dot" style={{ background: 'hsl(38, 92%, 50%)' }}></div>Electronics (15%)</div><div className="legend-item"><div className="legend-dot" style={{ background: 'hsl(280, 65%, 60%)' }}></div>Others (10%)</div></>} />
              </div>

              <div className="activity-grid">
                <ActivityCard title="Recent Orders" items={[
                  { title: 'Modern Sofa Set', subtitle: 'Aarav Sharma', value: 'Rs. 5,000', badge: 'pending', badgeType: 'warning' },
                  { title: 'Washing Machine', subtitle: 'Raj Magar', value: 'Rs. 3,200', badge: 'active', badgeType: 'primary' },
                  { title: 'Study Desk', subtitle: 'Kiran Shrestha', value: 'Rs. 1,500', badge: 'completed', badgeType: 'success' },
                ]} />
                <ActivityCard title="Pending Listings" items={[
                  { title: 'Samsung Refrigerator', subtitle: 'by Maya Tamang', value: 'Rs. 300/day', badge: 'Pending', badgeType: 'warning' },
                  { title: 'Study Desk', subtitle: 'by Bikash Gurung', value: 'Rs. 150/day', badge: 'Pending', badgeType: 'warning' },
                  { title: 'Air Conditioner', subtitle: 'by Maya Tamang', value: 'Rs. 600/day', badge: 'Pending', badgeType: 'warning' },
                ]} />
              </div>
            </section>
          )}

          {/* USERS PAGE */}
          {activePage === 'users' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Users & Sellers Management</div>
                  <div className="section-subtitle">Manage user roles, ban users, and view activity logs</div>
                </div>
                <span className="badge badge-outline">8 Total Users</span>
              </div>
              <div className="filters">
                <div className="search-box" style={{ flex: 1, maxWidth: '400px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input type="text" placeholder="Search users by name or email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
                <button className="btn btn-outline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                  Sort by Join Date
                </button>
              </div>
              <UsersTable users={users} onBanUser={handleBanUser} search={userSearch} />
            </section>
          )}

          {/* LISTINGS PAGE */}
          {activePage === 'listings' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Listings Management</div>
                  <div className="section-subtitle">Approve or reject rental listings</div>
                </div>
                <div className="section-actions">
                  <span className="badge badge-warning">3 Pending</span>
                  <span className="badge badge-outline">6 Total</span>
                </div>
              </div>
              <div className="filters">
                <div className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filter:
                </div>
                <select value={listingFilter} onChange={(e) => setListingFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <ListingsTable listings={listings} onApprove={handleApproveListing} onReject={handleRejectListing} filter={listingFilter} />
            </section>
          )}

          {/* ORDERS PAGE */}
          {activePage === 'orders' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Orders Management</div>
                  <div className="section-subtitle">Monitor and manage rental orders</div>
                </div>
                <div className="section-actions">
                  <span className="badge badge-warning">3 Pending</span>
                  <span className="badge badge-outline">5 Total Orders</span>
                </div>
              </div>
              <div className="filters">
                <div className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filter:
                </div>
                <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <OrdersTable orders={orders} filter={orderFilter} />
            </section>
          )}

          {/* PAYMENTS PAGE */}
          {activePage === 'payments' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Payments & Compliance</div>
                  <div className="section-subtitle">Manage payments with eSewa & Khalti (Mock) and Nepal VAT</div>
                </div>
                <button className="btn btn-outline" onClick={() => setVatModalOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
                  VAT Calculator
                </button>
              </div>

              <div className="quick-stats">
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>} value="Rs. 22,300" label="Total Revenue" iconStyle={{ background: 'hsl(142, 76%, 95%)', color: 'var(--success)' }} />
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/></svg>} value="Rs. 2,899" label="Total VAT Collected" iconStyle={{ background: 'hsl(211, 100%, 95%)', color: 'var(--primary)' }} />
                <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>} value="3" label="Pending Payments" iconStyle={{ background: 'hsl(38, 92%, 95%)', color: 'var(--warning)' }} />
                <QuickStatCard icon={<span style={{ fontWeight: 700, fontSize: '0.875rem' }}>13%</span>} value="Nepal VAT" label="Current Rate" iconStyle={{ background: 'hsl(280, 65%, 95%)', color: 'var(--chart-4)' }} />
              </div>

              <div className="activity-grid mb-4">
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="payment-icon esewa" style={{ width: '48px', height: '48px', borderRadius: '12px', fontSize: '1rem' }}>eS</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>eSewa Integration</div>
                      <div className="text-sm text-muted">Nepal's #1 Digital Wallet</div>
                    </div>
                    <span className="badge badge-warning">Mock Mode</span>
                  </div>
                  <p className="text-sm text-muted">Simulated eSewa payments for testing.</p>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="payment-icon khalti" style={{ width: '48px', height: '48px', borderRadius: '12px', fontSize: '1rem' }}>Kh</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>Khalti Integration</div>
                      <div className="text-sm text-muted">Digital Payment Gateway</div>
                    </div>
                    <span className="badge badge-warning">Mock Mode</span>
                  </div>
                  <p className="text-sm text-muted">Simulated Khalti payments for testing.</p>
                </div>
              </div>

              <PaymentsTable payments={payments} />
            </section>
          )}

          {/* VERIFICATION PAGE */}
          {activePage === 'verification' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Student ID Verification</div>
                  <div className="section-subtitle">Verify student IDs for discount eligibility</div>
                </div>
                <div className="section-actions">
                  <span className="badge badge-warning">2 Pending</span>
                  <span className="badge badge-success">2 Verified</span>
                </div>
              </div>

              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} value="4" label="Total Applications" iconClass="primary" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>} value="2" label="Verified Students" iconClass="success" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>} value="2" label="Awaiting Review" iconClass="warning" />
              </div>

              <div className="card info-card">
                <div className="info-card-content">
                  <div className="info-card-icon">10%</div>
                  <div>
                    <div className="info-card-title">Student Discount Program</div>
                    <div className="info-card-text">Verified students receive 10% discount on all rentals. Use promo code <code style={{ background: 'var(--muted)', padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }}>STUDENT10</code></div>
                  </div>
                </div>
              </div>

              <VerificationsTable verifications={verifications} onApprove={handleApproveVerification} onReject={handleRejectVerification} />
            </section>
          )}

          {/* PROMOTIONS PAGE */}
          {activePage === 'promotions' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Promotions & Promo Codes</div>
                  <div className="section-subtitle">Create and manage promotional offers</div>
                </div>
                <button className="btn btn-primary" onClick={() => setPromoModalOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Create Promo Code
                </button>
              </div>

              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>} value={promos.length} label="Total Promos" iconClass="primary" />
                <StatCard icon={<span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{promos.filter(p => p.isActive).length}</span>} value={promos.filter(p => p.isActive).length} label="Active Promos" iconClass="success" />
                <StatCard icon={<span style={{ fontWeight: 700 }}>#</span>} value="395" label="Total Usage" iconClass="primary" />
              </div>

              <PromosTable promos={promos} onToggle={handleTogglePromo} onDelete={handleDeletePromo} />
            </section>
          )}

          {/* ANALYTICS PAGE */}
          {activePage === 'analytics' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Analytics Dashboard</div>
                  <div className="section-subtitle">Platform performance metrics and insights</div>
                </div>
              </div>

              <div className="stats-grid">
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} value="620" label="Total Users" trend="+12%" iconClass="primary" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>} value="234" label="Active Listings" trend="+8%" iconClass="success" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/></svg>} value="1,250" label="Total Rentals" trend="+15%" iconClass="warning" />
                <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/></svg>} value="Rs. 660K" label="Total Revenue" trend="+23%" iconClass="primary" />
              </div>

              <div className="charts-grid">
                <ChartCard title="Revenue Overview" subtitle="Monthly revenue in Nepali Rupees" chartId="revenue" chartConfig={revenueChart} />
                <ChartCard title="Category Distribution" subtitle="Rentals breakdown" chartId="category2" chartConfig={categoryChart} />
              </div>

              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="card stat-card text-center">
                  <div className="text-4xl font-bold text-primary">85</div>
                  <div className="stat-label">Active Sellers</div>
                  <div className="text-xs text-success mt-2">+5 this month</div>
                </div>
                <div className="card stat-card text-center">
                  <div className="text-4xl font-bold text-success">320</div>
                  <div className="stat-label">Student Discounts Used</div>
                  <div className="text-xs text-success mt-2">+28 this month</div>
                </div>
                <div className="card stat-card text-center">
                  <div className="text-4xl font-bold text-warning">45</div>
                  <div className="stat-label">Pending Orders</div>
                  <div className="text-xs text-muted mt-2">Needs attention</div>
                </div>
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