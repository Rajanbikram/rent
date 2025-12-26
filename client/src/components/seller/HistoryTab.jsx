import React from 'react';

const HistoryTab = ({ history }) => {
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

  const completedCount = history.filter(h => h.status === 'completed').length;
  const ongoingCount = history.filter(h => h.status === 'ongoing').length;
  const disputedCount = history.filter(h => h.status === 'disputed').length;
  const totalEarned = history.reduce((sum, h) => sum + parseFloat(h.earnings), 0);

  return (
    <div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rental History</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
          {history.length} records
        </p>
      </div>

      {history.length > 0 ? (
        <>
          <div className="history-timeline">
            <div className="timeline-line"></div>
            {history.map((item, index) => (
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
          <p style={{ fontWeight: 600 }}>No history yet</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;