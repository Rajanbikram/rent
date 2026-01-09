import React from 'react';
import { useState } from 'react';
import api from '../../services/api';
import ListingCard from './ListingCard';

const ListingTab = ({ listings, searchQuery, onToggleStatus, showToast }) => {
  console.log('🔍 ListingTab received listings:', listings);
  console.log('📊 Listings count:', listings?.length || 0);
  
  // ✅ FIXED: Only show 'active' status listings (remove paused ones)
  const activeListings = listings.filter(l => l.status === 'active');
  
  console.log('✅ Active listings after filter:', activeListings.length);
  
  const filteredListings = activeListings.filter(listing => {
    const query = searchQuery.toLowerCase();
    return listing.title?.toLowerCase().includes(query) ||
           listing.description?.toLowerCase().includes(query);
  });

  console.log('🔎 Filtered listings:', filteredListings.length);

  const handleToggleStatus = async (listingId) => {
    try {
      console.log('🔄 Toggling status for listing ID:', listingId);
      
      const response = await api.put(`/seller/listings/${listingId}/toggle-status`);

      console.log('✅ Toggle response:', response.data);

      if (response.data.success) {
        showToast(
          response.data.data.status === 'active' ? 'Activated' : 'Paused',
          response.data.message,
          'success'
        );
        onToggleStatus(); // This will refresh and hide paused listing
      }
    } catch (error) {
      console.error('❌ Toggle status error:', error);
      console.error('Error response:', error.response?.data);
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