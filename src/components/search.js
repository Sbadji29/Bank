import React, { useState } from 'react';
import '../styles/search.css'; 

function Search({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    console.log("Recherche soumise :", query);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}

export default Search;
