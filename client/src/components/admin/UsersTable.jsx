import React from 'react';

function UsersTable({ users, onBanUser, search }) {
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Student</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-outline'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="text-muted">{user.joinDate}</td>
                <td>
                  <div className="stars">
                    <svg viewBox="0 0 24 24" fill={user.rating >= 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={`star ${user.rating >= 1 ? 'filled' : ''}`}>
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    <span className={user.rating < 3 ? 'text-destructive' : ''}>{user.rating}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-destructive'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.isStudentVerified ? <span className="badge badge-success">Verified</span> : ''}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost btn-icon" title="View Logs">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-icon" title="Edit Role">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </button>
                  {user.role === 'seller' && user.rating < 3 && (
                    <button 
                      className="btn btn-ghost btn-icon text-destructive" 
                      title="Ban User" 
                      onClick={() => onBanUser(user)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m4.9 4.9 14.2 14.2"/>
                      </svg>
                    </button>
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

export default UsersTable;