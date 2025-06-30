import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import { FaUpload } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [image, setImage] = useState(null);
  const [predictedLabels, setPredictedLabels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRestaurants = async (filtersOverride = filters, pageNum = 1) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ ...filtersOverride, page: pageNum }).toString();
      const res = await axios.get(`http://localhost:5000/api/restaurants?${query}`);
      if (Array.isArray(res.data)) {
        setRestaurants(res.data);
        setTotalPages(1);
        setPage(1);
      } else {
        setRestaurants(res.data.restaurants || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.currentPage || 1);
      }
      setFilters(filtersOverride);
      setError('');
    } catch (err) {
      setError('❌ Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const res = await axios.get(`http://localhost:5000/api/restaurants?page=${nextPage}`);
      const data = res.data;
      setRestaurants(prev => [...prev, ...(data.restaurants || [])]);
      setPage(data.currentPage || nextPage);
      setTotalPages(data.totalPages || totalPages);
    } catch (err) {
      console.error("Load more failed", err);
    }
  };

  const handleFindNearby = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`http://localhost:5000/api/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=3`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setRestaurants(data);
          } else if (Array.isArray(data.restaurants)) {
            setRestaurants(data.restaurants);
          } else {
            setRestaurants([]);
          }
        } catch (err) {
          console.error('Failed to fetch nearby restaurants', err);
        }
      }, (error) => {
        alert('Location access denied or unavailable.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageSearch = async () => {
    if (!image) return alert("Please select an image.");
    const formData = new FormData();
    formData.append("image", image);
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/restaurants/search/image", formData);
      setRestaurants(res.data.restaurants || []);
      setPredictedLabels(res.data.predicted || []);
      setTotalPages(1);
      setPage(1);
      setFilters({});
    } catch (err) {
      console.error("Image search failed:", err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
     <>
    <Filters onApply={(newFilters) => fetchRestaurants(newFilters)} />
    {Object.keys(filters).length > 0 && (
      <button
        className="btn btn-warning"
        onClick={() => {
          setFilters({});
          fetchRestaurants({});
        }}
      >
        Clear Filters
      </button>
    )}
  

    <div className="container my-5">
      <h2 className="text-center mb-4">Explore Restaurants</h2>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
            <input
      type="text"
      placeholder="Search by name or description..."
      className="form-control"
      style={{ maxWidth: 300 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button
        onClick={async () => {
          if (!searchQuery.trim()) return;
          try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/restaurants/search/text?q=${encodeURIComponent(searchQuery)}`);
            setRestaurants(res.data.results || []);
            setTotalPages(1);
            setPage(1);
            setFilters({});
            setPredictedLabels([]);
          } catch (err) {
            setError("❌ Failed to perform text search.");
          } finally {
            setLoading(false);
          }
        }}
        className="btn btn-info"
            >
          Search
        </button>
        {searchQuery && (
    <button
      onClick={() => {
        setSearchQuery('');
        fetchRestaurants();
      }}
      className="btn btn-secondary"
    >
      Clear Search
    </button>
  )}

        <button onClick={handleFindNearby} className="btn btn-primary">
          Show Nearby (3km)
        </button>

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
        <p className="text-center text-muted">No restaurants found with the selected filters.</p>
      )}

      <div className="row">
        {restaurants.map((rest) => (
          <div key={rest._id || rest.restaurantId} className="col-sm-6 col-md-4 mb-4">
            <RestaurantCard restaurant={rest} />
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => fetchRestaurants(filters, page - 1)}
          >
            Prev
          </button>
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="btn btn-outline-primary"
            disabled={page === totalPages}
            onClick={() => fetchRestaurants(filters, page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default RestaurantList;
