import React from 'react';

function ListingsTable({ listings, onApprove, onReject, filter }) {
  const filteredListings = listings.filter(l => filter === 'all' || l.status === filter);

  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Listing</th>
              <th>Seller</th>
              <th>Category</th>
              <th>Price/Day</th>
              <th>Created</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map(listing => (
              <tr key={listing.id}>
                <td className="font-bold">{listing.title}</td>
                <td className="text-muted">{listing.seller}</td>
                <td><span className="badge badge-outline">{listing.category}</span></td>
                <td className="font-bold">Rs. {listing.pricePerDay}</td>
                <td className="text-muted">{listing.createdAt}</td>
                <td>
                  <span className={`badge ${
                    listing.status === 'approved' ? 'badge-success' : 
                    listing.status === 'rejected' ? 'badge-destructive' : 
                    'badge-warning'
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost btn-icon" title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  {listing.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-ghost btn-icon text-success" 
                        title="Approve" 
                        onClick={() => onApprove(listing)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                      <button 
                        className="btn btn-ghost btn-icon text-destructive" 
                        title="Reject" 
                        onClick={() => onReject(listing)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6 6 18"/>
                          <path d="m6 6 12 12"/>
                        </svg>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListingsTable;