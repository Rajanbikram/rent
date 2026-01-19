import React from 'react';

function ListingsTable({ listings, onApprove, onReject, onDelete, filter }) {
  // Filter listings based on status
  const filteredListings = listings.filter(l => filter === 'all' || l.status === filter);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved':
      case 'active':
        return 'badge-success';
      case 'rejected':
        return 'badge-destructive';
      case 'pending':
        return 'badge-warning';
      case 'paused':
        return 'badge-outline';
      default:
        return 'badge-outline';
    }
  };

  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Listing</th>
              <th>Category</th>
              <th>Price/Month</th>
              <th>Created</th>
              <th>Status</th>
              <th>Views</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No listings to display
                </td>
              </tr>
            ) : (
              filteredListings.map(listing => (
                <tr key={listing.id}>
                  <td>
                    <div className="font-bold">{listing.title || 'Untitled Listing'}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      ID: {listing.id.substring(0, 8)}...
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {listing.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="font-bold">
                    Rs. {listing.pricePerMonth ? Number(listing.pricePerMonth).toLocaleString() : '0'}
                  </td>
                  <td className="text-muted">
                    {formatDate(listing.createdAt)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(listing.status)}`}>
                      {listing.status || 'unknown'}
                    </span>
                  </td>
                  <td className="text-muted">
                    {listing.views || 0}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      {/* View Button */}
                      <button 
                        className="btn btn-ghost btn-icon" 
                        title="View Details"
                        onClick={() => {
                          console.log('View listing:', listing);
                          alert(`Listing Details:\n\nTitle: ${listing.title}\nCategory: ${listing.category}\nPrice: Rs. ${listing.pricePerMonth}\nStatus: ${listing.status}\nDescription: ${listing.description || 'No description'}`);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>

                      {/* Approve Button - Only for pending listings */}
                      {listing.status === 'pending' && (
                        <button 
                          className="btn btn-ghost btn-icon text-success" 
                          title="Approve Listing" 
                          onClick={() => onApprove(listing)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </button>
                      )}

                      {/* Reject Button - Only for pending listings */}
                      {listing.status === 'pending' && (
                        <button 
                          className="btn btn-ghost btn-icon text-destructive" 
                          title="Reject Listing" 
                          onClick={() => onReject(listing)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                          </svg>
                        </button>
                      )}

                      {/* Delete Button - Available for all listings */}
                      <button 
                        className="btn btn-ghost btn-icon text-destructive" 
                        title="Delete Listing" 
                        onClick={() => onDelete && onDelete(listing)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          <path d="M10 11v6"/>
                          <path d="M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Summary */}
      {filteredListings.length > 0 && (
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid hsl(214, 32%, 91%)',
          fontSize: '0.875rem',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
            {filter !== 'all' && ` with status "${filter}"`}
          </div>
          <div>
            Total Value: Rs. {filteredListings.reduce((sum, l) => sum + Number(l.pricePerMonth || 0), 0).toLocaleString()}/month
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingsTable;