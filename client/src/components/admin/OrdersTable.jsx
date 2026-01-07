import React from 'react';

function OrdersTable({ orders, filter }) {
  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

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
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="font-mono text-sm">{order.id}</td>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{order.listingTitle}</span>
                    <span className="user-email">by {order.seller}</span>
                  </div>
                </td>
                <td className="text-muted">{order.renter}</td>
                <td>
                  <div className="user-cell">
                    <span>{order.startDate}</span>
                    <span className="user-email">to {order.endDate}</span>
                  </div>
                </td>
                <td className="font-bold">Rs. {order.totalAmount.toLocaleString()}</td>
                <td>
                  <div className="payment-badge">
                    <div className={`payment-icon ${order.paymentMethod}`}>
                      {order.paymentMethod === 'esewa' ? 'eS' : 'Kh'}
                    </div>
                    <span>{order.paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    order.status === 'completed' ? 'badge-success' :
                    order.status === 'active' ? 'badge-primary' :
                    order.status === 'pending' ? 'badge-warning' : 
                    'badge-destructive'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;