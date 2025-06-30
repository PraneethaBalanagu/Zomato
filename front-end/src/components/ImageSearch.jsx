import React, { useState } from 'react';
import axios from 'axios';

const ImageSearch = () => {
  const [file, setFile] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    const res = await axios.post('http://localhost:5000/api/image-search', formData);
    setLabel(res.data.label);
    setRestaurants(res.data.matches);
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <h3>📷 Upload a Food Image</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn btn-primary mt-3" onClick={handleUpload}>Search</button>

      {loading && <p className="mt-3">🔍 Searching...</p>}

      {label && (
        <div className="mt-4">
          <h5>Detected food: <strong>{label}</strong></h5>
          <h6>Restaurants offering this cuisine:</h6>
          <ul className="list-group">
            {restaurants.map((r) => (
              <li key={r._id} className="list-group-item">
                <strong>{r.name}</strong> - {r.cuisines}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
