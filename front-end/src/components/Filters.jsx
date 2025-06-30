// src/components/Filters.js
import React, { useState } from 'react';

const Filters = ({ onApply }) => {
  const [country, setCountry] = useState('');
  const [cost, setCost] = useState('');
  const [cuisines, setCuisines] = useState('');

  const applyFilters = () => {
    onApply({
      ...(country && { country }),
      ...(cost && { cost }),
      ...(cuisines && { cuisines }),
    });
  };

  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
      <input
        type="text"
        placeholder="Country code (e.g., IN)"
        className="form-control"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ maxWidth: 200 }}
      />

      <input
        type="number"
        placeholder="Max Avg Cost for 2"
        className="form-control"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        style={{ maxWidth: 200 }}
      />

      <input
        type="text"
        placeholder="Cuisines (e.g., Italian)"
        className="form-control"
        value={cuisines}
        onChange={(e) => setCuisines(e.target.value)}
        style={{ maxWidth: 200 }}
      />

      <button onClick={applyFilters} className="btn btn-outline-dark">
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
