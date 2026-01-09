import React, { createContext, useContext, useState, useEffect } from 'react';
import { rentalAPI } from '../services/api';
import { authService } from '../services/authService';

const RentalContext = createContext();

export const useRental = () => useContext(RentalContext);

export const RentalProvider = ({ children, showToast }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    fetchProducts();
    if (authService.isAuthenticated() && authService.isRenter()) {
      fetchCart();
      fetchFavorites();
      fetchRentals();
    }
  }, []);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('📦 Fetching products with filters:', filters);
      
      const response = await rentalAPI.getProducts(filters);
      console.log('📦 API Response:', response.data);
      
      // ✅ FIXED: Handle both response formats
      if (response.data.success) {
        // New format: { success: true, data: [...] }
        setProducts(response.data.data || []);
        console.log('✅ Products loaded:', response.data.data?.length || 0);
      } else if (Array.isArray(response.data)) {
        // Old format: [...]
        setProducts(response.data);
        console.log('✅ Products loaded:', response.data.length);
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      console.error('❌ Error response:', error.response?.data);
      setProducts([]);
      if (showToast) {
        showToast('Error', 'Failed to load products', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await rentalAPI.getCart();
      console.log('🛒 Cart response:', response.data);
      
      // Handle response format
      if (response.data.success) {
        setCart(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setCart(response.data);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      // Don't show error toast for cart - user might not be logged in
      setCart([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await rentalAPI.getFavorites();
      console.log('❤️ Favorites response:', response.data);
      
      // Handle response format
      let favoritesData = [];
      if (response.data.success) {
        favoritesData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        favoritesData = response.data;
      }
      
      setFavorites(favoritesData.map(f => f.productId || f.id));
    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
      setFavorites([]);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await rentalAPI.getRentals();
      console.log('📋 Rentals response:', response.data);
      
      // Handle response format
      if (response.data.success) {
        setRentals(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setRentals(response.data);
      } else {
        setRentals([]);
      }
    } catch (error) {
      console.error('❌ Error fetching rentals:', error);
      setRentals([]);
    }
  };

  const addToCart = async (productId, quantity = 1, tenure = 3) => {
    try {
      // Check authentication and role
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      console.log('🛒 Add to cart attempt:', { token: !!token, userRole, productId });
      
      if (!token) {
        if (showToast) showToast('Please login', 'You need to login to add items to cart', 'error');
        return false;
      }
      
      if (userRole !== 'renter') {
        if (showToast) showToast('Access denied', 'Only renters can add items to cart', 'error');
        return false;
      }
      
      console.log('🛒 Adding to cart:', { productId, quantity, tenure });
      
      await rentalAPI.addToCart({ productId, quantity, tenure });
      await fetchCart();
      
      console.log('✅ Added to cart successfully');
      if (showToast) showToast('Added to cart', 'Product added successfully', 'success');
      return true;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Better error handling
      if (error.response?.status === 401) {
        if (showToast) showToast('Session expired', 'Please login again', 'error');
      } else if (error.response?.status === 403) {
        if (showToast) showToast('Access denied', error.response?.data?.message || 'Only renters can add to cart', 'error');
      } else {
        if (showToast) showToast('Error', error.response?.data?.message || 'Failed to add to cart', 'error');
      }
      
      return false;
    }
  };

  const updateCartItem = async (id, data) => {
    try {
      await rentalAPI.updateCartItem(id, data);
      await fetchCart();
      if (showToast) showToast('Updated', 'Cart item updated', 'success');
    } catch (error) {
      console.error('Error updating cart:', error);
      if (showToast) showToast('Error', 'Failed to update cart item', 'error');
    }
  };

  const removeFromCart = async (id) => {
    try {
      await rentalAPI.removeFromCart(id);
      await fetchCart();
      if (showToast) showToast('Removed', 'Item removed from cart', 'success');
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (showToast) showToast('Error', 'Failed to remove item', 'error');
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      const { data } = await rentalAPI.toggleFavorite(productId);
      
      // Handle response format
      const isFavorite = data.success ? data.data?.isFavorite : data.isFavorite;
      
      if (isFavorite) {
        setFavorites([...favorites, productId]);
        if (showToast) showToast('Added to favorites', 'Product added to your favorites', 'success');
      } else {
        setFavorites(favorites.filter(id => id !== productId));
        if (showToast) showToast('Removed from favorites', 'Product removed from favorites', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (showToast) showToast('Error', 'Failed to update favorites', 'error');
    }
  };

  const toggleCompare = (product) => {
    const exists = compareList.find(p => p.id === product.id);
    if (exists) {
      setCompareList(compareList.filter(p => p.id !== product.id));
      if (showToast) showToast('Removed', 'Product removed from comparison', 'success');
    } else if (compareList.length < 3) {
      setCompareList([...compareList, product]);
      if (showToast) showToast('Added', 'Product added to comparison', 'success');
    } else {
      if (showToast) showToast('Limit reached', 'You can compare up to 3 products', 'error');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    if (showToast) showToast('Cleared', 'Comparison list cleared', 'success');
  };

  const createRental = async (data) => {
    try {
      await rentalAPI.createRental(data);
      await fetchRentals();
      await fetchCart();
      if (showToast) showToast('Booking successful', 'Your rental has been confirmed', 'success');
      return true;
    } catch (error) {
      console.error('Error creating rental:', error);
      if (showToast) showToast('Error', 'Failed to create booking', 'error');
      return false;
    }
  };

  const renewRental = async (id) => {
    try {
      await rentalAPI.renewRental(id);
      await fetchRentals();
      if (showToast) showToast('Renewal requested', 'Your rental renewal request has been submitted', 'success');
      return true;
    } catch (error) {
      console.error('Error renewing rental:', error);
      if (showToast) showToast('Error', 'Failed to renew rental', 'error');
      return false;
    }
  };

  const value = {
    products, 
    cart, 
    favorites, 
    rentals, 
    compareList, 
    loading, 
    user,
    fetchProducts, 
    addToCart, 
    updateCartItem, 
    removeFromCart,
    toggleFavorite, 
    toggleCompare, 
    clearCompare,
    createRental, 
    renewRental, 
    setUser
  };

  return <RentalContext.Provider value={value}>{children}</RentalContext.Provider>;
};