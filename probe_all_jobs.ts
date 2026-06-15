import fetch from 'node-fetch';

async function probeAllJobs() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  const taskId = "aa5a725b63f972b1f6ee3f51f9bb9d98";
  
  const subPaths = [
    "jobs/queryTaskResult",
    "jobs/queryResult",
    "jobs/getTaskResult",
    "jobs/getResult",
    "jobs/taskDetails",
    "jobs/details",
    "jobs/getDetails",
    "jobs/info",
    "jobs/getInfo",
    "jobs/taskInfo",
    "jobs/queryTaskInfo",
    "jobs/check",
    "jobs/checkTask",
    "jobs/checkStatus",
    "jobs/statusTask",
    "jobs/taskState",
    "jobs/queryState",
    "jobs/state",
    "jobs/fetch",
    "jobs/fetchTask",
    "jobs/fetchResult",
    "jobs/getTask",
    "jobs/retrieve",
    "jobs/retrieveTask"
  ];

  console.log(`Starting probe for jobs/...`);
  
  for (const subPath of subPaths) {
    for (const method of ["GET", "POST"]) {
      const url = `https://api.kie.ai/api/v1/${subPath}?taskId=${taskId}`;
      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
          },
          ...(method === "POST" ? { body: JSON.stringify({ taskId: taskId, id: taskId }) } : {})
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

  console.log("Jobs probe complete!");
}

probeAllJobs();
