console.log("Environment variables:");
for (const key of Object.keys(process.env)) {
  if (key.startsWith("VITE_") || key.startsWith("KIE_") || key.includes("API") || key.includes("URL")) {
    console.log(`${key}: ${process.env[key]}`);
  }
}
