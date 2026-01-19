import React, { useState } from 'react';

function UsersTable({ data, onBan, onDelete, onRoleChange, type = 'all' }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (item) => {
    if (type === 'sellers' || item.type === 'seller') {
      return item.isActive !== undefined ? (
        <span className={`badge ${item.isActive ? 'badge-success' : 'badge-error'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ) : (
        <span className="badge badge-secondary">Unknown</span>
      );
    } else {
      return (
        <span className="badge badge-primary">
          {item.role || item.status || 'Active'}
        </span>
      );
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'badge-error',
      seller: 'badge-warning',
      renter: 'badge-primary'
    };
    return (
      <span className={`badge ${roleColors[role] || 'badge-secondary'}`}>
        {role || 'N/A'}
      </span>
    );
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              {type === 'all' && <th>Role/Status</th>}
              {(type === 'sellers' || type === 'all') && <th>Stats</th>}
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {(item.name || item.fullName || 'U')[0].toUpperCase()}
                      </div>
                      <span className="user-name">
                        {item.name || item.fullName || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`badge ${item.type === 'seller' ? 'badge-warning' : 'badge-primary'}`}>
                      {item.type === 'seller' ? 'Seller' : 'User'}
                    </span>
                  </td>
                  {type === 'all' && (
                    <td>
                      {item.type === 'seller' 
                        ? getStatusBadge(item)
                        : getRoleBadge(item.role)
                      }
                    </td>
                  )}
                  {(type === 'sellers' || type === 'all') && (
                    <td>
                      {item.type === 'seller' ? (
                        <div className="seller-stats">
                          <div className="stat-item">
                            <span className="stat-label">Listings:</span>
                            <span className="stat-value">{item.totalListings || 0}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Rentals:</span>
                            <span className="stat-value">{item.totalRentals || 0}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  )}
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{getStatusBadge(item)}</td>
                  <td>
                    <div className="action-buttons">
                      {/* Activate/Deactivate - only for sellers */}
                      {item.type === 'seller' && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => onBan(item)}
                        >
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}

                      {/* Change Role - only for users (not sellers, not admins) */}
                      {item.type === 'user' && item.role !== 'admin' && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onRoleChange(item)}
                        >
                          Change Role
                        </button>
                      )}

                      {/* Delete - for everyone except admins */}
                      {item.role !== 'admin' && (
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => onDelete(item)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={type === 'all' ? 8 : 7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: hsl(214, 32%, 98%);
        }

        .data-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: hsl(215, 16%, 47%);
          border-bottom: 1px solid hsl(214, 32%, 91%);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid hsl(214, 32%, 91%);
          font-size: 0.875rem;
        }

        .data-table tbody tr:hover {
          background: hsl(214, 32%, 99%);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: hsl(211, 100%, 50%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-name {
          font-weight: 500;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge-primary {
          background: hsl(211, 100%, 95%);
          color: hsl(211, 100%, 50%);
        }

        .badge-success {
          background: hsl(142, 76%, 95%);
          color: hsl(142, 76%, 36%);
        }

        .badge-warning {
          background: hsl(38, 92%, 95%);
          color: hsl(38, 92%, 50%);
        }

        .badge-error {
          background: hsl(0, 84%, 95%);
          color: hsl(0, 84%, 60%);
        }

        .badge-secondary {
          background: hsl(215, 16%, 95%);
          color: hsl(215, 16%, 47%);
        }

        .seller-stats {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-item {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .stat-label {
          color: hsl(215, 16%, 47%);
        }

        .stat-value {
          font-weight: 600;
        }

        .text-muted {
          color: hsl(215, 16%, 67%);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .btn-sm {
          padding: 0.375rem 0.875rem;
          font-size: 0.8125rem;
        }

        .btn-primary {
          background: hsl(211, 100%, 50%);
          color: white;
        }

        .btn-primary:hover {
          background: hsl(211, 100%, 45%);
        }

        .btn-warning {
          background: hsl(38, 92%, 50%);
          color: white;
        }

        .btn-warning:hover {
          background: hsl(38, 92%, 45%);
        }

        .btn-error {
          background: hsl(0, 84%, 60%);
          color: white;
        }

        .btn-error:hover {
          background: hsl(0, 84%, 55%);
        }
      `}</style>
    </div>
  );
}

export default UsersTable;