import React from 'react';

function PaymentsTable({ payments, onStatusChange, filter, stats }) {
  const filteredPayments = payments.filter(p => filter === 'all' || p.status === filter);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-destructive';
      default:
        return 'badge-outline';
    }
  };

  return (
    <div className="card">
      <div style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 600 }}>
          Payment Transactions
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
            <span>Total Revenue: <strong>Rs. {stats.totalRevenue?.toLocaleString()}</strong></span>
            <span>VAT Collected: <strong>Rs. {stats.totalVAT?.toLocaleString()}</strong></span>
          </div>
        )}
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>VAT (13%)</th>
              <th>Total</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No payments to display
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => {
                const totalAmount = Number(payment.amount || 0) + Number(payment.vatAmount || payment.vat_amount || 0);
                
                return (
                  <tr key={payment.id}>
                    <td className="font-mono text-sm">
                      {payment.id.substring(0, 8)}...
                    </td>
                    <td className="font-mono text-sm">
                      {(payment.orderId || payment.order_id || '').substring(0, 8)}...
                    </td>
                    <td className="font-bold">
                      Rs. {Number(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="text-muted">
                      Rs. {Number(payment.vatAmount || payment.vat_amount || 0).toLocaleString()}
                    </td>
                    <td className="font-bold">
                      Rs. {totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <div className="payment-badge">
                        <div className={`payment-icon ${payment.paymentMethod || payment.payment_method}`}>
                          {(payment.paymentMethod || payment.payment_method) === 'esewa' ? 'eS' : 'Kh'}
                        </div>
                        <span>
                          {(payment.paymentMethod || payment.payment_method) === 'esewa' ? 'eSewa' : 'Khalti'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="text-muted">
                      {formatDate(payment.createdAt || payment.created_at)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        {/* View Button */}
                        <button 
                          className="btn btn-ghost btn-icon" 
                          title="View Details"
                          onClick={() => {
                            alert(`Payment Details:\n\nID: ${payment.id}\nOrder: ${payment.orderId || payment.order_id}\nAmount: Rs. ${payment.amount}\nVAT: Rs. ${payment.vatAmount || payment.vat_amount}\nTotal: Rs. ${totalAmount}\nStatus: ${payment.status}`);
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>

                        {/* Status Change Buttons */}
                        {payment.status === 'pending' && (
                          <>
                            <button 
                              className="btn btn-ghost btn-icon text-success" 
                              title="Mark as Completed"
                              onClick={() => onStatusChange && onStatusChange(payment, 'completed')}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20,6 9,17 4,12"/>
                              </svg>
                            </button>
                            <button 
                              className="btn btn-ghost btn-icon text-destructive" 
                              title="Mark as Failed"
                              onClick={() => onStatusChange && onStatusChange(payment, 'failed')}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6 6 18"/>
                                <path d="m6 6 12 12"/>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      {filteredPayments.length > 0 && (
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
            Showing {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
            {filter !== 'all' && ` with status "${filter}"`}
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              Total Amount: Rs. {filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}
            </div>
            <div>
              Total VAT: Rs. {filteredPayments.reduce((sum, p) => sum + Number(p.vatAmount || p.vat_amount || 0), 0).toLocaleString()}
            </div>
            <div>
              <strong>Grand Total: Rs. {filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0) + Number(p.vatAmount || p.vat_amount || 0), 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsTable;