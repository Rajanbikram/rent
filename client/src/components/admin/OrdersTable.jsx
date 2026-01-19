import React from 'react';

function OrdersTable({ orders, onStatusChange, filter }) {
  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

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
      case 'completed':
        return 'badge-success';
      case 'active':
        return 'badge-primary';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-destructive';
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
              <th>Order ID</th>
              <th>Listing</th>
              <th>Renter</th>
              <th>Period</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No orders to display
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td>
                    <div className="user-cell">
                      <span className="user-name">{order.listingTitle || order.listing_title}</span>
                      <span className="user-email">by {order.sellerName || order.seller}</span>
                    </div>
                  </td>
                  <td className="text-muted">{order.renterName || order.renter}</td>
                  <td>
                    <div className="user-cell">
                      <span>{formatDate(order.startDate || order.start_date)}</span>
                      <span className="user-email">to {formatDate(order.endDate || order.end_date)}</span>
                    </div>
                  </td>
                  <td className="font-bold">
                    Rs. {Number(order.totalAmount || order.total_amount || 0).toLocaleString()}
                  </td>
                  <td>
                    <div className="payment-badge">
                      <div className={`payment-icon ${order.paymentMethod || order.payment_method}`}>
                        {(order.paymentMethod || order.payment_method) === 'esewa' ? 'eS' : 'Kh'}
                      </div>
                      <span>
                        {(order.paymentMethod || order.payment_method) === 'esewa' ? 'eSewa' : 'Khalti'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      {/* View Button */}
                      <button 
                        className="btn btn-ghost btn-icon" 
                        title="View Details"
                        onClick={() => {
                          alert(`Order Details:\n\nID: ${order.id}\nListing: ${order.listingTitle || order.listing_title}\nRenter: ${order.renterName || order.renter}\nAmount: Rs. ${order.totalAmount || order.total_amount}\nStatus: ${order.status}`);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>

                      {/* Status Change Buttons */}
                      {order.status === 'pending' && (
                        <button 
                          className="btn btn-ghost btn-icon text-success" 
                          title="Mark as Active"
                          onClick={() => onStatusChange && onStatusChange(order, 'active')}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </button>
                      )}

                      {order.status === 'active' && (
                        <button 
                          className="btn btn-ghost btn-icon text-success" 
                          title="Mark as Completed"
                          onClick={() => onStatusChange && onStatusChange(order, 'completed')}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22,4 12,14.01 9,11.01"/>
                          </svg>
                        </button>
                      )}

                      {(order.status === 'pending' || order.status === 'active') && (
                        <button 
                          className="btn btn-ghost btn-icon text-destructive" 
                          title="Cancel Order"
                          onClick={() => onStatusChange && onStatusChange(order, 'cancelled')}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      {filteredOrders.length > 0 && (
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
            Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            {filter !== 'all' && ` with status "${filter}"`}
          </div>
          <div>
            Total Revenue: Rs. {filteredOrders.reduce((sum, o) => sum + Number(o.totalAmount || o.total_amount || 0), 0).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersTable;