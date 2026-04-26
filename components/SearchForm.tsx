'use client';

import { useState } from 'react';

export default function SearchForm() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Search: " + query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />
      <button type="submit" style={{ padding: '10px' }}>
        Search
      </button>
    </form>
  );
}
