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
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You extract products and services from quotes, invoices, bills, and receipts. Return only valid JSON.",
          },
          {
            role: "user",
            content: `
Extract products/services from this text.

For products: create a shopping search query.
For services/bills: create a search query to find cheaper alternative plans/providers.

Examples:
Cable TV Service -> cheaper cable TV service plans
Phone Service -> cheaper phone service plans
Internet Service -> cheaper internet plans
Window quote -> bifold window better price
Door quote -> interior door better price

Return JSON only in this exact format:
{
  "vendor": "vendor name if found",
  "total": "total price if found",
  "items": [
    {
      "name": "product or service name",
      "quantity": "quantity if found",
      "price": "price if found",
      "searchQuery": "best search query to find a better price or cheaper alternative"
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

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || "OpenAI request failed" },
        { status: 500 }
      );
    }

    const content = data.choices?.[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        vendor: "",
        total: "",
        items: [],
        raw: content,
      };
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
