import React from 'react';
import { useState } from 'react';
import api from '../../services/api';  // ✅ Use the configured api instance

const ProfileTab = ({ seller, onUpdate, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: seller.name || '',
    phone: seller.phone || '',
    bio: seller.bio || '',
    bankName: seller.bankName || '',
    bankAccount: seller.bankAccount || ''
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dt = new Date(date);
    return dt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('💾 Saving profile...', formData);
      
      // ✅ FIXED: Use api instance instead of axios
      const response = await api.put('/seller/profile', formData);

      console.log('✅ Profile update response:', response.data);

      if (response.data.success) {
        showToast('Updated!', 'Profile saved successfully', 'success');
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      console.error('❌ Error response:', error.response?.data);
      showToast('Error', error.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: seller.name || '',
      phone: seller.phone || '',
      bio: seller.bio || '',
      bankName: seller.bankName || '',
      bankAccount: seller.bankAccount || ''
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Profile Settings</h2>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--primary)'
            }}>
              ⭐
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {seller.rating || '0.0'}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--muted-fg)' }}>
                Rating
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--chart-2)'
            }}>
              📦
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {seller.totalListings || 0}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--muted-fg)' }}>
                Listings
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon" style={{
              background: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--warning)'
            }}>
              🛒
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                {seller.totalRentals || 0}
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--muted-fg)' }}>
                Rentals
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Personal Info
        </h3>

        <div className="profile-header-section">
          <div className="profile-avatar">
            <div className="avatar">
              <img 
                src={seller.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.name || 'User')} 
                alt={seller.name || 'User'} 
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              {seller.name || 'No name'}
            </div>
            <div style={{ color: 'var(--muted-fg)', fontSize: '.875rem' }}>
              {seller.email || 'No email'}
            </div>
            <div style={{
              color: 'var(--muted-fg)',
              fontSize: '.75rem',
              marginTop: '.25rem'
            }}>
              Member since {formatDate(seller.createdAt)}
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <div style={{ color: 'var(--muted-fg)', fontSize: '.875rem' }}>
                Phone
              </div>
              <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                {seller.phone || 'Not provided'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted-fg)', fontSize: '.875rem' }}>
                Email
              </div>
              <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                {seller.email || 'Not provided'}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: 'var(--muted-fg)', fontSize: '.875rem' }}>
                Bio
              </div>
              <div style={{ marginTop: '.25rem' }}>
                {seller.bio || 'No bio added yet'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Payout Settings
        </h3>

        {isEditing ? (
          <div className="form-grid">
            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
              />
            </div>
            <div className="form-group">
              <label>Account</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="Enter account number"
              />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div>
              <div style={{ color: 'var(--muted-fg)', fontSize: '.875rem' }}>
                Bank Name
              </div>
              <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                {seller.bankName || 'Not provided'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted-fg)', fontSize: '.875rem' }}>
                Account
              </div>
              <div style={{ fontWeight: 600, marginTop: '.25rem' }}>
                {seller.bankAccount || 'Not provided'}
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditing && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '.75rem',
          marginTop: '1.5rem'
        }}>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;