import fetch from 'node-fetch';

async function testKey(keyName, keyValue) {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  
  try {
    const response = await fetch(`${API_URL}?key=${keyValue}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] }),
    });

    const data = await response.json();
    console.log(`\nTesting ${keyName}:`);
    console.log(`Status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`Error: ${data.error?.message || JSON.stringify(data)}`);
    } else {
      console.log(`Success: ${data.candidates[0].content.parts[0].text}`);
    }
  } catch (err) {
    console.error(`Error testing ${keyName}:`, err.message);
  }
}

async function run() {
  await testKey("Key from Chat (env.local)", "AIzaSyBbvNOYKpPd1S6JTA9ULoNf1RnWXSgGf_s");
  await testKey("Key from Netlify Env", "AIzaSyDP9zOH5TjvP11NeopUn3Aod8RIJA2MQEhw");
}

run();
