import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const AddListingModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: 'furniture',
    deliveryZones: [],
    pricePerMonth: '',
    tenure3: true,
    tenure6: false,
    tenure12: false,
  });

  const totalSteps = 4;

  const categories = [
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'other', label: 'Other' }
  ];

  const availableTags = [
    'Eco-Friendly',
    'New',
    'Refurbished',
    'Pet-Safe',
    'Premium',
    'Budget-Friendly'
  ];

  const deliveryZoneOptions = [
    { id: 'ktm', label: 'Kathmandu Valley', value: 'ktm-valley' },
    { id: 'pokhara', label: 'Pokhara & Outskirts', value: 'pokhara-outskirts' },
    { id: 'nationwide', label: 'Nationwide', value: 'nationwide' }
  ];

  const formatNPR = (amount) => {
    return 'NPR ' + amount.toLocaleString('en-NP');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleZone = (zone) => {
    if (formData.deliveryZones.includes(zone)) {
      setFormData({
        ...formData,
        deliveryZones: formData.deliveryZones.filter(z => z !== zone)
      });
    } else {
      setFormData({
        ...formData,
        deliveryZones: [...formData.deliveryZones, zone]
      });
    }
  };

  const calculatePricing = () => {
    const basePrice = parseFloat(formData.pricePerMonth) || 0;
    return {
      price3: basePrice,
      price6: Math.round(basePrice * 0.92),
      price12: Math.round(basePrice * 0.85)
    };
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (uploadedImages.length + files.length > 5) {
      alert('Maximum 5 images allowed!');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files!');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB!');
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        setIsUploading(true);
        setUploadProgress(0);
      };
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      };

      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, e.target.result]);
        setIsUploading(false);
        setUploadProgress(0);
      };

      reader.onerror = () => {
        alert('Error reading file!');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const triggerFileInput = () => {
    document.getElementById('file-input-modal').click();
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const listingData = {
        productName: formData.productName,
        description: formData.description,
        category: formData.category,
        tags: selectedTags,
        deliveryZones: formData.deliveryZones,
        pricePerMonth: formData.pricePerMonth,
        tenureOptions: {
          threeMonths: formData.tenure3,
          sixMonths: formData.tenure6,
          twelveMonths: formData.tenure12,
        },
        images: uploadedImages,
      };

      if (onSubmit) {
        onSubmit(listingData);
      } else {
        alert('Listing created! (This is a test)');
        handleClose();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedTags([]);
    setUploadedImages([]);
    setFormData({
      productName: '',
      description: '',
      category: 'furniture',
      deliveryZones: [],
      pricePerMonth: '',
      tenure3: true,
      tenure6: false,
      tenure12: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  const pricing = calculatePricing();

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '672px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    position: 'relative'
  };

  const modalContent = (
    <div style={overlayStyle} onClick={(e) => {
      if (e.target === e.currentTarget) handleClose();
    }}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
              Add New Listing
            </h2>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '24px',
                color: '#64748b'
              }}
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'nowrap'
          }}>
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Pricing' },
              { num: 3, label: 'Images' },
              { num: 4, label: 'Review' }
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: step.num <= currentStep ? '#10B981' : '#f1f5f9',
                    color: step.num <= currentStep ? 'white' : '#64748b',
                    flexShrink: 0
                  }}>
                    {step.num}
                  </div>
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '14px',
                    fontWeight: step.num === currentStep ? '500' : '400',
                    color: step.num <= currentStep ? '#1e293b' : '#64748b',
                    whiteSpace: 'nowrap'
                  }}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div style={{
                    width: '48px',
                    height: '2px',
                    margin: '0 12px',
                    backgroundColor: step.num < currentStep ? '#10B981' : '#e2e8f0',
                    flexShrink: 0
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Leather Sofa Set"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe your product in detail..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Tags
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      type="button"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        border: selectedTags.includes(tag) ? '1px solid #10B981' : '1px solid #e2e8f0',
                        backgroundColor: selectedTags.includes(tag) ? '#10B981' : 'white',
                        color: selectedTags.includes(tag) ? 'white' : '#64748b',
                        transition: 'all 0.2s'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Delivery Zones
                </label>
                {deliveryZoneOptions.map(zone => (
                  <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                    <input
                      type="checkbox"
                      id={zone.id}
                      checked={formData.deliveryZones.includes(zone.value)}
                      onChange={() => toggleZone(zone.value)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10B981' }}
                    />
                    <label htmlFor={zone.id} style={{ fontSize: '14px', color: '#374151', cursor: 'pointer', margin: 0 }}>
                      {zone.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Base Price per Month (NPR)
                </label>
                <input
                  type="number"
                  name="pricePerMonth"
                  value={formData.pricePerMonth}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '6px' }}>
                  Tenure Options (with discounts)
                </label>
                
                {[
                  { name: 'tenure3', label: '3 Months', price: pricing.price3 },
                  { name: 'tenure6', label: '6 Months (8% off)', price: pricing.price6 },
                  { name: 'tenure12', label: '12 Months (15% off)', price: pricing.price12 }
                ].map(tenure => (
                  <div key={tenure.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        name={tenure.name}
                        id={tenure.name}
                        checked={formData[tenure.name]}
                        onChange={handleInputChange}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10B981' }}
                      />
                      <label htmlFor={tenure.name} style={{ fontSize: '14px', cursor: 'pointer', margin: 0 }}>
                        {tenure.label}
                      </label>
                    </div>
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>
                      {formatNPR(tenure.price)}/mo
                    </span>
                  </div>
                ))}
              </div>

              {formData.pricePerMonth && (formData.tenure3 || formData.tenure6 || formData.tenure12) && (
                <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontWeight: '500', margin: '0 0 12px 0', fontSize: '14px' }}>
                    Price Preview (incl. 13% VAT)
                  </h4>
                  <div style={{ fontSize: '14px' }}>
                    {formData.tenure3 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>3 Months Total:</span>
                        <span style={{ fontWeight: '500' }}>
                          {formatNPR(Math.round(pricing.price3 * 3 * 1.13))}
                        </span>
                      </div>
                    )}
                    {formData.tenure6 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>6 Months Total:</span>
                        <span style={{ fontWeight: '500' }}>
                          {formatNPR(Math.round(pricing.price6 * 6 * 1.13))}
                        </span>
                      </div>
                    )}
                    {formData.tenure12 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>12 Months Total:</span>
                        <span style={{ fontWeight: '500' }}>
                          {formatNPR(Math.round(pricing.price12 * 12 * 1.13))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '12px' }}>
                Product Images (up to 5)
              </label>

              {!isUploading && uploadedImages.length < 5 && (
                <div>
                  <input
                    type="file"
                    id="file-input-modal"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={triggerFileInput}
                    style={{
                      border: '2px dashed #e2e8f0',
                      borderRadius: '12px',
                      padding: '40px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="40" height="40" style={{ margin: '0 auto 12px', display: 'block', color: '#64748b' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p style={{ color: '#64748b', margin: '0 0 4px', fontSize: '14px' }}>
                      Click to upload images
                    </p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '12px' }}>
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}

              {isUploading && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ backgroundColor: '#e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                    <div style={{
                      backgroundColor: '#10B981',
                      height: '100%',
                      width: `${uploadProgress}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                    Uploading...
                  </p>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '20px' }}>
                  {uploadedImages.map((img, index) => (
                    <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={img} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => removeImage(index)}
                        type="button"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 5 && (
                    <div
                      onClick={triggerFileInput}
                      style={{
                        aspectRatio: '1',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="m21 15-5-5L5 21"/>
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontWeight: '600', margin: '0 0 16px 0' }}>Review Your Listing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{
                    aspectRatio: '16/9',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}>
                    {uploadedImages.length > 0 ? (
                      <img src={uploadedImages[0]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      'No image'
                    )}
                  </div>
                  <h4 style={{ fontWeight: '500', margin: '0 0 4px 0' }}>
                    {formData.productName || 'Untitled'}
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                    {formData.description || 'No description'}
                  </p>
                </div>

                <div style={{ fontSize: '14px' }}>
                  {[
                    { label: 'Category', value: formData.category },
                    { label: 'Base Price', value: formData.pricePerMonth ? formatNPR(parseFloat(formData.pricePerMonth)) + '/mo' : '-' },
                    { 
                      label: 'Tenure Options', 
                      value: [formData.tenure3 && '3', formData.tenure6 && '6', formData.tenure12 && '12']
                        .filter(Boolean).join(', ') + ([formData.tenure3, formData.tenure6, formData.tenure12].some(Boolean) ? ' months' : '-')
                    },
                    { label: 'Delivery Zones', value: formData.deliveryZones.length ? `${formData.deliveryZones.length} zones` : '-' },
                    { label: 'Tags', value: selectedTags.length ? `${selectedTags.length} tags` : '-' }
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: i < 4 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <span style={{ color: '#64748b' }}>{item.label}</span>
                      <span style={{ fontWeight: '500', textTransform: item.label === 'Category' ? 'capitalize' : 'none' }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            marginTop: '24px'
          }}>
            <button
              onClick={currentStep > 1 ? prevStep : handleClose}
              type="button"
              style={{
                padding: '10px 20px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#374151'
              }}
            >
              {currentStep > 1 ? '← Back' : 'Cancel'}
            </button>
            <button
              onClick={nextStep}
              type="button"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: '#10B981',
                color: 'white'
              }}
            >
              {currentStep === totalSteps ? 'Submit Listing' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddListingModal;