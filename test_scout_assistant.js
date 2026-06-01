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
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: [
          { type: "text", text: "Hi there!" }
        ] },
        { role: "user", content: "How are you?" }
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
