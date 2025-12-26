import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ 
  filters, 
  onFilterChange, 
  isOpen, 
  onToggle,
  showToast 
}) => {
  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, selectedCategory: category });
  };

  const handleLocationChange = (location) => {
    onFilterChange({ ...filters, location });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: parseInt(value)
    });
  };

  const handleTenureChange = (e) => {
    onFilterChange({ ...filters, tenure: e.target.value });
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        className="sidebar-toggle-btn"
      >
        ☰ Filters
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`}>
        {/* Category Filter */}
        <div className="filter-section">
          <h3 className="filter-title">Category</h3>
          <button
            onClick={() => handleCategoryChange('all')}
            className={`filter-btn ${filters.selectedCategory === 'all' ? 'filter-btn-active' : ''}`}
          >
            All Items
          </button>
          <button
            onClick={() => handleCategoryChange('furniture')}
            className={`filter-btn ${filters.selectedCategory === 'furniture' ? 'filter-btn-active' : ''}`}
          >
            🛋️ Furniture
          </button>
          <button
            onClick={() => handleCategoryChange('appliances')}
            className={`filter-btn ${filters.selectedCategory === 'appliances' ? 'filter-btn-active' : ''}`}
          >
            ❄️ Appliances
          </button>
        </div>

        {/* Price Range */}
        <div className="filter-section mt-4">
          <h3 className="filter-title">Price Range</h3>
          <input
            type="range"
            min="500"
            max="4000"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="price-range-slider"
          />
          <input
            type="range"
            min="500"
            max="4000"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="price-range-slider"
          />
          <div className="price-labels">
            <span>Rs. {filters.minPrice}</span>
            <span>Rs. {filters.maxPrice}</span>
          </div>
        </div>

        {/* Rental Duration */}
        <div className="filter-section mt-4">
          <h3 className="filter-title">Rental Duration</h3>
          <select
            value={filters.tenure}
            onChange={handleTenureChange}
            className="tenure-select"
          >
            <option value="3">3 Months</option>
            <option value="6">6 Months (5% Off)</option>
            <option value="12">12 Months (10% Off)</option>
          </select>
          <p className="tenure-hint">
            Prices adjust based on rental duration
          </p>
        </div>

        {/* Location Filter */}
        <div className="filter-section mt-4">
          <h3 className="filter-title">Location</h3>
          <button
            onClick={() => handleLocationChange('all')}
            className={`filter-btn ${filters.location === 'all' ? 'filter-btn-active' : ''}`}
          >
            All Nepal
          </button>
          <button
            onClick={() => handleLocationChange('Kathmandu')}
            className={`filter-btn ${filters.location === 'Kathmandu' ? 'filter-btn-active' : ''}`}
          >
            🏔️ Kathmandu
          </button>
          <button
            onClick={() => handleLocationChange('Pokhara')}
            className={`filter-btn ${filters.location === 'Pokhara' ? 'filter-btn-active' : ''}`}
          >
            ⛰️ Pokhara
          </button>
        </div>

        {/* Login Teaser */}
        <div className="login-teaser-box">
          🔓 More Filters Available<br/>
          Login to access advanced search options
        </div>
      </aside>
    </>
  );
};

export default Sidebar;