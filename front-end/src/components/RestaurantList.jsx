// used infinte scroll pagination , next button button is working as expected , cross checked with network tab

import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import { FaUpload } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [image, setImage] = useState(null);
  const [predictedLabels, setPredictedLabels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const fetchRestaurants = async (overrideFilters = filters, reset = false) => {
    try {
      setLoading(true);
      const queryParams = { ...overrideFilters };
      if (!reset && cursor) queryParams.lastId = cursor;

      const query = new URLSearchParams(queryParams).toString();
      const url = `http://localhost:5000/api/restaurants?${query}`;

      const res = await axios.get(url);
      const newRestaurants = res.data.restaurants || [];

      if (reset) {
        setRestaurants(newRestaurants);
      } else {
        setRestaurants(prev => [...prev, ...newRestaurants]);
      }

      setCursor(res.data.nextCursor || null);
      setHasMore(Boolean(res.data.nextCursor));
      setError('');
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearby = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`http://localhost:5000/api/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=30`);
          const data = await res.json();
          setRestaurants(Array.isArray(data.restaurants) ? data.restaurants : data || []);
          setCursor(null);
          setFilters({});
        } catch (err) {
          console.error('Failed to fetch nearby restaurants', err);
        }
      }, () => {
        alert('Location access denied or unavailable.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleImageSearch = async () => {
    if (!image) return alert("Please select an image.");
    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/restaurants/search/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      setRestaurants(res.data.restaurants || []);
      setPredictedLabels(res.data.predicted || []);
      setCursor(null);
      setFilters({});
    } catch (err) {
      console.error("Image search failed:", err);
      setError("Image search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/restaurants/search/text?q=${encodeURIComponent(searchQuery)}`);
      setRestaurants(res.data.results || []);
      setPredictedLabels([]);
      setCursor(null);
      setFilters({});
    } catch (err) {
      setError("Failed to perform text search.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(filters, true);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchRestaurants();
    }
  }, [inView]);

  return (
    <>
      <Filters onApply={(newFilters) => {
        setCursor(null);
        setFilters(newFilters);
        fetchRestaurants(newFilters, true);
      }} />

      {Object.keys(filters).length > 0 && (
        <button
          className="btn btn-warning mb-3"
          onClick={() => {
            setFilters({});
            setCursor(null);
            fetchRestaurants({}, true);
          }}
        >
          Clear Filters
        </button>
      )}

      <div className="container my-4">
        <h2 className="text-center mb-4">Explore Restaurants</h2>

        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 300 }}
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleTextSearch} className="btn btn-info">Search</button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchRestaurants({}, true);
              }}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          )}
          <button onClick={handleFindNearby} className="btn btn-primary">Show Nearby</button>
          <label htmlFor="imageUpload" className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <FaUpload /> Upload Food Image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {image && (
            <button onClick={handleImageSearch} className="btn btn-success">
              Search by Image
            </button>
          )}
        </div>

        {predictedLabels.length > 0 && (
          <div className="mb-3">
            <strong>Detected Cuisine:</strong> {predictedLabels.join(", ")}
          </div>
        )}

        {loading && <p className="text-center">Loading restaurants...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && restaurants.length === 0 && !error && (
          <p className="text-center text-muted">No restaurants found.</p>
        )}

        <div className="row">
          {restaurants.map((rest) => (
            <div key={rest._id || rest.restaurantId} className="col-sm-6 col-md-4 mb-4">
              <RestaurantCard restaurant={rest} />
            </div>
          ))}
        </div>

        {/* Infinite Scroll Observer */}
        <div ref={ref} className="text-center my-4">
          {hasMore && !loading && <span>Loading more...</span>}
        </div>
      </div>
    </>
  );
};

export default RestaurantList;
