import React from 'react';

function PaymentsTable({ payments }) {
  return (
    <div className="card">
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
        Payment Transactions
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
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td className="font-mono text-sm">{payment.id}</td>
                <td className="font-mono text-sm">{payment.orderId}</td>
                <td className="font-bold">Rs. {payment.amount.toLocaleString()}</td>
                <td className="text-muted">Rs. {payment.vatAmount.toLocaleString()}</td>
                <td className="font-bold">Rs. {(payment.amount + payment.vatAmount).toLocaleString()}</td>
                <td>
                  <div className="payment-badge">
                    <div className={`payment-icon ${payment.paymentMethod}`}>
                      {payment.paymentMethod === 'esewa' ? 'eS' : 'Kh'}
                    </div>
                    <span>{payment.paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    payment.status === 'completed' ? 'badge-success' : 
                    payment.status === 'pending' ? 'badge-warning' : 
                    'badge-destructive'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="text-muted">{payment.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentsTable;