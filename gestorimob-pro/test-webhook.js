import fetch from 'node-fetch';

async function testWebhook() {
  console.log('--- Testing PIX Webhook ---');
  
  // Test with Woovi's actual payload format
  const payload = {
    event: 'OPENPIX:CHARGE_COMPLETED',
    charge: {
      value: 150000, // R$1500,00 in cents
      transactionID: `test-${Date.now()}`,
      correlationID: 'test-corr-001',
      paidAt: new Date().toISOString(),
      comment: 'Aluguel teste webhook'
    }
  };

  try {
    const res = await fetch('https://gestorimob-pro.netlify.app/api/openpix-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text}`);
    
    try {
      const json = JSON.parse(text);
      if (json.success) {
        console.log('\n✅ Webhook working! Payment ID:', json.paymentId);
        console.log('Amount: R$', json.amount);
        console.log('Matched property:', json.matchedProperty || 'No match (no properties with this rent amount)');
      } else {
        console.log('\n❌ Webhook error:', json.error, json.details);
      }
    } catch(e) {
      console.log('Raw response (not JSON):', text);
    }
  } catch(err) {
    console.error('Request failed:', err.message);
  }
}

testWebhook();
