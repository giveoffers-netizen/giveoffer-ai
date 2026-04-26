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
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.logo}>GiveOffer AI</h1>
        <p style={styles.subtitle}>Find the best product offers instantly.</p>

        <form onSubmit={handleSearch} style={styles.searchBox}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product..."
            style={styles.input}
          />
          <button style={styles.button}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      <section style={styles.grid}>
        {results.map((item, i) => (
          <div key={i} style={styles.card}>
            {item.image && (
              <img src={item.image} alt={item.title} style={styles.image} />
            )}

            <div style={styles.cardBody}>
              <h3 style={styles.title}>{item.title}</h3>

              <p style={styles.price}>{item.price}</p>

              <p style={styles.store}>{item.store}</p>

              <p style={styles.reason}>{item.reason}</p>

              <a href={item.url} target="_blank" style={styles.link}>
                View Offer →
              </a>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eef4ff, #f8fafc)',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    color: '#0f172a',
  },
  hero: {
    maxWidth: '900px',
    margin: '0 auto 40px auto',
    textAlign: 'center',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '10px',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: '20px',
    color: '#475569',
    marginBottom: '30px',
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  input: {
    width: '420px',
    maxWidth: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  button: {
    padding: '16px 26px',
    borderRadius: '12px',
    border: 'none',
    background: '#2563eb',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.10)',
    border: '1px solid #e2e8f0',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    background: '#f8fafc',
    padding: '16px',
  },
  cardBody: {
    padding: '20px',
  },
  title: {
    fontSize: '18px',
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  price: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: '6px',
  },
  store: {
    color: '#475569',
    marginBottom: '12px',
  },
  reason: {
    fontSize: '14px',
    color: '#64748b',
    minHeight: '40px',
  },
  link: {
    display: 'inline-block',
    marginTop: '14px',
    padding: '12px 16px',
    background: '#0f172a',
    color: 'white',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};
