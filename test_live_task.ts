import fetch from 'node-fetch';

async function testLiveTask() {
  const apiKey = process.env.VITE_KIE_API_KEY || "";
  if (!apiKey) {
    console.error("VITE_KIE_API_KEY is not defined in environment variables!");
    return;
  }
  
  const createUrl = "https://api.kie.ai/api/v1/jobs/createTask";
  const payload = {
    model: "nano-banana-pro",
    input: {
      prompt: "minimalist 2d floor plan of a simple 5x10 house, 1 floor, standard black and white blueprint style",
      aspect_ratio: "4:3",
      num_outputs: 1
    }
  };

  console.log("Sending createTask request to:", createUrl);
  try {
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log("CreateTask response status:", createRes.status);
    const taskData = await createRes.json() as any;
    console.log("CreateTask response body:", JSON.stringify(taskData, null, 2));

    const taskId = taskData.task_id || taskData.id || taskData.taskId || taskData.data?.taskId;
    if (!taskId) {
      console.error("No Task ID found in response!");
      return;
    }

    console.log(`Successfully created task with ID: ${taskId}`);
    const queryUrl = `https://api.kie.ai/api/v1/jobs/queryTask?taskId=${taskId}`;
    
    let completed = false;
    let attempts = 0;
    while (!completed && attempts < 20) {
      attempts++;
      console.log(`\n--- Wait 5 seconds... Poll #${attempts} ---`);
      await new Promise(resolve => setTimeout(resolve, 5000));

      const queryRes = await fetch(queryUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });

      console.log(`Query response status: ${queryRes.status}`);
      const queryData = await queryRes.json() as any;
      console.log(`Query response body:`, JSON.stringify(queryData, null, 2));

      const status = (queryData.status || queryData.data?.status || "").toLowerCase();
      if (status === "success" || status === "completed" || queryData.results || queryData.data?.results) {
        console.log("Task is completed!");
        completed = true;
      } else if (status === "failed" || status === "fail") {
        console.log("Task failed!");
        completed = true;
      }
    }
  } catch (err: any) {
    console.error("Request failed with error:", err.message);
  }
}

testLiveTask();
