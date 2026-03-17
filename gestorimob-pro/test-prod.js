import fetch from 'node-fetch';

async function run() {
  const url = 'https://gestorimob-pro.netlify.app/api/gemini-chat';
  
  // Test 1: Omitted history
  console.log('Testing omitted history...');
  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'hi' })
  });
  console.log('Status:', res.status, await res.text());

  // Test 2: history is null
  console.log('Testing null history...');
  res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'hi', history: null })
  });
  console.log('Status:', res.status, await res.text());
}
run();
