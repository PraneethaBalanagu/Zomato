import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // ✅

const Navbar = () => {
  const { cartItems } = useContext(CartContext); // ✅

  return (
    <nav
      className="navbar navbar-expand-lg px-3 py-0 shadow-sm"
      style={{
        background: 'linear-gradient(to right,rgb(247, 218, 218),rgb(246, 207, 207))',
        borderBottom: 'white',
        fontFamily: "'Poppins', sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontWeight: 400,
            fontSize: '1.5rem',
            color: '#e23744',
            textDecoration: 'none',
            letterSpacing: '0.5px',
          }}
        >
          zomato
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link to="/restaurants" className="btn btn-sm" style={{ color: '#8b1f27', fontWeight: 500 }}>
            Explore
          </Link>

          <Link to="/cart" className="btn position-relative btn-sm" style={{ color: '#8b1f27', fontWeight: 500 }}>
            🛒
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItems.length}
              </span>
            )}
          </Link>

          <Link to="/login" className="btn btn-outline-danger btn-sm rounded-pill fw-semibold">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-danger btn-sm rounded-pill text-white fw-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
