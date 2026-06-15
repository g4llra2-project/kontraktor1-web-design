import fetch from 'node-fetch';

async function probePathsParam() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  const taskId = "aa5a725b63f972b1f6ee3f51f9bb9d98";
  
  const baseUrls = [
    "https://api.kie.ai/api/v1/",
    "https://api.kie.ai/v1/"
  ];

  const subPaths = [
    "jobs/queryTask",
    "jobs/query",
    "jobs/status",
    "jobs/task",
    "jobs",
    "task",
    "tasks",
    "task/status",
    "task/query",
    "taskResult",
    "task_result",
    "results"
  ];

  console.log(`Starting path-parameter probe...`);
  
  for (const baseUrl of baseUrls) {
    for (const subPath of subPaths) {
      for (const method of ["GET", "POST"]) {
        const url = `${baseUrl}${subPath}/${taskId}`;
        try {
          const res = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
            }
          });

          if (res.status !== 404) {
            console.log(`[FOUND PATH PARAM] ${method} ${url} -> Status: ${res.status}`);
            try {
              const body = await res.text();
              console.log(`  Response: ${body.substring(0, 300)}`);
            } catch (e) {}
          }
        } catch (err: any) {
          // silent error handling
        }
      }
    }
  }

  // Also query without subPath (direct task ID)
  for (const baseUrl of baseUrls) {
    for (const method of ["GET", "POST"]) {
      const url = `${baseUrl}${taskId}`;
      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
          }
        });
        if (res.status !== 404) {
          console.log(`[FOUND DIRECT PARAM] ${method} ${url} -> Status: ${res.status}`);
          try {
            const body = await res.text();
            console.log(`  Response: ${body.substring(0, 300)}`);
          } catch (e) {}
        }
      } catch (err) {}
    }
  }

  console.log("Path-parameter probe complete!");
}

probePathsParam();
