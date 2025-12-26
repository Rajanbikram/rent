import React from 'react';

const PendingTab = ({ listings, showToast }) => {
  const formatNPR = (amount) => `NPR ${amount.toLocaleString('en-NP')}`;
  
  const formatDate = (date) => {
    const dt = new Date(date);
    return dt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleRefresh = () => {
    showToast('Refreshed', 'Listings refreshed', 'success');
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Pending Approvals</h2>
          <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
            {listings.length} awaiting review
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleRefresh}>
          🔄 Refresh
        </button>
      </div>
      
      {listings.length > 0 ? (
        <>
          <div style={{ marginTop: '1.5rem' }}>
            {listings.map(listing => (
              <div key={listing.id} className="pending-item fade-in">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="pending-image"
                />
                <div className="pending-info">
                  <div style={{ fontWeight: 600 }}>{listing.title}</div>
                  <div style={{
                    color: 'var(--muted-fg)',
                    fontSize: '.875rem',
                    marginTop: '.25rem'
                  }}>
                    {formatNPR(listing.pricePerMonth)}/month
                  </div>
                  <div style={{
                    fontSize: '.75rem',
                    color: 'var(--muted-fg)',
                    marginTop: '.25rem'
                  }}>
                    Submitted {formatDate(listing.createdAt)}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '.5rem'
                }}>
                  <span className="status-badge warning">Under Review</span>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted-fg)' }}>
                    ⏱️ ~24-48h
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(107, 114, 128, 0.05)',
            borderRadius: '8px',
            marginTop: '1.5rem'
          }}>
            <p style={{ fontSize: '.875rem', color: 'var(--muted-fg)' }}>
              <strong style={{ color: 'var(--fg)' }}>Note:</strong> Reviews typically take 24-48 hours.
            </p>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">⏱️</div>
          <p style={{ fontWeight: 600 }}>No pending listings</p>
        </div>
      )}
    </div>
  );
};

export default PendingTab;