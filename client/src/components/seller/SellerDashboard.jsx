import React from 'react';
import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    console.log('📊 SellerDashboard Mounted');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    console.log('🔑 Token exists:', !!token);
    console.log('👤 User role:', userRole);
    
    if (!token) {
      console.log('❌ No token, redirecting to login');
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token in fetchDashboardData');
        navigate('/login');
        return;
      }

      console.log('🔄 Fetching dashboard data from backend...');

      const response = await axios.get('http://localhost:5000/api/seller/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Dashboard response received:', response.data);

      if (response.data.success) {
        setDashboardData(response.data.data);
        console.log('✅ Dashboard data set successfully');
      } else {
        console.log('⚠️ Response not successful:', response.data);
      }
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        console.log('❌ 401 Unauthorized - clearing tokens and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        showToast('Error', 'Failed to load dashboard. Please try again.', 'error');
      }
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
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      showToast('Logged Out', 'Successfully logged out', 'success');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '20px'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Dashboard...</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>Please wait</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '20px'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#e53e3e' }}>
          ⚠️ Error Loading Dashboard
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', maxWidth: '400px' }}>
          Unable to load dashboard data. Please check your connection and try again.
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          Retry
        </button>
        <button 
          onClick={() => navigate('/login')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  const { seller, listings, messages, rentalHistory, earnings, stats } = dashboardData;

  console.log('🎨 Rendering dashboard with data:', { seller, stats });

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