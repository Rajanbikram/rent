import React from 'react';

const HistoryTab = ({ history }) => {
  // ✅ Transform API data to match UI structure
  const transformedHistory = history.map(rental => {
    // Map status from API to UI format
    let uiStatus = 'pending';
    if (rental.status === 'returned') {
      uiStatus = 'completed';
    } else if (rental.status === 'active') {
      uiStatus = 'ongoing';
    } else if (rental.status === 'booked') {
      uiStatus = 'ongoing';
    } else if (rental.status === 'ending-soon') {
      uiStatus = 'ongoing';
    }

    return {
      id: rental.id,
      listingTitle: rental.product?.title || 'Unknown Product',
      renterName: rental.renter?.fullName || 'Unknown Renter',
      startDate: rental.startDate,
      endDate: rental.endDate,
      duration: rental.tenure,
      earnings: rental.totalAmount,
      status: uiStatus
    };
  });

  const formatDate = (date) => {
    const dt = new Date(date);
    return dt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNPR = (amount) => `NPR ${amount.toLocaleString('en-NP')}`;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'ongoing': return '⏱️';
      case 'disputed': return '⚠️';
      default: return '📦';
    }
  };

  const completedCount = transformedHistory.filter(h => h.status === 'completed').length;
  const ongoingCount = transformedHistory.filter(h => h.status === 'ongoing').length;
  const disputedCount = transformedHistory.filter(h => h.status === 'disputed').length;
  const totalEarned = transformedHistory.reduce((sum, h) => sum + parseFloat(h.earnings), 0);

  return (
    <div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rental History</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
          {transformedHistory.length} records
        </p>
      </div>

      {transformedHistory.length > 0 ? (
        <>
          <div className="history-timeline">
            <div className="timeline-line"></div>
            {transformedHistory.map((item, index) => (
              <div
                key={item.id}
                className="history-item fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`timeline-dot ${item.status}`}>
                  {getStatusIcon(item.status)}
                </div>

                <div className={`history-card ${item.status}`}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.listingTitle}</div>
                      <div style={{
                        fontSize: '.875rem',
                        color: 'var(--muted-fg)',
                        marginTop: '.25rem'
                      }}>
                        Rented by {item.renterName}
                      </div>
                    </div>
                    <span className={`status-badge ${item.status}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>

                  <div className="history-details">
                    <div>
                      <div style={{ color: 'var(--muted-fg)', fontSize: '.75rem' }}>
                        Start Date
                      </div>
                      <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                        {formatDate(item.startDate)}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--muted-fg)', fontSize: '.75rem' }}>
                        End Date
                      </div>
                      <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                        {formatDate(item.endDate)}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--muted-fg)', fontSize: '.75rem' }}>
                        Duration
                      </div>
                      <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                        {item.duration} months
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--muted-fg)', fontSize: '.75rem' }}>
                        Earnings
                      </div>
                      <div style={{
                        fontWeight: 700,
                        color: 'var(--primary)',
                        marginTop: '.25rem'
                      }}>
                        {formatNPR(item.earnings)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(107, 114, 128, 0.05)',
            borderRadius: '8px',
            marginTop: '1.5rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {completedCount}
                </div>
                <div style={{
                  fontSize: '.875rem',
                  color: 'var(--muted-fg)',
                  marginTop: '.25rem'
                }}>
                  Completed
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {ongoingCount}
                </div>
                <div style={{
                  fontSize: '.875rem',
                  color: 'var(--muted-fg)',
                  marginTop: '.25rem'
                }}>
                  Ongoing
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {disputedCount}
                </div>
                <div style={{
                  fontSize: '.875rem',
                  color: 'var(--muted-fg)',
                  marginTop: '.25rem'
                }}>
                  Disputed
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}>
                  {formatNPR(totalEarned)}
                </div>
                <div style={{
                  fontSize: '.875rem',
                  color: 'var(--muted-fg)',
                  marginTop: '.25rem'
                }}>
                  Total Earned
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <p style={{ fontWeight: 600 }}>No rental history yet</p>
          <p style={{ 
            color: 'var(--muted-fg)', 
            fontSize: '.875rem',
            marginTop: '.5rem'
          }}>
            Your rental records will appear here once someone rents your products
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;