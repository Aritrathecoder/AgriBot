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
      model: "llama-3.2-11b-vision-preview",
      messages: [
        { role: "user", content: "Hello" }
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
