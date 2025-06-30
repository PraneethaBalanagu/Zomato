// src/context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, restId) => {
    if (restaurantId && restaurantId !== restId) {
      alert("❌ You can only add items from one restaurant at a time!");
      return;
    }
    setCartItems(prev => [...prev, item]);
    setRestaurantId(restId);
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
