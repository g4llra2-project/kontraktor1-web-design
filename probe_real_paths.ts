import fetch from 'node-fetch';

async function probeRealPaths() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  const taskId = "aa5a725b63f972b1f6ee3f51f9bb9d98";
  
  const baseUrls = [
    "https://api.kie.ai/api/v1/",
    "https://api.kie.ai/v1/"
  ];

  const subPaths = [
    // jobs
    "jobs/queryTask", "jobs/querytask", "jobs/query-task", "jobs/query_task",
    "jobs/query", "jobs/status", "jobs/get", "jobs/task", "jobs/result", "jobs/detail",
    "jobs/getTask", "jobs/taskStatus", "jobs/queryStatus", "jobs/record", "jobs/queryRecord",
    "jobs/resultTask", "jobs/taskResult", "jobs/output",
    
    // task
    "task/status", "task/query", "task/get", "task/result", "task/detail", "task/queryTask", "task",
    "tasks/status", "tasks/query", "tasks/get", "tasks/result", "tasks/detail", "tasks/queryTask", "tasks",
    
    // root
    "queryTask", "query", "status", "taskResult", "task", "jobs"
  ];

  console.log(`Starting massive probe: ${baseUrls.length * subPaths.length * 2} combinations...`);
  
  for (const baseUrl of baseUrls) {
    for (const subPath of subPaths) {
      for (const method of ["GET", "POST"]) {
        const urlWithTask = `${baseUrl}${subPath}?taskId=${taskId}`;
        const urlWithId = `${baseUrl}${subPath}?id=${taskId}`;
        const urlWithRecord = `${baseUrl}${subPath}?recordId=${taskId}`;
        
        try {
          const res = await fetch(urlWithTask, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
            },
            ...(method === "POST" ? { body: JSON.stringify({ taskId: taskId, recordId: taskId, id: taskId }) } : {})
          });

          if (res.status !== 404) {
            console.log(`[FOUND!] ${method} ${urlWithTask} -> Status: ${res.status}`);
            try {
              const body = await res.text();
              console.log(`  Response: ${body.substring(0, 300)}`);
            } catch (e) {}
          }
        } catch (err: any) {
          // ignore network errors for silent robustness, or log if critical
        }
      }
    }
  }
  console.log("Probe complete!");
}

probeRealPaths();
