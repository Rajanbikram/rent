import React from 'react';
import { useRental } from '../../contexts/RentalContext';

const ActiveRentals = ({ showToast }) => {
  const { rentals, renewRental } = useRental();

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleRenew = async (rentalId) => {
    const success = await renewRental(rentalId);
    if (success) {
      showToast('Renewal requested', "We'll contact you shortly to confirm the renewal.");
    } else {
      showToast('Error', 'Failed to renew rental.', 'error');
    }
  };

  const steps = ['booked', 'active', 'ending-soon', 'returned'];
  
  const statusBadges = {
    booked: 'badge-info',
    active: 'badge-success',
    'ending-soon': 'badge-warning',
    returned: 'badge-secondary'
  };

  if (rentals.length === 0) {
    return (
      <section className="section">
        <h2 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7.5 4.27 9 5.15"/>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
          </svg>
          Your Active Rentals
        </h2>
        <div className="card" style={{padding: '3rem', textAlign: 'center'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 1rem', color: 'var(--muted-foreground)'}}>
            <path d="m7.5 4.27 9 5.15"/>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
          </svg>
          <h3 style={{fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem'}}>No Active Rentals</h3>
          <p style={{color: 'var(--muted-foreground)'}}>Start renting furniture and appliances to see them here!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2 className="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.27 9 5.15"/>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
        Your Active Rentals
      </h2>
      {rentals.map(rental => {
        const days = getDaysRemaining(rental.endDate);
        const currentIdx = steps.indexOf(rental.status);
        
        return (
          <div key={rental.id} className="active-rental-card">
            <div className="rental-content">
              <div className="rental-image">
                <img src={rental.product.image} alt={rental.product.name} />
              </div>
              <div className="rental-details">
                <div className="rental-header">
                  <div>
                    <h3>{rental.product.name}</h3>
                    <p>{rental.tenure} months tenure</p>
                  </div>
                  <span className={`badge ${statusBadges[rental.status]}`}>
                    {rental.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="order-timeline">
                  {steps.map((step, idx) => (
                    <div key={step} className="timeline-step">
                      <div className={`timeline-dot ${idx <= currentIdx ? 'completed' : ''} ${idx === currentIdx ? 'current' : ''}`}>
                        {idx <= currentIdx ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`timeline-line ${idx < currentIdx ? 'completed' : ''}`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="rental-meta">
                  <div className="rental-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    {formatDate(rental.startDate).replace(/,.*/, '')} - {formatDate(rental.endDate)}
                  </div>
                  <div className={`rental-meta-item ${days <= 7 ? 'warning' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {days > 0 ? `${days} days left` : 'Ended'}
                  </div>
                  <span className="rental-price">₹{rental.monthlyRent.toLocaleString('en-IN')}/month</span>
                </div>
              </div>
              <div className="rental-actions">
                <button className="btn btn-primary btn-sm" onClick={() => handleRenew(rental.id)} disabled={rental.status === 'returned'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                    <path d="M16 16h5v5"/>
                  </svg>
                  Renew
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ActiveRentals;