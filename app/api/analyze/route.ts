import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You extract products from quotes, invoices, bills, and receipts. Return only valid JSON.",
          },
          {
            role: "user",
            content: `
Extract products/services from this quote text.

Return JSON only in this format:
{
  "vendor": "vendor name if found",
  "total": "total price if found",
  "items": [
    {
      "name": "product or service name",
      "quantity": "quantity if found",
      "price": "price if found",
      "searchQuery": "short Google Shopping search query"
    }
  ]
}

Text:
${text}
`,
          },
        ],
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { raw: content };
    }

    return NextResponse.json({
      success: true,
      analysis: parsed,
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Analyze failed" }, { status: 500 });
  }
}
