import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/data/systemPrompt";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse";
const GEMINI_API_URL_SYNC = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!openAiKey && !geminiKey) {
      console.error("No API keys configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const useOpenAI = !!openAiKey;

    // --- Widget mode: single `message` string → JSON response ---
    if (body.message && typeof body.message === "string") {
      let response;
      
      if (useOpenAI) {
        response = await fetch(OPENAI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openAiKey}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: body.message }
            ]
          })
        });
      } else {
        response = await fetch(GEMINI_API_URL_SYNC, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-goog-api-key": geminiKey! },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: body.message }] }]
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat API error (status %d):", response.status, errorText);
        
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
      let botResponse = "I'm sorry, I couldn't understand that. Could you rephrase?";
      
      if (useOpenAI) {
        botResponse = data.choices?.[0]?.message?.content || botResponse;
      } else {
        botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || botResponse;
      }
      
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

    let response;

    if (useOpenAI) {
      const openAiMessages = messages.map((msg: any) => {
        const contentParts: any[] = [];
        const text = msg.content || msg.parts?.find((p: any) => p.type === "text")?.text || "";
        if (text) contentParts.push({ type: "text", text });

        const imagePart = msg.parts?.find((p: any) => p.type === "image");
        if (imagePart?.image) {
          const imageUrl = imagePart.image.startsWith("data:") ? imagePart.image : `data:image/jpeg;base64,${imagePart.image}`;
          contentParts.push({ type: "image_url", image_url: { url: imageUrl } });
        }

        const content = contentParts.length === 1 && contentParts[0].type === "text" ? contentParts[0].text : contentParts;
        return { role: msg.role === "assistant" ? "assistant" : "user", content };
      });

      openAiMessages.unshift({ role: "system", content: systemPrompt });

      response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openAiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openAiMessages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: true
        }),
      });
    } else {
      const geminiContents = messages.map((msg: any) => {
        const parts: any[] = [];
        const text = msg.content || msg.parts?.find((p: any) => p.type === "text")?.text || "";
        if (text) parts.push({ text });

        const imagePart = msg.parts?.find((p: any) => p.type === "image");
        if (imagePart?.image) {
          const base64Data = imagePart.image.replace(/^data:image\/\w+;base64,/, "");
          parts.push({ inline_data: { mime_type: "image/jpeg", data: base64Data } });
        }
        return { role: msg.role === "assistant" ? "model" : "user", parts: parts.length > 0 ? parts : [{ text: " " }] };
      });

      response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-goog-api-key": geminiKey! },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stream API error (status %d):", response.status, errorText);
      
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
                  let text = "";
                  
                  if (useOpenAI) {
                    text = parsed.choices?.[0]?.delta?.content;
                  } else {
                    text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  }
                  
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {}
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
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

