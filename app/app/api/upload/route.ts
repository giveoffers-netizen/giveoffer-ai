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
      extractedText = "Image uploaded successfully. OCR/AI reading will be added next.";
    } else {
      extractedText = "File uploaded, but this file type is not supported yet.";
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      extractedText: extractedText.slice(0, 3000),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
