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

    if (file.type === "application/pdf") {
      const pdf = await pdfParse(buffer);
      extractedText = pdf.text;
    } else if (file.type.startsWith("image/")) {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: "Missing OPENAI_API_KEY" },
          { status: 500 }
        );
      }

      const base64 = buffer.toString("base64");

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Read this bill, invoice, quote, or receipt image. Extract all visible text clearly.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${file.type};base64,${base64}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      const data = await openaiRes.json();
      extractedText =
        data.choices?.[0]?.message?.content || "No text found in image.";
    } else {
      extractedText = "Unsupported file type.";
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      extractedText: extractedText.slice(0, 6000),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
