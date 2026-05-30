import { NextResponse } from "next/server";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Clean base64 image data (remove prefixes like data:image/png;base64, if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are AgriBot's expert Pest & Disease Diagnosis system. Analyze the provided image of a plant/tree and identify if there is any infection or disease. 

You must return your response strictly as a JSON object with the following keys. Do not output any conversational text or markdown blocks outside the JSON.

JSON Structure:
{
  "plantName": "Name of the plant/tree identified in the image",
  "isHealthy": true/false,
  "diseaseName": "Common name of the disease or pest. If healthy, set to null",
  "confidenceScore": "Estimate your confidence percentage (e.g. 85%)",
  "symptoms": [
    "Detailed symptom 1",
    "Detailed symptom 2"
  ],
  "infectedParts": ["Leaves", "Stems", etc.],
  "remedies": {
    "organic": [
      {
        "name": "Name of organic remedy (e.g. Neem Oil Spray)",
        "instructions": "How to apply it step-by-step",
        "searchQuery": "Specific search query for buying this product (e.g. organic neem oil spray)"
      }
    ],
    "chemical": [
      {
        "name": "Name of chemical control product (e.g. Copper Fungicide)",
        "instructions": "Precautions and application guide",
        "searchQuery": "Specific search query for buying this chemical (e.g. copper fungicide for plants)"
      }
    ]
  }
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: `Gemini API Error: ${errorText}` },
        { status: 502 }
      );
    }

    const result = await response.json();
    const assistantMessage = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 502 }
      );
    }

    // Extract JSON from response (in case the model wraps it in markdown code blocks)
    let jsonString = assistantMessage.trim();
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/) || jsonString.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    try {
      const parsedData = JSON.parse(jsonString);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", assistantMessage);
      return NextResponse.json(
        { 
          error: "Diagnosis received but formatting was invalid. Please try again.",
          rawText: assistantMessage 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Diagnosis error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

