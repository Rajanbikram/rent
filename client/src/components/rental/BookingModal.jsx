import React, { useState } from 'react';
import { useRental } from '../../contexts/RentalContext';
import { authService } from '../../services/authService';

const BookingModal = ({ product, isOpen, onClose, showToast }) => {
  const { createRental } = useRental();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    tenure: 3,
    address: { fullName: '', phone: '', street: '', city: '', state: '', pincode: '' },
    paymentMethod: 'esewa',
    studentDiscount: false
  });

  const stepIcons = {
    1: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    2: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    3: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    4: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
    5: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  };

  const handleNext = () => {
    if (step === 3 && !validateAddress()) {
      showToast('Error', 'Please fill all address fields', 'error');
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateAddress = () => {
    const { fullName, phone, street, city, state, pincode } = bookingData.address;
    return fullName && phone && street && city && state && pincode;
  };

  const handleSubmit = async () => {
    if (!authService.isAuthenticated()) {
      showToast('Error', 'Please login to complete booking', 'error');
      return;
    }

    const success = await createRental({
      productId: product.id,
      tenure: bookingData.tenure,
      address: bookingData.address,
      paymentMethod: bookingData.paymentMethod
    });

    if (success) {
      showToast('Booking successful!', 'Your rental has been confirmed.');
      onClose();
      setStep(1);
    } else {
      showToast('Error', 'Failed to create booking. Please try again.', 'error');
    }
  };

  if (!product || !isOpen) return null;

  const calculateTotal = () => {
    let total = product.pricePerMonth * bookingData.tenure;
    if (bookingData.studentDiscount) total *= 0.9;
    return total;
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Your Rental</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Steps */}
          <div className="booking-steps">
            {[1,2,3,4,5].map((s, idx) => (
              <div key={s} className="booking-step">
                <div className={`booking-step-dot ${step >= s ? 'completed' : ''} ${step === s ? 'current' : ''}`} dangerouslySetInnerHTML={{__html: stepIcons[s]}} />
                {idx < 4 && <div className={`booking-step-line ${step > s ? 'completed' : ''}`}></div>}
              </div>
            ))}
          </div>

          <div className="booking-content">
            {/* Step 1: Product Summary */}
            {step === 1 && (
              <>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>Selected Product</h3>
                <div className="booking-product-summary">
                  <div className="booking-product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="booking-product-info">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <span className="price">₹{product.pricePerMonth.toLocaleString('en-IN')}/month</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Tenure Selection */}
            {step === 2 && (
              <>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>Select Rental Duration</h3>
                <div className="tenure-options">
                  {[3, 6, 12].map(m => (
                    <div key={m} className={`tenure-option ${bookingData.tenure === m ? 'selected' : ''}`} onClick={() => setBookingData({...bookingData, tenure: m})}>
                      <span className="months">{m}</span>
                      <span className="label">months</span>
                      <span className="total">₹{(product.pricePerMonth * m).toLocaleString('en-IN')}</span>
                      {m === 12 && <span className="best-value">Best Value!</span>}
                    </div>
                  ))}
                </div>
                <div className="student-discount" style={{marginTop: '1.5rem'}}>
                  <div className="student-discount-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    Student Discount (10% off)
                  </div>
                  {bookingData.studentDiscount ? (
                    <div className="promo-success">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      Student discount applied!
                    </div>
                  ) : (
                    <button className="btn btn-outline btn-sm" style={{width: '100%'}} onClick={() => setBookingData({...bookingData, studentDiscount: true})}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" x2="12" y1="3" y2="15"/>
                      </svg>
                      Upload Student ID
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Address */}
            {step === 3 && (
              <>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>Delivery Address</h3>
                <div className="form-grid">
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input className="input" value={bookingData.address.fullName} onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, fullName: e.target.value}})} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="input" value={bookingData.address.phone} onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, phone: e.target.value}})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input className="input" value={bookingData.address.street} onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, street: e.target.value}})} />
                  </div>
                  <div className="form-row two-col">
                    <div className="form-group">
                      <label>City</label>
                      <input className="input" value={bookingData.address.city} onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, city: e.target.value}})} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input className="input" value={bookingData.address.state} onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, state: e.target.value}})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input className="input" value={bookingData.address.pincode} onChange={(e) => setBookingData({...bookingData, address: {...bookingData.address, pincode: e.target.value}})} />
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>Payment Method</h3>
                <div className="payment-options">
                  {[
                    { id: 'esewa', name: 'eSewa', desc: 'Pay securely with eSewa' },
                    { id: 'khalti', name: 'Khalti', desc: 'Pay using Khalti wallet' },
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when product is delivered' }
                  ].map(method => (
                    <div key={method.id} className={`payment-option ${bookingData.paymentMethod === method.id ? 'selected' : ''}`} onClick={() => setBookingData({...bookingData, paymentMethod: method.id})}>
                      <input type="radio" checked={bookingData.paymentMethod === method.id} readOnly />
                      <div className="payment-option-info">
                        <div className="name">{method.name}</div>
                        <div className="desc">{method.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <>
                <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>Confirm Your Order</h3>
                <div className="order-summary">
                  <div className="order-summary-product">
                    <div className="order-summary-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="order-summary-info">
                      <h4>{product.name}</h4>
                      <p>{bookingData.tenure} months rental</p>
                    </div>
                  </div>
                  <hr />
                  <div className="order-summary-row">
                    <span>Monthly Rent</span>
                    <span>₹{product.pricePerMonth.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Duration</span>
                    <span>{bookingData.tenure} months</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Subtotal</span>
                    <span>₹{(product.pricePerMonth * bookingData.tenure).toLocaleString('en-IN')}</span>
                  </div>
                  {bookingData.studentDiscount && (
                    <div className="order-summary-row discount">
                      <span>Student Discount (10%)</span>
                      <span>-₹{(product.pricePerMonth * bookingData.tenure * 0.1).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="order-summary-row total">
                    <span>Total Amount</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-address">
                    <h5>Delivery Address</h5>
                    <p>{bookingData.address.fullName}</p>
                    <p>{bookingData.address.street}, {bookingData.address.city}</p>
                    <p>{bookingData.address.state} - {bookingData.address.pincode}</p>
                    <p>Phone: {bookingData.address.phone}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handlePrev}>Previous</button>
          )}
          {step < 5 ? (
            <button className="btn btn-primary" onClick={handleNext}>Next</button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>Confirm Booking</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;