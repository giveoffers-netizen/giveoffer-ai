'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data.offers || []);
    setLoading(false);
  };

  return (
    <main style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>GiveOffer AI</h1>
      <p>Find the best product offers instantly.</p>

      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product..."
          style={{ padding: 12, width: 300, marginRight: 10 }}
        />
        <button style={{ padding: 12 }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div style={{ marginTop: 30 }}>
        {results.map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <h3>{item.title}</h3>
            <p>{item.price} - {item.store}</p>
            <a href={item.url} target="_blank">View Offer</a>
            <p>{item.reason}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
