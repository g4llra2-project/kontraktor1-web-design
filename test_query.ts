import fetch from 'node-fetch';

async function testQuery() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  console.log("Testing with VITE_KIE_API_KEY:", apiKey ? "Detected" : "Missing");
  
  const url = "https://api.kie.ai/api/v1/jobs/queryTask?taskId=1dd8a716452291f7d6040a51c1b44f96";
  console.log(`Sending query to ${url}...`);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
      }
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response JSON:", JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

testQuery();
