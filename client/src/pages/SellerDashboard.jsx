import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/seller/Sidebar';
import Header from '../components/seller/Header';
import ListingTab from '../components/seller/ListingTab';
import PendingTab from '../components/seller/PendingTab';
import MessagesTab from '../components/seller/MessagesTab';
import EarningsTab from '../components/seller/EarningsTab';
import HistoryTab from '../components/seller/HistoryTab';
import ProfileTab from '../components/seller/ProfileTab';
import Toast from '../components/seller/Toast';
import '../styles/SellerDashboard.css';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/seller/dashboard');

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      showToast('Error', 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title, description, variant = 'success') => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newToast = { id, title, description, variant };
    
    setToasts(prev => {
      const updated = [...prev, newToast];
      return updated.slice(-3);
    });

    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      showToast('Logged Out', 'Successfully logged out', 'success');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>;
  }

  const { seller, listings, messages, rentalHistory, earnings, stats } = dashboardData;

  return (
    <div className="dashboard">
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        stats={stats}
        onAddListing={() => showToast('Coming Soon', 'Add listing modal', 'success')}
      />

      <main className="main-content">
        <Header
          seller={seller}
          onSearch={handleSearch}
          onLogout={handleLogout}
          notificationCount={stats.unreadMessages}
        />

        <div className="content scrollbar-thin">
          {currentTab === 'listings' && (
            <ListingTab
              listings={listings}
              searchQuery={searchQuery}
              onToggleStatus={fetchDashboardData}
              showToast={showToast}
            />
          )}

          {currentTab === 'pending' && (
            <PendingTab
              listings={listings.filter(l => l.status === 'pending')}
              showToast={showToast}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesTab
              messages={messages}
              onReply={fetchDashboardData}
              onMarkRead={fetchDashboardData}
              showToast={showToast}
            />
          )}

          {currentTab === 'earnings' && (
            <EarningsTab earnings={earnings} />
          )}

          {currentTab === 'history' && (
            <HistoryTab history={rentalHistory} />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              seller={seller}
              onUpdate={fetchDashboardData}
              showToast={showToast}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;