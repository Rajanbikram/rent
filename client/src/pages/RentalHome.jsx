import React, { useState } from 'react';
import { useRental } from '../contexts/RentalContext';
import Header from '../components/rental/Header';
import Hero from '../components/rental/Hero';
import SearchFilters from '../components/rental/SearchFilters';
import ActiveRentals from '../components/rental/ActiveRentals';
import ProductGrid from '../components/rental/ProductGrid';
import Cart from '../components/rental/Cart';
import CompareDrawer from '../components/rental/CompareDrawer';
import ProductModal from '../components/rental/ProductModal';
import BookingModal from '../components/rental/BookingModal';
import { ToastContainer } from '../components/rental/Toast';
import '../styles/rental.css';

const RentalHome = () => {
  const { cart } = useRental();  // ✅ Get cart from context
  const [cartOpen, setCartOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  const showToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, title, message, type }]);
  };
  
  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };
  
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };
  
  const handleBookNow = (product) => {
    setProductModalOpen(false);
    setSelectedProduct(product);
    setBookingModalOpen(true);
  };
  
  // ✅ FIXED: Handle cart checkout properly
  const handleCheckout = () => {
    // Check if cart is empty
    if (cart.length === 0) {
      showToast('Error', 'Your cart is empty', 'error');
      return;
    }
    
    // For now, use first item from cart
    // Later you can handle multiple items differently
    const firstItem = cart[0];
    
    // Create a product object from cart item
    const productForBooking = {
      id: firstItem.productId,
      name: firstItem.product?.title || firstItem.product?.name || 'Product',
      description: firstItem.product?.description || '',
      pricePerMonth: firstItem.product?.pricePerMonth || firstItem.product?.price || 0,
      image: firstItem.product?.images?.[0] || firstItem.product?.image || '/placeholder.png',
      // Pass cart item data
      cartItemId: firstItem.id,
      tenure: firstItem.tenure,
      quantity: firstItem.quantity
    };
    
    console.log('🛒 Checkout with product:', productForBooking);
    
    setSelectedProduct(productForBooking);
    setCartOpen(false);
    setBookingModalOpen(true);
  };
  
  return (
    <div className="rental-home">
      <Header onCartOpen={() => setCartOpen(true)} />
      
      <main>
        <div className="container">
          <Hero />
          <SearchFilters />
          <ActiveRentals showToast={showToast} />
          <ProductGrid onViewDetails={handleViewDetails} showToast={showToast} />
        </div>
      </main>
      
      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onCheckout={handleCheckout}
        showToast={showToast}
      />
      
      <CompareDrawer showToast={showToast} />
      
      <ProductModal 
        product={selectedProduct}
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onBookNow={handleBookNow}
        showToast={showToast}
      />
      
      <BookingModal 
        product={selectedProduct}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        showToast={showToast}
      />
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default RentalHome;