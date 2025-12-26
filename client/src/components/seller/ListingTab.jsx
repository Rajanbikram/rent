import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import ListingCard from './ListingCard';

const ListingTab = ({ listings, searchQuery, onToggleStatus, showToast }) => {
  const activeListings = listings.filter(l => l.status === 'active' || l.status === 'paused');
  
  const filteredListings = activeListings.filter(listing => {
    const query = searchQuery.toLowerCase();
    return listing.title.toLowerCase().includes(query) ||
           listing.description.toLowerCase().includes(query);
  });

  const handleToggleStatus = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/seller/listings/${listingId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showToast(
          response.data.data.status === 'active' ? 'Activated' : 'Paused',
          response.data.message,
          'success'
        );
        onToggleStatus();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      showToast('Error', 'Failed to update listing status', 'error');
    }
  };

  const handleEdit = (listingId) => {
    showToast('Edit', 'Coming soon', 'success');
  };

  const handleShare = (listingId) => {
    const url = `https://renteasy.com/listing/${listingId}`;
    navigator.clipboard.writeText(url);
    showToast('Copied!', 'Link copied to clipboard', 'success');
  };

  return (
    <div>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Active Listings</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', marginTop: '.5rem' }}>
          {activeListings.length} active listing(s)
        </p>
      </div>

      {filteredListings.length > 0 ? (
        <div className="listings-grid">
          {filteredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '.5rem' }}>
            No listings found
          </p>
          <p>{searchQuery ? 'Try adjusting your search' : 'Add your first listing'}</p>
        </div>
      )}
    </div>
  );
};

export default ListingTab;