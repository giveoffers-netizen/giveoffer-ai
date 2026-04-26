"use client";

import { useState } from "react";
import type { Offer, ProductIntent } from "@/lib/types";

export default function SearchForm() {
  const [query, setQuery] = useState("best green tea under $20");
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [intent, setIntent] = useState<ProductIntent | null>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOffers([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setIntent(data.intent);
      setOffers(data.offers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="searchBox" onSubmit={submit}>
        <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any product..." />
        <button className="button" disabled={loading}>{loading ? "Searching..." : "Find Offers"}</button>
      </form>

      {error && <p className="error">{error}</p>}
      {intent && <p className="meta" style={{ textAlign: "center", marginTop: 18 }}>AI searched for: <b>{intent.product}</b></p>}

      <div className="grid">
        {offers.map((offer, i) => (
          <div className="card" key={`${offer.title}-${i}`}>
            {i === 0 && <span className="badge">Best Overall</span>}
            {offer.image && <img src={offer.image} alt={offer.title} />}
            <h3>{offer.title}</h3>
            <div className="price">{offer.price ? `$${offer.price.toFixed(2)}` : "See price"}</div>
            <div className="meta">{offer.store || "Store"} · {offer.rating ? `⭐ ${offer.rating}` : "No rating"} {offer.reviews ? `(${offer.reviews})` : ""}</div>
            {offer.reason && <p>{offer.reason}</p>}
            <a className="offerLink" href={offer.url} target="_blank">View Offer</a>
          </div>
        ))}
      </div>
    </>
  );
}
