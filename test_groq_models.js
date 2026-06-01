const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const groqKey = env.split('\n').find(line => line.startsWith('GROQ_API_KEY=')).split('=')[1].trim();

async function getModels() {
  const response = await fetch("https://api.groq.com/openai/v1/models", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${groqKey}`
    }
  });
  
  const data = await response.json();
  const models = data.data.map(m => m.id);
  console.log("Available models:", models);
}

getModels();
