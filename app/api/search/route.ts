import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseIntent, rankOffers } from "@/lib/openai";
import { searchProducts } from "@/lib/productSearch";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const intent = await parseIntent(query);
    const rawOffers = await searchProducts(intent);
    const rankedOffers = await rankOffers(intent, rawOffers);

    const search = await prisma.search.create({
      data: {
        query,
        product: intent.product,
        filters: JSON.stringify(intent),
        offers: {
          create: rankedOffers.slice(0, 10).map((offer) => ({
            title: offer.title,
            price: offer.price,
            store: offer.store,
            url: offer.url,
            image: offer.image,
            rating: offer.rating,
            reviews: offer.reviews,
            aiScore: offer.aiScore,
            reason: offer.reason,
          })),
        },
      },
    });

    return NextResponse.json({ searchId: search.id, intent, offers: rankedOffers.slice(0, 10) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
