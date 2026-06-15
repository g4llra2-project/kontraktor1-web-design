import fetch from 'node-fetch';

async function testEndpoints() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  const taskId = "aa5a725b63f972b1f6ee3f51f9bb9d98"; // Example task ID
  
  const endpoints = [
    // Sub-path: jobs/
    `https://api.kie.ai/api/v1/jobs/queryTask?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/query?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/status?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/get?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/task?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/result?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/queryTask?id=${taskId}`,
    `https://api.kie.ai/api/v1/jobs/query?id=${taskId}`,
    
    // Sub-path: task/ or tasks/
    `https://api.kie.ai/api/v1/task/status?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/task/query?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/task/get?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/task?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/tasks/status?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/tasks/query?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/tasks?taskId=${taskId}`,
    
    // Root level paths
    `https://api.kie.ai/api/v1/queryTask?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/status?taskId=${taskId}`,
    `https://api.kie.ai/api/v1/taskResult?taskId=${taskId}`,
    
    // Without api/ prefix if it is v1/
    `https://api.kie.ai/v1/jobs/queryTask?taskId=${taskId}`,
    `https://api.kie.ai/v1/jobs/query?taskId=${taskId}`,
    `https://api.kie.ai/v1/jobs/status?taskId=${taskId}`
  ];

  console.log(`Starting probe of ${endpoints.length} endpoints...`);
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
        }
      });
      console.log(`URL: ${url} -> Status: ${res.status}`);
      if (res.status !== 404) {
        const text = await res.text();
        console.log(`  >>> FOUND non-404! Response: ${text.substring(0, 300)}`);
      }
    } catch (err: any) {
      console.log(`URL: ${url} -> Error: ${err.message}`);
    }
  }
}

testEndpoints();
