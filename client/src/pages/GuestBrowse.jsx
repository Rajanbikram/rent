import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import DealsCarousel from '../components/DealsCarousel';
import Toast from '../components/Toast';
import { productAPI, dealAPI } from '../services/api';
import '../styles/globals.css';

const GuestBrowse = () => {
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCategory: 'all',
    minPrice: 500,
    maxPrice: 4000,
    tenure: '3',
    location: 'all'
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, allProducts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, dealsRes] = await Promise.all([
        productAPI.getAll(),
        dealAPI.getAll()
      ]);

      setAllProducts(productsRes.data.data);
      setProducts(productsRes.data.data);
      setDeals(dealsRes.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      showToast('Error', 'Failed to load products and deals');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.selectedCategory !== 'all') {
      filtered = filtered.filter(p =>
        p.category.toLowerCase() === filters.selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(p => p.location === filters.location);
    }

    // Apply tenure discount
    if (filters.tenure !== '3') {
      const tenureMonths = parseInt(filters.tenure);
      let discount = 0;
      if (tenureMonths === 6) discount = 0.05;
      if (tenureMonths === 12) discount = 0.10;

      filtered = filtered.map(product => ({
        ...product,
        originalPrice: product.price,
        price: (product.price * (1 - discount)).toFixed(2),
        tenureDiscount: (discount * 100).toFixed(0) + '%'
      }));
    }

    setProducts(filtered);
  };

  const handleSearch = (query) => {
    setFilters({ ...filters, searchQuery: query });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const showToast = (title, description) => {
    const id = Date.now();
    setToasts([...toasts, { id, title, description }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'all',
      minPrice: 500,
      maxPrice: 4000,
      tenure: '3',
      location: 'all'
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        showToast={showToast}
        products={allProducts}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      {/* Sidebar */}
      <Sidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        showToast={showToast}
      />

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <div className="container-custom">
          {/* Deals Section */}
          <section id="deals" className="mb-8">
            <h2 className="section-title">Top Deals</h2>
            <p className="section-subtitle">Exclusive offers just for you</p>
            <DealsCarousel 
              deals={deals} 
              showToast={showToast}
              onLoginClick={handleLoginClick}
            />
          </section>

          {/* Products Section */}
          <section className="mt-8">
            <div className="results-header">
              <div>
                <h2 className="section-title">Available Rentals</h2>
                <p className="section-subtitle">
                  {products.length} items available in Nepal
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showToast={showToast}
                    onLoginClick={handleLoginClick}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p className="no-results-text">
                  No items found matching your criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-clear-filters"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h3 className="cta-title">❤️ Found Something You Love?</h3>
            <p className="cta-text">
              Login now to save items, add to cart, and unlock exclusive member discounts!
            </p>
            <button
              onClick={handleLoginClick}
              className="btn-cta"
            >
              Login to Save & Book
            </button>
          </section>
        </div>
      </main>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GuestBrowse;