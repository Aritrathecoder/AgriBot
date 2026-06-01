async function test() {
  try {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "user", 
            content: "What's in this image?", 
            parts: [
              { type: "text", text: "What's in this image?" },
              { type: "image", image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=" }
            ] 
          }
        ],
        language: "en",
        location: "Kolkata",
        weatherContext: null
      })
    });
    
    console.log("Status:", response.status);
    if (!response.ok) {
      console.log("Error:", await response.text());
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      process.stdout.write(decoder.decode(value, { stream: true }));
    }
    console.log("\nDone");
  } catch (err) {
    console.error("Fetch failed", err);
  }
}

test();
