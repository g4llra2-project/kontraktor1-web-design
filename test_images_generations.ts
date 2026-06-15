import fetch from 'node-fetch';

async function testImagesGenerations() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  
  const urls = [
    "https://api.kie.ai/api/v1/images/generations",
    "https://api.kie.ai/v1/images/generations"
  ];

  const payload = {
    model: "nano-banana-pro",
    prompt: "minimalist 2d floor plan of a simple 5x10 house, 1 floor, standard black and white blueprint style",
    n: 1,
    size: "1024x1024"
  };

  for (const url of urls) {
    try {
      console.log(`Sending POST to standard OpenAI endpoint: ${url}`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify(payload)
      });

      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response keys/body: ${text.substring(0, 1000)}`);
    } catch (e: any) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testImagesGenerations();
