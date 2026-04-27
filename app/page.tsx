'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const searchProducts = async (searchQuery: string, pageNumber: number) => {
    if (!searchQuery.trim()) return;

    setLoading(true);

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery, page: pageNumber }),
    });

    const data = await res.json();

    setResults(data.offers || []);
    setLastQuery(searchQuery);
    setPage(pageNumber);
    setLoading(false);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    searchProducts(query, 1);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.extractedText) {
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.extractedText }),
      });

      const analyzeData = await analyzeRes.json();

      setUploadResult({
        ...data,
        analysis: analyzeData.analysis,
      });
    } else {
      setUploadResult(data);
    }

    setUploading(false);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.badge}>AI Quote Comparison</div>

        <h1 style={styles.logo}>Upload any quote. Find a better offer.</h1>

        <p style={styles.subtitle}>
          Upload a bill, quote, invoice, or search products directly.
        </p>

        <div style={styles.uploadBox}>
          <h2 style={styles.uploadTitle}>Upload Quote</h2>
          <p style={styles.uploadText}>PDF, invoice, screenshot, or quote file</p>

          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleUpload}
            style={styles.fileInput}
          />

          {uploading && <p style={styles.status}>Reading and analyzing your quote...</p>}

          {uploadResult && (
            <div style={styles.resultBox}>
              <strong>File:</strong> {uploadResult.fileName}
              <br />
              <strong>Status:</strong> Uploaded successfully
              <br />
              <br />

              {uploadResult.analysis && (
                <div>
                  <h3>AI Found These Items</h3>

                  <p><strong>Vendor:</strong> {uploadResult.analysis.vendor || 'Not found'}</p>
                  <p><strong>Total:</strong> {uploadResult.analysis.total || 'Not found'}</p>

                  {(uploadResult.analysis.items || []).map((item: any, index: number) => (
                    <div key={index} style={styles.itemBox}>
                      <strong>{item.name}</strong>
                      <p>Quantity: {item.quantity || 'N/A'}</p>
                      <p>Price: {item.price || 'N/A'}</p>

                      <button
                        style={styles.button}
                        onClick={() => searchProducts(item.searchQuery || item.name, 1)}
                      >
                        Find Better Price
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <br />
              <strong>Extracted Text:</strong>
              <pre style={styles.pre}>
                {uploadResult.extractedText || uploadResult.error}
              </pre>
            </div>
          )}
        </div>

        <form onSubmit={handleSearch} style={styles.searchBox}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Or search products, brands, or deals..."
            style={styles.input}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? 'Searching...' : 'Search Offers'}
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
              <p style={styles.store}>{item.store}</p>
              <h3 style={styles.title}>{item.title}</h3>
              <p style={styles.price}>{item.price}</p>
              <p style={styles.reason}>{item.reason}</p>

              <a href={item.url} target="_blank" style={styles.link}>
                View Offer
              </a>
            </div>
          </div>
        ))}
      </section>

      {results.length > 0 && (
        <div style={styles.pagination}>
          <button
            onClick={() => searchProducts(lastQuery || query, page - 1)}
            disabled={page <= 1 || loading}
            style={styles.pageButton}
          >
            Previous
          </button>

          <span style={styles.pageText}>Page {page}</span>

          <button
            onClick={() => searchProducts(lastQuery || query, page + 1)}
            disabled={loading}
            style={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: '100vh',
    background: '#f7f3ec',
    fontFamily: 'Arial, sans-serif',
    color: '#1f2933',
  },
  hero: {
    maxWidth: 950,
    margin: '0 auto',
    padding: '70px 24px 55px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '10px 18px',
    borderRadius: 999,
    background: '#efe2d0',
    color: '#9a6b43',
    fontWeight: 700,
    marginBottom: 18,
  },
  logo: {
    fontSize: 52,
    lineHeight: 1.05,
    margin: '0 0 18px',
  },
  subtitle: {
    fontSize: 21,
    color: '#5f6c7b',
    marginBottom: 34,
  },
  uploadBox: {
    background: '#fff',
    borderRadius: 24,
    padding: 30,
    marginBottom: 30,
    boxShadow: '0 18px 45px rgba(55, 39, 24, 0.10)',
    border: '1px solid #eadfd2',
  },
  uploadTitle: {
    margin: 0,
    fontSize: 26,
  },
  uploadText: {
    color: '#667085',
  },
  fileInput: {
    marginTop: 16,
    padding: 16,
    border: '1px dashed #9a6b43',
    borderRadius: 14,
    background: '#fbf8f3',
    width: '100%',
    maxWidth: 520,
  },
  status: {
    color: '#9a6b43',
    fontWeight: 700,
  },
  resultBox: {
    marginTop: 20,
    textAlign: 'left',
    background: '#fbf8f3',
    borderRadius: 16,
    padding: 20,
  },
  itemBox: {
    marginTop: 16,
    padding: 16,
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #eadfd2',
  },
  pre: {
    whiteSpace: 'pre-wrap',
    fontSize: 13,
    maxHeight: 260,
    overflow: 'auto',
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  input: {
    width: 520,
    maxWidth: '100%',
    padding: '18px 20px',
    borderRadius: 14,
    border: '1px solid #ded2c4',
    fontSize: 16,
    background: '#fff',
  },
  button: {
    padding: '18px 28px',
    borderRadius: 14,
    border: 'none',
    background: '#9a6b43',
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
  },
  grid: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 32px 50px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 26,
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 18px 45px rgba(55, 39, 24, 0.10)',
    border: '1px solid #eadfd2',
  },
  image: {
    width: '100%',
    height: 220,
    objectFit: 'contain',
    background: '#fbf8f3',
    padding: 18,
  },
  cardBody: {
    padding: 22,
  },
  store: {
    color: '#9a6b43',
    fontWeight: 700,
  },
  title: {
    fontSize: 18,
    lineHeight: 1.35,
  },
  price: {
    fontSize: 24,
    fontWeight: 900,
    color: '#16803c',
  },
  reason: {
    color: '#667085',
    fontSize: 14,
  },
  link: {
    display: 'inline-block',
    marginTop: 14,
    padding: '13px 18px',
    background: '#1f2933',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 800,
  },
  pagination: {
    padding: '0 0 60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  pageButton: {
    padding: '14px 22px',
    borderRadius: 12,
    border: 'none',
    background: '#9a6b43',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  },
  pageText: {
    fontWeight: 800,
  },
};
