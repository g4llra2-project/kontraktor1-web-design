import fetch from 'node-fetch';

async function testGetCreate() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  const taskId = "6bdd9933ad753b4824f6a7ff108b1691";
  
  const urls = [
    `https://api.kie.ai/api/v1/jobs/createTask?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/createTask?id=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/createTask?recordId=${taskId}`
  ];

  for (const url of urls) {
    try {
      console.log(`Sending GET to: ${url}`);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
        }
      });

      console.log(`Status: ${res.status}`);
      const body = await res.text();
      console.log(`Response: ${body}`);
    } catch (e: any) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testGetCreate();
