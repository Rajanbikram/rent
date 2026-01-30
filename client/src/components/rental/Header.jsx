import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRental } from '../../contexts/RentalContext';

const Header = ({ onCartOpen }) => {
  const { cart } = useRental();
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <>
      <style jsx>{`
        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background-color: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }

        .btn-logout svg {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 768px) {
          .header-actions {
            gap: 0.5rem;
          }
          
          .btn-logout {
            padding: 0.5rem;
            font-size: 0;
          }
          
          .btn-logout svg {
            margin: 0;
          }
        }
      `}</style>
      
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>RentEasy<span>Nepal</span></h1>
              <p>Furniture & Appliances on Rent</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn btn-outline btn-icon cart-btn" onClick={onCartOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span className="cart-count">{cartCount}</span>
            </button>
            
            <button className="btn btn-logout" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;