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

function AdminPages() {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('dashboard');
  
  // ✅ Real dashboard data from API
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  // ✅ Real users data
  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersStats, setUsersStats] = useState(null);
  
  // ✅ Real listings data
  const [listingsData, setListingsData] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsStats, setListingsStats] = useState(null);
  
  // ✅ Real orders data
  const [ordersData, setOrdersData] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersStats, setOrdersStats] = useState(null);
  
  // ✅ Real payments data
  const [paymentsData, setPaymentsData] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsStats, setPaymentsStats] = useState(null);
  
  // Filter states
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [listingFilter, setListingFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const pageHeaders = {
    dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Admin' },
    users: { title: 'Users & Sellers', subtitle: 'Manage platform users' },
    listings: { title: 'Listings', subtitle: 'Approve and manage rental listings' },
    orders: { title: 'Orders', subtitle: 'Monitor rental orders' },
    payments: { title: 'Payments', subtitle: 'Manage payments and VAT' }
  };

  // ✅ Fetch data when page changes
  useEffect(() => {
    if (activePage === 'dashboard') {
      fetchDashboardData();
    } else if (activePage === 'users') {
      fetchUsersData();
    } else if (activePage === 'listings') {
      fetchListingsData();
    } else if (activePage === 'orders') {
      fetchOrdersData();
    } else if (activePage === 'payments') {
      fetchPaymentsData();
      fetchPaymentStats();
    }
  }, [activePage]);

  // ✅ Re-fetch users when filters change
  useEffect(() => {
    if (activePage === 'users') {
      fetchUsersData();
    }
  }, [userSearch, userTypeFilter]);

  // ✅ Re-fetch listings when filter changes
  useEffect(() => {
    if (activePage === 'listings') {
      fetchListingsData();
    }
  }, [listingFilter]);

  // ✅ Re-fetch orders when filter changes
  useEffect(() => {
    if (activePage === 'orders') {
      fetchOrdersData();
    }
  }, [orderFilter]);

  // ✅ Re-fetch payments when filter changes
  useEffect(() => {
    if (activePage === 'payments') {
      fetchPaymentsData();
    }
  }, [paymentFilter]);

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

  // ✅ Fetch users and sellers data
  const fetchUsersData = async () => {
    try {
      setUsersLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Fetching users data...');
      
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userTypeFilter !== 'all') params.append('type', userTypeFilter);
      
      const response = await axios.get(`http://localhost:5000/api/admin/users/all?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsersData(response.data.data.items);
        setUsersStats(response.data.data.stats);
        console.log('✅ Users data loaded:', response.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      showToast('Error', 'Failed to load users data');
    } finally {
      setUsersLoading(false);
    }
  };

  // ✅ Fetch listings data
  const fetchListingsData = async () => {
    try {
      setListingsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Fetching listings data...');
      
      const params = new URLSearchParams();
      if (listingFilter !== 'all') params.append('status', listingFilter);
      
      const response = await axios.get(`http://localhost:5000/api/admin/listings?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Listings response:', response.data);
      
      const listings = Array.isArray(response.data) ? response.data : [];
      setListingsData(listings);
      
      const stats = {
        total: listings.length,
        pending: listings.filter(l => l.status === 'pending').length,
        approved: listings.filter(l => l.status === 'approved').length,
        rejected: listings.filter(l => l.status === 'rejected').length,
        active: listings.filter(l => l.status === 'active').length,
        paused: listings.filter(l => l.status === 'paused').length
      };
      setListingsStats(stats);
      
      console.log('✅ Listings data loaded:', listings.length, 'listings');
      
    } catch (error) {
      console.error('❌ Error fetching listings:', error);
      showToast('Error', 'Failed to load listings data');
    } finally {
      setListingsLoading(false);
    }
  };

  // ✅ Fetch orders data
  const fetchOrdersData = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Fetching orders data...');
      
      const params = new URLSearchParams();
      if (orderFilter !== 'all') params.append('status', orderFilter);
      
      const response = await axios.get(`http://localhost:5000/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Orders response:', response.data);
      
      const orders = Array.isArray(response.data) ? response.data : [];
      setOrdersData(orders);
      
      const stats = {
        total: orders.length,
        booked: orders.filter(o => o.status === 'booked').length,
        active: orders.filter(o => o.status === 'active').length,
        endingSoon: orders.filter(o => o.status === 'ending-soon').length,
        returned: orders.filter(o => o.status === 'returned').length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || o.total_amount || 0), 0)
      };
      setOrdersStats(stats);
      
      console.log('✅ Orders data loaded:', orders.length, 'orders');
      console.log('✅ Stats:', stats);
      
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      showToast('Error', 'Failed to load orders data');
    } finally {
      setOrdersLoading(false);
    }
  };

  // ✅ Fetch payments data
  const fetchPaymentsData = async () => {
    try {
      setPaymentsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Fetching payments data...');
      
      const params = new URLSearchParams();
      if (paymentFilter !== 'all') params.append('status', paymentFilter);
      
      const response = await axios.get(`http://localhost:5000/api/admin/payments?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Payments response:', response.data);
      
      const payments = Array.isArray(response.data) ? response.data : [];
      setPaymentsData(payments);
      
      console.log('✅ Payments data loaded:', payments.length, 'payments');
      
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      showToast('Error', 'Failed to load payments data');
    } finally {
      setPaymentsLoading(false);
    }
  };

  // ✅ Fetch payment statistics
  const fetchPaymentStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/admin/payments/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPaymentsStats(response.data.stats);
        console.log('✅ Payment stats loaded:', response.data.stats);
      }
      
    } catch (error) {
      console.error('❌ Error fetching payment stats:', error);
    }
  };

  // ✅ User Actions
  const handleBanUser = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${user.id}/toggle-status`,
        { type: user.type },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const action = user.type === 'seller' 
        ? (user.isActive ? 'deactivated' : 'activated')
        : 'banned/unbanned';
      
      showToast('Success', `User ${action} successfully`);
      fetchUsersData();
    } catch (error) {
      console.error('Error toggling user status:', error);
      showToast('Error', 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name || user.fullName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/users/${user.id}`,
        {
          data: { type: user.type },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', 'User deleted successfully');
      fetchUsersData();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error', 'Failed to delete user');
    }
  };

  const handleRoleChange = async (user) => {
    const newRole = prompt(`Enter new role for ${user.fullName} (admin/seller/renter):`, user.role);
    
    if (!newRole || !['admin', 'seller', 'renter'].includes(newRole)) {
      showToast('Error', 'Invalid role. Must be admin, seller, or renter');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${user.id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', `Role updated to ${newRole}`);
      fetchUsersData();
    } catch (error) {
      console.error('Error updating role:', error);
      showToast('Error', 'Failed to update role');
    }
  };
  
  // ✅ Listing Actions
  const handleApproveListing = async (listing) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/listings/${listing.id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', `${listing.title} has been approved and activated`);
      fetchListingsData();
    } catch (error) {
      console.error('Error approving listing:', error);
      showToast('Error', 'Failed to approve listing');
    }
  };
  
  const handleRejectListing = async (listing) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/listings/${listing.id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', `${listing.title} has been rejected`);
      fetchListingsData();
    } catch (error) {
      console.error('Error rejecting listing:', error);
      showToast('Error', 'Failed to reject listing');
    }
  };

  const handleDeleteListing = async (listing) => {
    if (!window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/listings/${listing.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', 'Listing deleted successfully');
      fetchListingsData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      showToast('Error', 'Failed to delete listing');
    }
  };

  // ✅ Order Actions
  const handleOrderStatusChange = async (order, newStatus) => {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${order.id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', `Order status changed to ${newStatus}`);
      fetchOrdersData();
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Error', 'Failed to update order status');
    }
  };

  // ✅ Payment Actions
  const handlePaymentStatusChange = async (payment, newStatus) => {
    if (!window.confirm(`Change payment status to "${newStatus}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/payments/${payment.id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showToast('Success', `Payment status changed to ${newStatus}`);
      fetchPaymentsData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast('Error', 'Failed to update payment status');
    }
  };

  // Charts config
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

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="main-content">
        <Header title={pageHeaders[activePage].title} subtitle={pageHeaders[activePage].subtitle} />
        <div className="page-content">

          {/* ✅ DASHBOARD */}
          {activePage === 'dashboard' && (
            <section className="page-section active">
              {dashboardLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', fontSize: '1.125rem', color: '#64748b' }}>
                  Loading dashboard data...
                </div>
              ) : dashboardData ? (
                <>
                  <div className="stats-grid">
                    <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} value={dashboardData.stats.totalUsers} label="Total Users" iconClass="primary" />
                    <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>} value={dashboardData.stats.activeListings} label="Active Listings" iconClass="success" />
                    <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} value={dashboardData.stats.totalOrders} label="Total Orders" iconClass="warning" />
                    <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>} value={`Rs. ${Math.round(dashboardData.stats.monthlyRevenue / 1000)}K`} label="Monthly Revenue" iconClass="primary" />
                  </div>

                  <div className="quick-stats">
                    <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>} value={dashboardData.stats.pendingListings} label="Pending Listings" iconStyle={{ background: 'hsl(38, 92%, 95%)', color: 'var(--warning)' }} />
                    <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>} value={dashboardData.stats.pendingOrders} label="Pending Orders" iconStyle={{ background: 'hsl(211, 100%, 95%)', color: 'var(--primary)' }} />
                    <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>} value={dashboardData.stats.activeSellers} label="Active Sellers" iconStyle={{ background: 'hsl(142, 76%, 95%)', color: 'var(--success)' }} />
                    <QuickStatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} value="N/A" label="Student Discounts" iconStyle={{ background: 'hsl(280, 65%, 95%)', color: 'var(--chart-4)' }} />
                  </div>

                  <div className="charts-grid">
                    <ChartCard title="User Growth" subtitle="Since first signup" chartId="userGrowth" chartConfig={userGrowthChart} />
                    <ChartCard title="Rentals by Category" subtitle="Distribution overview" chartId="category" chartConfig={categoryChart} legend={<>{dashboardData.charts?.categoryDistribution?.labels?.map((label, index) => (<div className="legend-item" key={index}><div className="legend-dot" style={{ background: ['hsl(211, 100%, 50%)', 'hsl(142, 76%, 36%)'][index] }}></div>{label} ({dashboardData.charts.categoryDistribution.percentages[index]}%)</div>))}</>} />
                  </div>

                  <div className="activity-grid">
                    <ActivityCard title="Recent Orders" items={dashboardData.recentActivity?.orders?.length > 0 ? dashboardData.recentActivity.orders.map(order => ({ title: `Order #${order.id.substring(0, 8)}`, subtitle: order.renterName, value: `Rs. ${order.amount.toLocaleString()}`, badge: order.status, badgeType: order.status === 'booked' ? 'warning' : order.status === 'active' ? 'primary' : 'success' })) : [{ title: 'No recent orders', subtitle: '', value: '', badge: '', badgeType: '' }]} />
                    <ActivityCard title="Pending Listings" items={dashboardData.recentActivity?.pendingListings?.length > 0 ? dashboardData.recentActivity.pendingListings.map(listing => ({ title: listing.title, subtitle: 'Awaiting approval', value: `Rs. ${listing.pricePerMonth}/month`, badge: 'Pending', badgeType: 'warning' })) : [{ title: 'No pending listings', subtitle: '', value: '', badge: '', badgeType: '' }]} />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                  <div>Failed to load dashboard data</div>
                  <button onClick={fetchDashboardData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Retry</button>
                </div>
              )}
            </section>
          )}

          {/* ✅ USERS PAGE */}
          {activePage === 'users' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Users & Sellers Management</div>
                  <div className="section-subtitle">Manage user roles, ban users, and view activity logs</div>
                </div>
                {usersStats && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="badge badge-outline">{usersStats.totalUsers} Users</span>
                    <span className="badge badge-outline">{usersStats.totalSellers} Sellers</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search by name or email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ flex: 1, minWidth: '250px', padding: '0.625rem 1rem', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                <select value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)} style={{ padding: '0.625rem 1rem', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
                  <option value="all">All Types</option>
                  <option value="users">Users Only</option>
                  <option value="sellers">Sellers Only</option>
                </select>
              </div>

              {usersLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}><div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading users...</div></div>
              ) : (
                <UsersTable data={usersData} onBan={handleBanUser} onDelete={handleDeleteUser} onRoleChange={handleRoleChange} type={userTypeFilter} />
              )}
            </section>
          )}

          {/* ✅ LISTINGS PAGE */}
          {activePage === 'listings' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Listings Management</div>
                  <div className="section-subtitle">Approve or reject rental listings</div>
                </div>
                {listingsStats && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-outline">{listingsStats.total} Total</span>
                    <span className="badge badge-warning">{listingsStats.pending} Pending</span>
                    <span className="badge badge-success">{listingsStats.approved} Approved</span>
                    {listingsStats.rejected > 0 && <span className="badge badge-destructive">{listingsStats.rejected} Rejected</span>}
                    {listingsStats.active > 0 && <span className="badge badge-primary">{listingsStats.active} Active</span>}
                    {listingsStats.paused > 0 && <span className="badge badge-outline">{listingsStats.paused} Paused</span>}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select value={listingFilter} onChange={(e) => setListingFilter(e.target.value)} style={{ padding: '0.625rem 1rem', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'white', cursor: 'pointer', minWidth: '200px' }}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Only</option>
                  <option value="approved">Approved Only</option>
                  <option value="active">Active Only</option>
                  <option value="paused">Paused Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
              </div>

              {listingsLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.125rem', color: '#64748b' }}>Loading listings...</div>
              ) : listingsData.length > 0 ? (
                <ListingsTable listings={listingsData} onApprove={handleApproveListing} onReject={handleRejectListing} onDelete={handleDeleteListing} filter={listingFilter} />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#94a3b8' }}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                  <div style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '0.5rem' }}>No listings found</div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{listingFilter !== 'all' ? `No listings with status "${listingFilter}"` : 'No listings available in the system'}</div>
                </div>
              )}
            </section>
          )}

          {/* ✅ ORDERS PAGE */}
          {activePage === 'orders' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Orders Management</div>
                  <div className="section-subtitle">Monitor and manage rental orders</div>
                </div>
                {ordersStats && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-outline">{ordersStats.total} Total</span>
                    <span className="badge badge-warning">{ordersStats.booked} Booked</span>
                    <span className="badge badge-primary">{ordersStats.active} Active</span>
                    <span className="badge badge-success">{ordersStats.returned} Returned</span>
                    {ordersStats.endingSoon > 0 && <span className="badge badge-warning">{ordersStats.endingSoon} Ending Soon</span>}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} style={{ padding: '0.625rem 1rem', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'white', cursor: 'pointer', minWidth: '200px' }}>
                  <option value="all">All Statuses</option>
                  <option value="booked">Booked Only</option>
                  <option value="active">Active Only</option>
                  <option value="ending-soon">Ending Soon Only</option>
                  <option value="returned">Returned Only</option>
                </select>
              </div>

              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.125rem', color: '#64748b' }}>Loading orders...</div>
              ) : ordersData.length > 0 ? (
                <OrdersTable orders={ordersData} onStatusChange={handleOrderStatusChange} filter={orderFilter} />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#94a3b8' }}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  <div style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '0.5rem' }}>No orders found</div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{orderFilter !== 'all' ? `No orders with status "${orderFilter}"` : 'No orders available in the system'}</div>
                </div>
              )}
            </section>
          )}

          {/* ✅ PAYMENTS PAGE */}
          {activePage === 'payments' && (
            <section className="page-section active">
              <div className="section-header">
                <div>
                  <div className="section-title">Payments & Compliance</div>
                  <div className="section-subtitle">Manage payments with eSewa & Khalti and Nepal VAT (13%)</div>
                </div>
                {paymentsStats && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-outline">{paymentsStats.totalPayments} Total</span>
                    <span className="badge badge-warning">{paymentsStats.pendingPayments} Pending</span>
                    <span className="badge badge-success">{paymentsStats.completedPayments} Completed</span>
                    {paymentsStats.failedPayments > 0 && <span className="badge badge-destructive">{paymentsStats.failedPayments} Failed</span>}
                    <span className="badge badge-primary">Revenue: Rs. {paymentsStats.totalRevenue?.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} style={{ padding: '0.625rem 1rem', border: '1px solid hsl(214, 32%, 91%)', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'white', cursor: 'pointer', minWidth: '200px' }}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Only</option>
                  <option value="completed">Completed Only</option>
                  <option value="failed">Failed Only</option>
                </select>

                {paymentsStats && (
                  <div style={{ padding: '0.625rem 1rem', background: 'hsl(142, 76%, 95%)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'hsl(142, 76%, 36%)', fontWeight: 600 }}>
                    VAT Collected (13%): Rs. {paymentsStats.totalVAT?.toLocaleString()}
                  </div>
                )}
              </div>

              {paymentsLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.125rem', color: '#64748b' }}>Loading payments...</div>
              ) : paymentsData.length > 0 ? (
                <PaymentsTable payments={paymentsData} onStatusChange={handlePaymentStatusChange} filter={paymentFilter} stats={paymentsStats} />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.5rem', border: '1px solid hsl(214, 32%, 91%)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#94a3b8' }}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                  <div style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '0.5rem' }}>No payments found</div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{paymentFilter !== 'all' ? `No payments with status "${paymentFilter}"` : 'No payments available in the system'}</div>
                </div>
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminPages;