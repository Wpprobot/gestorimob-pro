// Teste rápido da API Key Ultravox

const ULTRAVOX_API_KEY = 'jrpCIOC3.5JjIFonFmna0rWfVHrbfe6pzdBJuXULG';

console.log('Testando API Key do Ultravox...\n');

const requestBody = {
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7
};

console.log('Request:', JSON.stringify(requestBody, null, 2));

fetch('https://api.ultravox.ai/api/calls', {
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
  console.log('Status Text:', response.statusText);
  
  const text = await response.text();
  console.log('Body:', text);
  
  if (response.ok) {
    console.log('\n✅ API KEY VÁLIDA!');
  } else {
    console.log('\n❌ API KEY INVÁLIDA ou REQUISIÇÃO INCORRETA');
    console.log('Detalhes:', text);
  }
})
.catch(error => {
  console.error('\n❌ ERRO:', error);
});
