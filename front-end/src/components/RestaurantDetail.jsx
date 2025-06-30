import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const RestaurantDetail = () => {
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error("❌ Failed to fetch details", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center my-5">Loading restaurant details...</div>;
  if (!restaurant) return <div className="text-center my-5 text-danger">Restaurant not found.</div>;

  const {
    restaurantId,
    name,
    countryCode,
    city,
    address,
    locality,
    averageCostForTwo,
    currency,
    hasTableBooking,
    hasOnlineDelivery,
    isDeliveringNow,
    switchToOrderMenu,
    priceRange,
    aggregateRating,
    ratingText,
    votes,
    cuisines
  } = restaurant;

  // Convert cuisines into menu-style items
  const cuisinesList = cuisines
    ? cuisines.split(',').map((c, index) => ({
        id: index + 1,
        name: c.trim(),
        price: Math.floor(Math.random() * 400 + 200), // Fake price for now
      }))
    : [];

  return (
    <div className="container my-5">
      <Link to="/restaurants" className="btn btn-outline-secondary mb-4">← Back to Restaurants</Link>

      <div className="card shadow-lg border-0 p-4 bg-light">
        <div className="row g-4">
          <div className="col-md-5">
            <img
              src={`https://source.unsplash.com/600x400/?restaurant,dining`}
              alt={name}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-7 d-flex flex-column justify-content-between">
            <div>
              <h2 className="fw-bold">{name}</h2>
              <p className="text-muted">{locality}, {city}</p>
              <p><strong>Address:</strong> {address}</p>
              <p className="fs-5">
                ⭐ {aggregateRating} <span className="text-muted">({votes} votes)</span>
              </p>
              <p><strong>Avg Cost for Two:</strong> {currency} {averageCostForTwo}</p>
              <p><strong>Table Booking:</strong> {hasTableBooking}</p>
              <p><strong>Online Delivery:</strong> {hasOnlineDelivery}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-5 border-0 shadow-sm p-4">
        <h4 className="mb-4 fw-semibold">🍽️ Cuisines as Menu</h4>
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {cuisinesList.map((item) => (
            <div key={item.id} className="col">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text mb-3 text-muted">{currency} {item.price}</p>
                  <button
                    onClick={() => addToCart({ ...item, restaurantName: name }, restaurantId)}
                    className="btn btn-outline-success mt-auto fw-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="alert alert-info mt-4">
          🛒 You have {cart.length} item{cart.length > 1 ? 's' : ''} in your cart.
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
