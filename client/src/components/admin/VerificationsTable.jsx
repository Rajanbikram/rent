import React from 'react';

function VerificationsTable({ verifications, onApprove, onReject }) {
  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>University</th>
              <th>Submitted</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map(v => (
              <tr key={v.id}>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{v.userName}</span>
                    <span className="user-email">ID: {v.userId}</span>
                  </div>
                </td>
                <td className="font-mono">{v.studentId}</td>
                <td>{v.university}</td>
                <td className="text-muted">{v.submittedAt}</td>
                <td>
                  <span className={`badge ${
                    v.status === 'approved' ? 'badge-success' : 
                    v.status === 'rejected' ? 'badge-destructive' : 
                    'badge-warning'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost btn-icon" title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  {v.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-ghost btn-icon text-success" 
                        title="Approve" 
                        onClick={() => onApprove(v)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                      <button 
                        className="btn btn-ghost btn-icon text-destructive" 
                        title="Reject" 
                        onClick={() => onReject(v)}
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

export default VerificationsTable;