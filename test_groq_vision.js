const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const groqKey = env.split('\n').find(line => line.startsWith('GROQ_API_KEY=')).split('=')[1].trim();

async function test() {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: [
          { type: "text", text: "Hello" },
          { type: "image_url", image_url: { url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=" } }
        ] }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })
  });
  
  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

test();
