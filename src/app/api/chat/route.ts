import { streamText, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { SYSTEM_PROMPT } from "@/data/systemPrompt";
import cropsData from "@/data/crops.json";

// Build crop context for the system prompt
function getCropContext(): string {
  return cropsData
    .map(
      (crop) =>
        `${crop.name} (${crop.hindi_name}): ${crop.description}. Soil: ${crop.soil.type}, pH ${crop.soil.ph}. Sowing: ${crop.seasons.sowing}. Harvest: ${crop.seasons.harvest}. Varieties: ${crop.varieties.join(", ")}.`
    )
    .join("\n");
}

// Demo responses
const DEMO_RESPONSES_EN = [
  `🌾 **Hello Farmer friend!** That's a great question.
  
I can tell you that — **stem borer** is the biggest pest in Rice cultivation in West Bengal.

## 💊 Solution:
- Apply **Cartap Hydrochloride 4G** @ 25kg/ha
- Install Pheromone traps for monitoring
- Spray **Neem oil** as an organic alternative

## ⏰ Timing:
- Focus on the Tillering stage (21-45 days)
- Early morning spray is best

\`\`\`products
[{"query": "stem borer pesticide rice"}]
\`\`\`

\`\`\`cropdetail
{"crop": "rice"}
\`\`\`

\`\`\`quickreplies
["Tell me more about rice varieties", "What about organic solutions?", "Fertilizer schedule for rice"]
\`\`\``,
];

const DEMO_RESPONSES_HI = [
  `🌾 **नमस्कार किसान भाई!** आपका सवाल बहुत अच्छा है।

मैं आपको बता देता हूँ — चावल (धान) की खेती में **तना छेदक (stem borer)** पश्चिम बंगाल में सबसे बड़ा कीट है।

## 💊 समाधान:
- **कार्टाप हाइड्रोक्लोराइड 4G** @ 25kg/ha डालें
- निगरानी के लिए फेरोमोन ट्रैप लगाएं
- जैविक विकल्प के रूप में **नीम के तेल** का छिड़काव करें

## ⏰ समय:
- टिलरिंग स्टेज (21-45 दिन) पर अधिक ध्यान दें
- सुबह जल्दी छिड़काव करना सबसे अच्छा होता है

\`\`\`products
[{"query": "stem borer pesticide rice"}]
\`\`\`

\`\`\`cropdetail
{"crop": "rice"}
\`\`\`

\`\`\`quickreplies
["चावल की किस्मों के बारे में बताएं", "जैविक समाधान क्या हैं?", "चावल के लिए उर्वरक कार्यक्रम"]
\`\`\``,
];

let demoIndex = 0;

export async function POST(req: Request) {
  try {
    const { messages, language, location, weatherContext } = await req.json();
    const lang = language || "en";
    
    // Check if Groq API key exists
    if (process.env.GROQ_API_KEY) {
      const cropContext = getCropContext();
      const languageInstruction = lang === "hi" 
        ? "\n\nCRITICAL RULE: You MUST respond entirely in HINDI (हिन्दी). Do not use English even if the user asks in English or the chat history contains English. Address the farmer respectfully."
        : "\n\nCRITICAL RULE: You MUST respond entirely in pure ENGLISH. Do not use Hindi or Hinglish, even if the chat history contains Hindi greetings. Ignore the language of previous messages and only use English.";

      let localContext = "";
      if (location) localContext += `\nThe farmer is currently in: ${location}.`;
      if (weatherContext) localContext += `\nCurrent local weather: ${weatherContext.temp}°C, ${weatherContext.humidity}% humidity, Wind: ${weatherContext.windSpeed}m/s, ${weatherContext.description}. Use this weather data to provide accurate real-time farming advice!`;

      const fullSystemPrompt = `${SYSTEM_PROMPT}${languageInstruction}\n\n## Local Knowledge Context:${localContext}\n\n## Crop Knowledge Base (100+ Crops):\n${cropContext}`;

      // Groq does not natively support images on llama-3.3-70b-versatile, so we pre-describe images using Gemini if available.
      const coreMessages = [];
      for (const msg of messages) {
        if (msg.parts && msg.parts.length > 0) {
          const hasImage = msg.parts.some((p: any) => p.type === 'image');
          if (hasImage) {
            const textParts = msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join("\n");
            const imagePart = msg.parts.find((p: any) => p.type === 'image');
            
            let description = "[An image was uploaded]";
            if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && imagePart) {
              try {
                const response = await generateText({
                  model: google("gemini-1.5-flash"),
                  messages: [
                    {
                      role: "user",
                      content: [
                        { type: "text", text: "Describe this plant/crop/soil/pest/disease image in detail for an agricultural assistant. Keep the description very concise but extract key visual features." },
                        { type: "image", image: imagePart.image }
                      ]
                    }
                  ]
                });
                description = `[Visual Description of uploaded image: ${response.text}]`;
              } catch (err) {
                console.error("Failed to describe image using Gemini:", err);
                description = "[Uploaded image: Vision analysis failed]";
              }
            } else {
              description = "[Uploaded image: Vision analysis unavailable without Gemini Key]";
            }
            
            coreMessages.push({
              role: msg.role,
              content: textParts ? `${textParts}\n\n${description}` : description
            });
          } else {
            coreMessages.push({ role: msg.role, content: msg.content });
          }
        } else {
          coreMessages.push({ role: msg.role, content: msg.content });
        }
      }

      const result = await streamText({
        model: groq("llama-3.3-70b-versatile"), // Use Llama 3.3 70B via Groq
        system: fullSystemPrompt,
        messages: coreMessages,
      });

      return result.toTextStreamResponse();
    } else if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      // Fallback to Gemini if only Gemini key is available
      const cropContext = getCropContext();
      const languageInstruction = lang === "hi" 
        ? "\n\nCRITICAL RULE: You MUST respond entirely in HINDI (हिन्दी). Do not use English even if the user asks in English or the chat history contains English. Address the farmer respectfully."
        : "\n\nCRITICAL RULE: You MUST respond entirely in pure ENGLISH. Do not use Hindi or Hinglish, even if the chat history contains Hindi greetings. Ignore the language of previous messages and only use English.";

      let localContext = "";
      if (location) localContext += `\nThe farmer is currently in: ${location}.`;
      if (weatherContext) localContext += `\nCurrent local weather: ${weatherContext.temp}°C, ${weatherContext.humidity}% humidity, Wind: ${weatherContext.windSpeed}m/s, ${weatherContext.description}. Use this weather data to provide accurate real-time farming advice!`;

      const fullSystemPrompt = `${SYSTEM_PROMPT}${languageInstruction}\n\n## Local Knowledge Context:${localContext}\n\n## Crop Knowledge Base (100+ Crops):\n${cropContext}`;

      const coreMessages = messages.map((msg: any) => {
        if (msg.parts && msg.parts.length > 0) {
          const hasImage = msg.parts.some((p: any) => p.type === 'image');
          if (hasImage) {
            return {
              role: msg.role,
              content: msg.parts.map((p: any) => {
                if (p.type === 'image') return { type: 'image', image: p.image };
                return { type: 'text', text: p.text || msg.content || "" };
              })
            };
          }
        }
        return { role: msg.role, content: msg.content };
      });

      const result = await streamText({
        model: google("gemini-1.5-flash"),
        system: fullSystemPrompt,
        messages: coreMessages,
      });

      return result.toTextStreamResponse();
    }

    // Demo mode fallback
    const responses = lang === "hi" ? DEMO_RESPONSES_HI : DEMO_RESPONSES_EN;
    const demoResponse = responses[demoIndex % responses.length];
    demoIndex++;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = demoResponse.split(" ");
        for (let i = 0; i < words.length; i++) {
          const word = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(encoder.encode(`0:${JSON.stringify(word)}\n`));
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
