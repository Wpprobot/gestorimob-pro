import fetch from 'node-fetch';
import fs from 'fs';

async function testGoogleApi() {
  const envText = fs.readFileSync('.env', 'utf-8');
  const key = envText.match(/GEMINI_API_KEY=(.*)/)[1].trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    })
  });

  console.log('Status:', res.status);
  const data = await res.json();
  if (!res.ok) {
    console.error('API Error:', data.error.message);
  } else {
    console.log('API Response:', data.candidates[0].content.parts[0].text);
  }
}
testGoogleApi();
