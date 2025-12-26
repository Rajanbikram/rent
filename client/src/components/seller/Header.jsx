import React from 'react';

const Header = ({ seller = {}, onSearch, onLogout, notificationCount = 0 }) => {
  const sellerName = seller?.fullName || seller?.name || 'Seller';
  const sellerAvatar = seller?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

  return (
    <header className="header">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      
      <div className="header-right">
        <button className="icon-btn" style={{ position: 'relative' }}>
          🔔
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '18px',
              height: '18px',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '50%',
              fontSize: '.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationCount}
            </span>
          )}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div className="avatar">
            <img 
              src={sellerAvatar}
              alt="Profile" 
            />
          </div>
          <div>
            <p style={{ fontSize: '.875rem', fontWeight: 600 }}>{sellerName}</p>
            <p style={{ fontSize: '.75rem', color: 'var(--muted-fg)' }}>Seller Account</p>
          </div>
        </div>
        
        <button className="btn btn-secondary" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default Header;