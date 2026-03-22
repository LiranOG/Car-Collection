import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
        "Analyze this image of a car. Identify the make, model, and year. Provide key specifications like horsepower, 0-60 mph time, and top speed. Use Google Search to verify the identification and provide a short summary of the car. Return ONLY a valid JSON object matching this structure: { make: string, model: string, year: number, confidence: number (0-1), keySpecs: { horsepower: number, zeroToSixty: number, topSpeed: number }, searchVerification: { verified: boolean, summary: string } }. Do not include any markdown formatting like ```json.",
      ],
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
