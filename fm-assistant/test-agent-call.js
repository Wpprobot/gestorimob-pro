
const ULTRAVOX_API_KEY = 'jrpCIOC3.5JjIFonFmna0rWfVHrbfe6pzdBJuXULG';
const AGENT_ID = '87ab75a4-36dc-4219-8f3e-592dc165003e';

console.log('Testando criação de chamada com Agent ID...\n');

const requestBody = {
  modelOverrides: {
    systemPrompt: 'You are a helpful assistant.',
    temperature: 0.7
  }
};

console.log('Request:', JSON.stringify(requestBody, null, 2));

fetch(`https://api.ultravox.ai/api/agents/${AGENT_ID}/calls`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': ULTRAVOX_API_KEY
  },
  body: JSON.stringify(requestBody)
})
.then(async response => {
  console.log('\n📥 Resposta:');
  console.log('Status:', response.status);
  
  const text = await response.text();
  console.log('Body:', text);
})
.catch(error => {
  console.error('\n❌ ERRO:', error);
});
