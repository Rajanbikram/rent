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
import AddListingModal from '../components/seller/AddListingModal';
import Toast from '../components/seller/Toast';
import '../styles/SellerDashboard.css';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);

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

      console.log('🔄 Fetching dashboard data...');
      const response = await api.get('/seller/dashboard');

      console.log('📦 Dashboard API Response:', response.data);

      if (response.data.success) {
        console.log('✅ Dashboard data loaded');
        console.log('📋 Listings count:', response.data.data.listings?.length || 0);
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
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

  const handleAddListing = () => {
    console.log('🚀 Opening Add Listing modal');
    setIsAddListingModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('🔴 Closing modal');
    setIsAddListingModalOpen(false);
  };

  const handleListingSubmit = async (listingData) => {
    try {
      console.log('📤 Submitting listing:', listingData);
      
      // Call API to create listing
      const response = await api.post('/seller/listings', listingData);
      
      console.log('✅ API Response:', response.data);
      
      if (response.data.success) {
        // Show success toast
        showToast('Success', 'Listing created successfully', 'success');
        
        // Close modal
        setIsAddListingModalOpen(false);
        
        // Wait a bit then refresh dashboard to show new listing
        setTimeout(async () => {
          console.log('🔄 Refreshing dashboard after listing creation...');
          await fetchDashboardData();
        }, 500);
      } else {
        showToast('Error', response.data.message || 'Failed to create listing', 'error');
      }
    } catch (error) {
      console.error('❌ Error creating listing:', error);
      console.error('Error details:', error.response?.data);
      
      // Show error message
      const errorMessage = error.response?.data?.message || 'Failed to create listing';
      showToast('Error', errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.125rem',
        color: '#64748b'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '1.125rem', color: '#ef4444' }}>
          Error loading dashboard
        </div>
        <button 
          onClick={fetchDashboardData}
          style={{
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
    );
  }

  const { seller, listings, messages, rentalHistory, earnings, stats } = dashboardData;

  console.log('🎨 Rendering dashboard with:', {
    listingsCount: listings?.length || 0,
    modalOpen: isAddListingModalOpen
  });

  return (
    <div className="dashboard">
      <Toast toasts={toasts} onRemove={removeToast} />
      
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        stats={stats}
        onAddListing={handleAddListing}
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
              listings={listings || []}
              searchQuery={searchQuery}
              onToggleStatus={fetchDashboardData}
              showToast={showToast}
              onAddListing={handleAddListing}
            />
          )}

          {currentTab === 'pending' && (
            <PendingTab
              listings={(listings || []).filter(l => l.status === 'pending')}
              showToast={showToast}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesTab
              messages={messages || []}
              onReply={fetchDashboardData}
              onMarkRead={fetchDashboardData}
              showToast={showToast}
            />
          )}

          {currentTab === 'earnings' && (
            <EarningsTab earnings={earnings || []} />
          )}

          {currentTab === 'history' && (
            <HistoryTab history={rentalHistory || []} />
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

      {/* Add Listing Modal */}
      <AddListingModal
        isOpen={isAddListingModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleListingSubmit}
      />
    </div>
  );
};

export default SellerDashboard;