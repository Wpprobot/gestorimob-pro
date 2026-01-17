
const ULTRAVOX_API_KEY = 'jrpCIOC3.5JjIFonFmna0rWfVHrbfe6pzdBJuXULG';
const AGENT_ID = '87ab75a4-36dc-4219-8f3e-592dc165003e';

console.log('Buscando detalhes do Agent...\n');

fetch(`https://api.ultravox.ai/api/agents/${AGENT_ID}`, {
  method: 'GET',
  headers: {
    'X-API-Key': ULTRAVOX_API_KEY
  }
})
.then(async response => {
  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Agent Data:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Erro:', error);
});
