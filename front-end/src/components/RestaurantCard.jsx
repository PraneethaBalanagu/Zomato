import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const stylishImages = [
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1541542684-4bdb6b6d040c?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1555992336-03a23c59b07b?auto=format&fit=crop&w=800&q=60',
];

const fallback = stylishImages[Math.floor(Math.random() * stylishImages.length)];

const RestaurantCard = ({ restaurant }) => {
  const imageUrl =
    restaurant?.image_url?.trim() !== '' && restaurant?.image_url?.startsWith('http')
      ? restaurant.image_url
      : fallback;

  return (
    <div className="card restaurant-card shadow-sm h-100 border-0">
      <img
        src={imageUrl}
        alt={restaurant.name || 'Restaurant'}
        className="card-img-top"
        style={{ height: '180px', objectFit: 'cover' }}
        onError={(e) => {
          console.warn('Image load failed, using fallback');
          e.target.src = fallback;
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{restaurant.name}</h5>
        <p className="card-text text-muted mb-1">{restaurant.city}</p>
        <p className="card-text mb-1">₹{restaurant.averageCostForTwo} for two</p>
        {restaurant.aggregateRating && (
          <div className="mb-3">
            <span className="badge bg-success text-white px-2 py-1 rounded-pill">
              ⭐ {restaurant.aggregateRating}
            </span>
          </div>
        )}

        <Link
          to={`/restaurant/${restaurant._id || restaurant.id}`}
          className="btn btn-danger mt-auto fw-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
