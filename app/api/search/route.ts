import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = "";

    // ✅ PDF
    if (file.type === "application/pdf") {
      const pdf = await pdfParse(buffer);
      extractedText = pdf.text;
    }

    // ✅ IMAGE (NEW 🔥)
    else if (file.type.startsWith("image/")) {
      const base64 = buffer.toString("base64");

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Extract all text from this invoice or quote clearly." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${file.type};base64,${base64}`
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await res.json();
      extractedText = data.choices?.[0]?.message?.content || "No text found";
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      extractedText: extractedText.slice(0, 3000),
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
