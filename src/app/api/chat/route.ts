import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/data/systemPrompt";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // --- Widget mode: single `message` string → JSON response ---
    if (body.message && typeof body.message === "string") {
      const response = await fetch(`${GEMINI_API_URL}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [{ role: "user", parts: [{ text: body.message }] }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini Chat API error:", errorText);
        return NextResponse.json(
          { error: "Failed to get AI response" },
          { status: 502 }
        );
      }

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't understand that. Could you rephrase?";
      return NextResponse.json({ response: botResponse });
    }

    // --- Chat page mode: `messages` array → streamed response ---
    const { messages, language, location, weatherContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Message or messages array is required" },
        { status: 400 }
      );
    }

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT;
    if (language === "hi") {
      systemPrompt += "\n\n## Language Instruction\nRespond in Hindi (Devanagari script). Use simple Hindi that farmers can understand.";
    }
    if (location) {
      systemPrompt += `\n\n## User Location\nThe farmer is located in: ${location}`;
    }
    if (weatherContext) {
      systemPrompt += `\n\n## Current Weather\n${JSON.stringify(weatherContext)}`;
    }

    // Convert messages array to Gemini format
    const geminiContents = messages.map((msg: any) => {
      const parts: any[] = [];

      // Extract text from message
      const text = msg.content || msg.parts?.find((p: any) => p.type === "text")?.text || "";
      if (text) parts.push({ text });

      // Extract images from message
      const imagePart = msg.parts?.find((p: any) => p.type === "image");
      if (imagePart?.image) {
        const base64Data = imagePart.image.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: base64Data,
          },
        });
      }

      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts: parts.length > 0 ? parts : [{ text: " " }],
      };
    });

    // Call Gemini with streaming
    const response = await fetch(`${GEMINI_API_URL}:streamGenerateContent?alt=sse&key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Stream API error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 502 }
      );
    }

    // Stream SSE from Gemini → plain text stream to the client
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE events from buffer
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // skip malformed JSON chunks
                }
              }
            }
          }
        } catch (err) {
          console.error("Stream processing error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

