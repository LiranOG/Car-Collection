import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
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
        "Listen to the exhaust note and engine noise in this media file. Identify the car make, model, and year. Also, identify the engine type (e.g., 'Flat-6', 'V8 Twin-Turbo') and estimate the peak RPM reached in the audio.",
      ],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            make: { type: Type.STRING },
            model: { type: Type.STRING },
            year: { type: Type.INTEGER },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
            engineType: { type: Type.STRING },
            estimatedRPM: { type: Type.INTEGER },
          },
          required: ["make", "model", "year", "confidence", "engineType", "estimatedRPM"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Video/Audio analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze media" },
      { status: 500 }
    );
  }
}
