import { ProductIntent, Offer } from "./types";

export async function searchProducts(intent: ProductIntent): Promise<Offer[]> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) return demoOffers(intent.product);

  const q = [intent.brand, intent.product, intent.maxPrice ? `under $${intent.maxPrice}` : ""].filter(Boolean).join(" ");
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", q);
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Product search failed");
  const data = await res.json();

  return (data.shopping_results || []).slice(0, 20).map((item: any) => ({
    title: item.title,
    price: parsePrice(item.price),
    store: item.source,
    url: item.link || item.product_link,
    image: item.thumbnail,
    rating: item.rating,
    reviews: item.reviews,
    shipping: item.delivery,
  })).filter((o: Offer) => o.title && o.url);
}

function parsePrice(price?: string): number | undefined {
  if (!price) return undefined;
  const n = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function demoOffers(product: string): Offer[] {
  return [
    { title: `Best Value ${product}`, price: 14.99, store: "Demo Store", url: "#", rating: 4.7, reviews: 1200, reason: "Demo result" },
    { title: `Cheapest ${product}`, price: 8.99, store: "Demo Market", url: "#", rating: 4.2, reviews: 430, reason: "Demo result" },
    { title: `Premium ${product}`, price: 19.99, store: "Demo Direct", url: "#", rating: 4.9, reviews: 980, reason: "Demo result" }
  ];
}
