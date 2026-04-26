import OpenAI from "openai";
import { ProductIntent, Offer } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseIntent(query: string): Promise<ProductIntent> {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Extract product search intent as JSON only. Query: ${query}`,
  });

  try {
    const text = response.output_text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    return {
      product: parsed.product || query,
      maxPrice: parsed.maxPrice,
      minPrice: parsed.minPrice,
      brand: parsed.brand,
      category: parsed.category,
      mustHave: parsed.mustHave || [],
      sortGoal: parsed.sortGoal || "best_value",
    };
  } catch {
    return { product: query, sortGoal: "best_value", mustHave: [] };
  }
}

export async function rankOffers(intent: ProductIntent, offers: Offer[]): Promise<Offer[]> {
  if (!offers.length) return [];

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Rank these offers for the user's goal. Return JSON array with original index, aiScore 0-100, and reason. Intent: ${JSON.stringify(intent)} Offers: ${JSON.stringify(offers.slice(0, 12))}`,
  });

  try {
    const ranked = JSON.parse(response.output_text.replace(/```json|```/g, "").trim());
    return offers
      .map((offer, index) => {
        const match = ranked.find((r: any) => r.index === index);
        return { ...offer, aiScore: match?.aiScore ?? 50, reason: match?.reason ?? "Relevant offer." };
      })
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  } catch {
    return offers.map((offer, index) => ({ ...offer, aiScore: 100 - index * 5 }));
  }
}
