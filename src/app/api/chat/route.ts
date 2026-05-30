import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/data/systemPrompt";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // --- Widget mode: single `message` string → JSON response ---
    if (body.message && typeof body.message === "string") {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.2-11b-vision-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: body.message }
          ],
          temperature: 0.7,
          max_tokens: 2048,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq Chat API error:", errorText);
        return NextResponse.json(
          { error: "Failed to get AI response" },
          { status: 502 }
        );
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't understand that. Could you rephrase?";
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

    // Convert messages array to Groq (OpenAI-compatible) format
    const groqMessages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    messages.forEach((msg: any) => {
      const parts: any[] = [];

      // Extract text from message
      const text = msg.content || msg.parts?.find((p: any) => p.type === "text")?.text || "";
      if (text) {
        parts.push({ type: "text", text });
      }

      // Extract images from message
      const imagePart = msg.parts?.find((p: any) => p.type === "image");
      if (imagePart?.image) {
        // Groq / OpenAI expects: data:image/jpeg;base64,...
        let base64Data = imagePart.image;
        if (!base64Data.startsWith("data:")) {
          base64Data = `data:image/jpeg;base64,${base64Data}`;
        }
        parts.push({
          type: "image_url",
          image_url: {
            url: base64Data,
          },
        });
      }

      groqMessages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        // If it's a simple text message with no images, we can pass string directly, 
        // but for consistency and vision support, we pass the parts array.
        content: parts.length > 0 ? parts : " ",
      });
    });

    // Call Groq with streaming
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Stream API error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 502 }
      );
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

            // Process complete SSE events from buffer
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // keep incomplete line in buffer

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

