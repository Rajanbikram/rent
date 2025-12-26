import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const MessagesTab = ({ messages, onReply, onMarkRead, showToast }) => {
  const [expandedMessages, setExpandedMessages] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});

  const formatRelativeTime = (date) => {
    const dt = new Date(date);
    const now = new Date();
    const diff = now - dt;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const toggleMessage = async (messageId) => {
    setExpandedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );

    const message = messages.find(m => m.id === messageId);
    if (message && !message.isRead) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `/api/seller/messages/${messageId}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onMarkRead();
      } catch (error) {
        console.error('Mark read error:', error);
      }
    }
  };

  const handleReply = async (messageId) => {
    const replyText = replyTexts[messageId]?.trim();
    if (!replyText) {
      showToast('Error', 'Please enter a response', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/seller/messages/${messageId}/reply`,
        { response: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showToast('Reply Sent!', 'Response sent to renter', 'success');
        setReplyTexts(prev => ({ ...prev, [messageId]: '' }));
        onReply();
      }
    } catch (error) {
      console.error('Reply error:', error);
      showToast('Error', 'Failed to send reply', 'error');
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Renter Messages</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
          {unreadCount} unread
        </p>
      </div>

      {messages.length > 0 ? (
        <div className="message-accordion">
          {messages.map(message => (
            <div key={message.id} className="message-item fade-in">
              <div className="message-header" onClick={() => toggleMessage(message.id)}>
                <div className="avatar">
                  {message.renterAvatar ? (
                    <img src={message.renterAvatar} alt={message.renterName} />
                  ) : (
                    message.renterName.charAt(0)
                  )}
                </div>

                <div className="message-info">
                  <div className="message-name">
                    {message.renterName}
                    {!message.isRead && <span className="new-badge">New</span>}
                    {message.response && <span className="replied-badge">✓ Replied</span>}
                  </div>
                  <div className="message-subject">
                    Re: {message.listing?.title || 'Listing'}
                  </div>
                </div>

                <div className="message-time">
                  {formatRelativeTime(message.createdAt)}
                </div>
              </div>

              <div
                className={`message-content ${expandedMessages.includes(message.id) ? 'expanded' : ''}`}
              >
                <div className="message-body">
                  <div className="message-query">
                    <p style={{ fontSize: '.875rem' }}>{message.query}</p>
                    <p style={{ fontSize: '.75rem', color: 'var(--muted-fg)', marginTop: '.5rem' }}>
                      From: {message.renterEmail}
                    </p>
                  </div>

                  {message.response ? (
                    <div className="message-response">
                      <p style={{
                        fontSize: '.875rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        marginBottom: '.5rem'
                      }}>
                        Your Response:
                      </p>
                      <p style={{ fontSize: '.875rem' }}>{message.response}</p>
                    </div>
                  ) : (
                    <div className="reply-form">
                      <textarea
                        placeholder="Type your response..."
                        rows="3"
                        value={replyTexts[message.id] || ''}
                        onChange={(e) => setReplyTexts(prev => ({
                          ...prev,
                          [message.id]: e.target.value
                        }))}
                      />
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '.75rem'
                      }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleReply(message.id)}
                        >
                          📤 Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p style={{ fontWeight: 600 }}>No messages yet</p>
        </div>
      )}
    </div>
  );
};

export default MessagesTab;