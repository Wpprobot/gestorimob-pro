/**
 * BACKEND SERVER FOR ULTRAVOX AI INTEGRATION
 * Proxies API calls to Ultravox to keep API key secure
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Validate API key
if (!ULTRAVOX_API_KEY) {
  console.error('❌ ERROR: ULTRAVOX_API_KEY not found in environment variables');
  console.error('Please create a .env file with ULTRAVOX_API_KEY=your-key-here');
  process.exit(1);
}

console.log('🔑 API Key loaded:', ULTRAVOX_API_KEY.substring(0, 10) + '...');

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  console.log('📊 Health check requested');
  res.json({ 
    status: 'ok', 
    message: 'FM Assistant Voice Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Create Ultravox call
 * POST /api/ultravox/create-call
 */
app.post('/api/ultravox/create-call', async (req, res) => {
  try {
    const { systemPrompt, voice, temperature } = req.body;

    console.log('\n🎙️ ===== NEW CALL REQUEST =====');
    console.log('Timestamp:', new Date().toISOString());
    console.log('System Prompt length:', systemPrompt?.length || 0);

    // Voice ID extracted from user's agent (87ab75a4-36dc-4219-8f3e-592dc165003e)
    // This allows us to use the Brazilian voice while maintaining full control over the system prompt
    const BRAZILIAN_VOICE_ID = '733ff897-266e-4f05-89cf-a199bd36a106';

    const requestBody = {
      systemPrompt: systemPrompt || 'You are a helpful assistant.',
      temperature: temperature || 0.7,
      voice: BRAZILIAN_VOICE_ID,
      languageHint: 'pt-BR'
    };

    console.log('📤 Sending to Ultravox API...');
    console.log('Using Voice ID:', BRAZILIAN_VOICE_ID);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Call Ultravox API (Generic endpoint to allow system prompt override)
    const response = await fetch('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Ultravox API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ultravox API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Failed to create Ultravox call',
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    console.log('✅ Ultravox call created successfully!');
    console.log('Call ID:', data.callId);
    console.log('Join URL:', data.joinUrl ? 'Present' : 'Missing');

    res.json({
      success: true,
      callId: data.callId,
      joinUrl: data.joinUrl
    });

  } catch (error) {
    console.error('\n❌ EXCEPTION in create-call:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      type: error.name
    });
  }
});

/**
 * Get call status
 * GET /api/ultravox/call/:callId
 */
app.get('/api/ultravox/call/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    console.log('📞 Getting call status for:', callId);

    const response = await fetch(`https://api.ultravox.ai/api/calls/${callId}`, {
      headers: {
        'X-API-Key': ULTRAVOX_API_KEY
      }
    });

    if (!response.ok) {
      console.error('❌ Failed to get call status:', response.status);
      return res.status(response.status).json({
        error: 'Failed to get call status'
      });
    }

    const data = await response.json();
    console.log('✅ Call status retrieved');
    res.json(data);

  } catch (error) {
    console.error('❌ Error getting call status:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   FM Assistant - Voice Server         ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎙️ Ready to handle Ultravox calls`);
  console.log(`🔑 API Key: ${ULTRAVOX_API_KEY.substring(0, 15)}...`);
  console.log('\nPress Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  process.exit(0);
});
