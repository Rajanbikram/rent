import React, { useState } from 'react';
import { useRental } from '../../contexts/RentalContext';

const Cart = ({ isOpen, onClose, onCheckout, showToast }) => {
  const { cart, updateCartItem, removeFromCart } = useRental();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [studentDiscount, setStudentDiscount] = useState(false);

  const promoCodes = { 'NEWYEAR25': 25, 'FIRST10': 10, 'STUDENT15': 15, 'NEPAL20': 20 };

  const handleQuantity = async (item, change) => {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      await removeFromCart(item.id);
    } else {
      await updateCartItem(item.id, { quantity: newQty });
    }
  };

  const handleTenureChange = async (item, tenure) => {
    await updateCartItem(item.id, { tenure: parseInt(tenure) });
  };

  const applyPromo = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setAppliedDiscount(promoCodes[code]);
      showToast('Promo applied!', `${promoCodes[code]}% discount applied.`);
    } else {
      showToast('Invalid code', 'Please check the code and try again.', 'error');
    }
  };

  const applyStudentDiscount = () => {
    setStudentDiscount(true);
    showToast('Student ID verified!', '10% student discount applied.');
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.pricePerMonth * item.tenure * item.quantity), 0);
    let discount = subtotal * (appliedDiscount / 100);
    if (studentDiscount) discount += subtotal * 0.1;
    return { subtotal, discount, total: subtotal - discount };
  };

  const { subtotal, discount, total } = calculateTotals();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'show' : ''}`}>
        <div className="cart-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Your Cart (<span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>)
          </h2>
          <button className="cart-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <h3>Your cart is empty</h3>
            <p>Browse our products and add items to your cart.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-content">
                    <div className="cart-item-image">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h4>{item.product.name}</h4>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                      <div className="cart-item-tenure">
                        <select className="input select" value={item.tenure} onChange={(e) => handleTenureChange(item, e.target.value)}>
                          <option value="3">3 months</option>
                          <option value="6">6 months</option>
                          <option value="12">12 months</option>
                        </select>
                      </div>
                      <div className="cart-item-footer">
                        <div className="quantity-controls">
                          <button className="quantity-btn" onClick={() => handleQuantity(item, -1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"/>
                            </svg>
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button className="quantity-btn" onClick={() => handleQuantity(item, 1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"/>
                              <path d="M12 5v14"/>
                            </svg>
                          </button>
                        </div>
                        <span className="cart-item-price">₹{(item.product.pricePerMonth * item.tenure * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-promo">
              <div className="promo-input-group">
                <div className="promo-input-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
                    <path d="M7 7h.01"/>
                  </svg>
                  <input type="text" className="input" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                </div>
                <button className="btn btn-secondary" onClick={applyPromo}>Apply</button>
              </div>
              {appliedDiscount > 0 && (
                <div className="promo-success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {appliedDiscount}% promo discount applied!
                </div>
              )}
              <div className="student-discount">
                <div className="student-discount-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  Student Discount (10%)
                </div>
                {studentDiscount ? (
                  <div className="promo-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Student ID verified!
                  </div>
                ) : (
                  <button className="btn btn-outline btn-sm" style={{width: '100%'}} onClick={applyStudentDiscount}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" x2="12" y1="3" y2="15"/>
                    </svg>
                    Upload Student ID
                  </button>
                )}
              </div>
            </div>

            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="cart-total-row savings">
                  <span>Savings</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="cart-total-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <button className="btn btn-primary cart-checkout-btn" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;