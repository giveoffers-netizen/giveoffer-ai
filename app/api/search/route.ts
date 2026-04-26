import { NextRequest, NextResponse } from "next/server";

type Offer = {
  title: string;
  price: string;
  store: string;
  url: string;
  image: string;
  rating: number | null;
  reviews: number | null;
  delivery: string;
  reason: string;
};

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing search query" }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing SERPAPI_KEY in Vercel Environment Variables" },
        { status: 500 }
      );
    }

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_shopping");
    url.searchParams.set("q", query);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("gl", "us");
    url.searchParams.set("hl", "en");

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    const data = await response.json();

    const offers: Offer[] = (data.shopping_results || [])
      .slice(0, 12)
      .map((item: any) => ({
        title: item.title || "Untitled product",
        price: item.price || "Price not shown",
        store: item.source || "Unknown store",
        url: item.link || item.product_link || "#",
        image: item.thumbnail || "",
        rating: item.rating || null,
        reviews: item.reviews || null,
        delivery: item.delivery || "",
        reason: makeReason(item),
      }));

    return NextResponse.json({
      query,
      offers,
    });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

function makeReason(item: any) {
  const parts = [];

  if (item.price) parts.push(`Listed at ${item.price}`);
  if (item.rating) parts.push(`rated ${item.rating}/5`);
  if (item.reviews) parts.push(`${item.reviews} reviews`);
  if (item.delivery) parts.push(item.delivery);

  return parts.length
    ? parts.join(" • ")
    : "Matched your product search.";
}
