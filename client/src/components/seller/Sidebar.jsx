import React from 'react';

const Sidebar = ({ currentTab, onTabChange, stats = {}, onAddListing }) => {
  // Default values for stats to prevent undefined errors
  const safeStats = {
    pendingListings: stats?.pendingListings || 0,
    unreadMessages: stats?.unreadMessages || 0,
    ...stats
  };

  const navItems = [
    { id: 'listings', icon: '📦', label: 'My Listings' },
    { id: 'pending', icon: '⏱️', label: 'Pending Approvals', badge: safeStats.pendingListings },
    { id: 'messages', icon: '💬', label: 'Messages', badge: safeStats.unreadMessages },
    { id: 'earnings', icon: '📈', label: 'Earnings' },
    { id: 'history', icon: '📜', label: 'Rental History' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">R</div>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
            RentEasy
          </h1>
          <p style={{ fontSize: '.75rem', opacity: 0.7 }}>Seller Dashboard</p>
        </div>
      </div>

      <button className="add-listing-btn" onClick={onAddListing}>
        <span>➕</span>
        Add New Listing
      </button>

      <nav className="nav-menu scrollbar-thin">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            {item.icon} {item.label}
            {item.badge > 0 && (
              <span className="badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div style={{
        padding: '1rem',
        margin: '1rem',
        background: 'var(--sidebar-accent)',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '.875rem', fontWeight: 600 }}>Need Help?</p>
        <p style={{ fontSize: '.75rem', opacity: 0.7, marginTop: '.25rem' }}>
          Contact our support team.
        </p>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '.75rem',
          cursor: 'pointer',
          marginTop: '.5rem',
          padding: 0
        }}>
          Get Support →
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;