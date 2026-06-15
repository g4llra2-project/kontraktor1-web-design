import fetch from 'node-fetch';

async function testPost() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  const taskId = "aa5a725b63f972b1f6ee3f51f9bb9d98"; // Example task ID
  
  const urls = [
    "https://api.kie.ai/api/v1/jobs/queryTask",
    "https://api.kie.ai/api/v1/jobs/query",
    "https://api.kie.ai/api/v1/jobs/status",
    "https://api.kie.ai/api/v1/jobs/task"
  ];

  for (const url of urls) {
    console.log(`\nTesting POST to: ${url}`);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({ taskId: taskId, id: taskId })
      });
      console.log(`  Response status: ${res.status}`);
      const text = await res.text();
      console.log(`  Response body: ${text.substring(0, 300)}`);
    } catch (err: any) {
      console.log(`  Error: ${err.message}`);
    }
  }
}

testPost();
