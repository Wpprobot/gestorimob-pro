
import fetch from 'node-fetch';

const API_KEY = 'AIzaSyCzdZdW3lColYRBluzYVhYKq93_sqPw9wU';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function testKey() {
  console.log('Testing API Key directly with Google...');
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });

    const data = await response.json();
    
    if (response.ok) {
        console.log('✅ API KEY IS VALID!');
        console.log('Response:', data.candidates[0].content.parts[0].text);
    } else {
        console.log('❌ API KEY ERROR');
        console.log('Status:', response.status);
        console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Exception:', error);
  }
}

testKey();
