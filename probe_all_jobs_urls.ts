import fetch from 'node-fetch';

async function probeAllJobsUrls() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  
  const subPaths = [
    "jobs/list", "jobs/history", "jobs/logs", "jobs/all", "jobs/search",
    "tasks/list", "tasks/history", "tasks/logs", "tasks/all",
    "jobs", "tasks", "logs", "history", "list"
  ];

  console.log(`Starting probe for jobs context urls...`);
  
  for (const subPath of subPaths) {
    for (const method of ["GET", "POST"]) {
      const url = `https://api.kie.ai/api/v1/${subPath}`;
      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
          },
          ...(method === "POST" ? { body: JSON.stringify({ page: 1, pageSize: 10 }) } : {})
        });

        if (res.status !== 404) {
          console.log(`[FOUND PATH] ${method} ${url} -> Status: ${res.status}`);
          try {
            const body = await res.text();
            console.log(`  Response: ${body.substring(0, 300)}`);
          } catch (e) {}
        }
      } catch (err) {}
    }
  }

  console.log("Jobs context probe complete!");
}

probeAllJobsUrls();
