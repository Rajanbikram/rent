import React, { useState } from 'react';
import { useRental } from '../../contexts/RentalContext';

const SearchFilters = () => {
  const { fetchProducts } = useRental();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    location: 'all',
    minPrice: '',
    maxPrice: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (f) => {
    const params = {};
    if (f.search) params.search = f.search;
    if (f.category !== 'all') params.category = f.category;
    if (f.location !== 'all') params.location = f.location;
    if (f.minPrice) params.minPrice = f.minPrice;
    if (f.maxPrice) params.maxPrice = f.maxPrice;
    fetchProducts(params);
  };

  const handlePriceChange = (value) => {
    if (value === 'all') {
      handleFilterChange('minPrice', '');
      handleFilterChange('maxPrice', '');
    } else {
      const [min, max] = value.split('-');
      setFilters({ ...filters, minPrice: min, maxPrice: max });
      applyFilters({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          className="input"
          placeholder="Search furniture, appliances..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>
      <div className="filter-row">
        <select className="input select filter-select" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
          <option value="all">All Categories</option>
          <option value="furniture">Furniture</option>
          <option value="appliances">Appliances</option>
        </select>
        <select className="input select filter-select" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
          <option value="all">All Locations</option>
          <option value="kathmandu">Kathmandu</option>
          <option value="pokhara">Pokhara</option>
        </select>
        <select className="input select filter-select" onChange={(e) => handlePriceChange(e.target.value)}>
          <option value="all">Any Price</option>
          <option value="0-1000">₹0 - ₹1,000</option>
          <option value="1000-2000">₹1,000 - ₹2,000</option>
          <option value="2000-3000">₹2,000 - ₹3,000</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;