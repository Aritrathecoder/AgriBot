import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/data/systemPrompt";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // --- Widget mode: single `message` string → JSON response ---
    if (body.message && typeof body.message === "string") {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: body.message }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq Chat API error (status %d):", response.status, errorText);
        
        let friendlyError = "Failed to get AI response. Please try again later.";
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            friendlyError = errorJson.error.message;
          }
        } catch (e) {}

        if (response.status === 401 || response.status === 403) {
          friendlyError = "Authentication failed. Please check your API key.";
        }

        return NextResponse.json({ error: friendlyError }, { status: 502 });
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't understand that. Could you rephrase?";
      return NextResponse.json({ response: botResponse });
    }

    // --- Chat page mode: `messages` array → streamed response ---
    const { messages, language, location, weatherContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Message or messages array is required" }, { status: 400 });
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

    // Convert messages array to Groq format
    const groqMessages = messages.map((msg: any) => {
      const contentParts: any[] = [];

      // Extract text from message
      const text = msg.content || msg.parts?.find((p: any) => p.type === "text")?.text || "";
      if (text) {
        contentParts.push({ type: "text", text });
      }

      // Extract images from message
      const imagePart = msg.parts?.find((p: any) => p.type === "image");
      if (imagePart?.image) {
        const imageUrl = imagePart.image.startsWith("data:") ? imagePart.image : `data:image/jpeg;base64,${imagePart.image}`;
        contentParts.push({
          type: "image_url",
          image_url: { url: imageUrl }
        });
      }

      // If no parts, just string
      const content = contentParts.length === 1 && contentParts[0].type === "text" 
        ? contentParts[0].text 
        : contentParts;

      return {
        role: msg.role === "assistant" ? "assistant" : "user",
        content: content,
      };
    });

    // Prepend system prompt
    groqMessages.unshift({
      role: "system",
      content: systemPrompt
    });

    // Call Groq with streaming
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Stream API error (status %d):", response.status, errorText);
      
      let friendlyError = "Failed to get AI response. Please try again later.";
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.message) {
          friendlyError = errorJson.error.message;
        }
      } catch (e) {}

      if (response.status === 401 || response.status === 403) {
        friendlyError = "Authentication failed. Please check your API key.";
      }

      return NextResponse.json({ error: friendlyError }, { status: 502 });
    }

    // Stream SSE from Groq → plain text stream to the client
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
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.choices?.[0]?.delta?.content;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
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

