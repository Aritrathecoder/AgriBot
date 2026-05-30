import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Ensure base64 string has the correct data URI prefix for Groq
    let base64Data = image;
    if (!base64Data.startsWith("data:")) {
      base64Data = `data:image/jpeg;base64,${base64Data.replace(/^data:image\/\w+;base64,/, "")}`;
    }

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

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: base64Data } }
            ]
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json(
        { error: `Groq API Error: ${errorText}` },
        { status: 502 }
      );
    }

    const result = await response.json();
    const assistantMessage = result?.choices?.[0]?.message?.content;

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


