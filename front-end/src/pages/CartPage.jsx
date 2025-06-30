// src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (cartItems.length === 0) {
    return <div className="container my-5 text-center">🛒 Your cart is empty.</div>;
  }

  return (
    <div className="container my-5">
      <h3 className="mb-4">🛍️ Cart</h3>
      <ul className="list-group mb-3">
        {cartItems.map((item, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </li>
        ))}
      </ul>
      <h5 className="text-end">Total: ₹{total}</h5>
      <button onClick={clearCart} className="btn btn-danger mt-3">Clear Cart</button>
    </div>
  );
};

export default CartPage;
