import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || "";

    return NextResponse.json({
      query,
      offers: [
        {
          title: `Sample offer for ${query}`,
          price: "$19.99",
          store: "Demo Store",
          url: "https://giveoffer.com",
          image: "",
          rating: 4.8,
          reason: "Demo result while setup is being completed."
        }
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
