
import fetch from 'node-fetch';

async function testEndpoint(url, name) {
  console.log(`Testing ${name} (${url})...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, are you working?',
        history: []
      })
    });

    console.log(`${name} Status:`, response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`${name} Response:`, data.response ? data.response.substring(0, 100) + '...' : 'No text response');
      return true;
    } else {
      const text = await response.text();
      console.error(`${name} Error Body:`, text);
      return false;
    }
  } catch (error) {
    console.error(`${name} Exception:`, error.message);
    return false;
  }
}

async function run() {
  // Test Local
  console.log('--- START TEST ---');
  await testEndpoint('http://localhost:8888/api/gemini-chat', 'LOCAL');
  
  // Test Production
  console.log('\n');
  await testEndpoint('https://gestorimob-pro.netlify.app/api/gemini-chat', 'PRODUCTION');
  console.log('--- END TEST ---');
}

run();
