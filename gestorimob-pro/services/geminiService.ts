// Secure Gemini Service - Uses Netlify Functions to protect API keys
// No more exposed API keys in client-side code!

const REQUEST_TIMEOUT = 30000; // 30 segundos

// Helper para adicionar timeout em fetch
const fetchWithTimeout = (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Helper para log detalhado de erros
const logDetailedError = (context: string, error: any, response?: Response) => {
  console.group(`🔴 ${context}`);
  console.error('Error:', error);
  if (response) {
    console.error('Status:', response.status, response.statusText);
    console.error('URL:', response.url);
  }
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

export const GeminiService = {
  async chat(message: string, history: {role: string, parts: any[]}[], images: string[] = []): Promise<string> {
    try {
      const response = await fetchWithTimeout('/api/gemini-chat', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history,
          images 
        })
      }, REQUEST_TIMEOUT);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logDetailedError('Gemini Chat Error', errorData, response);
        
        // Mensagens de erro mais específicas
        if (response.status === 500) {
          return "❌ Erro no servidor. A chave da API pode não estar configurada. Entre em contato com o suporte.";
        } else if (response.status === 429) {
          return "⏳ Limite de requisições excedido. Tente novamente em alguns minutos.";
        } else if (response.status === 401 || response.status === 403) {
          return "🔑 Erro de autenticação. A chave da API pode estar inválida.";
        }
        
        return `❌ Erro ao processar sua solicitação (código ${response.status}). Tente novamente.`;
      }

      const data = await response.json();
      
      // Validar formato da resposta
      if (!data || typeof data.response !== 'string') {
        console.error('Invalid response format:', data);
        return "❌ Resposta inválida do servidor. Tente novamente.";
      }
      
      return data.response || "Desculpe, não consegui gerar uma resposta.";
    } catch (error: any) {
      logDetailedError('Gemini Chat Exception', error);
      
      if (error.message === 'Request timeout') {
        return "⏱️ A requisição demorou muito. Tente novamente ou use uma mensagem mais curta.";
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return "🌐 Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      return "❌ Erro inesperado. Tente novamente mais tarde.";
    }
  },

  async analyzeImage(base64Image: string, prompt: string): Promise<string> {
    try {
      const response = await fetchWithTimeout('/api/gemini-analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          base64Image, 
          prompt 
        })
      }, REQUEST_TIMEOUT);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logDetailedError('Gemini Vision Error', errorData, response);
        
        if (response.status === 500) {
          throw new Error("Erro no servidor ao analisar imagem. Verifique a configuração da API.");
        } else if (response.status === 413) {
          throw new Error("Imagem muito grande. Use uma imagem menor.");
        }
        
        throw new Error(errorData.error || "Erro ao analisar imagem");
      }

      const data = await response.json();
      
      if (!data || typeof data.analysis !== 'string') {
        console.error('Invalid analysis response:', data);
        throw new Error("Resposta inválida do servidor");
      }
      
      return data.analysis || "Não foi possível analisar a imagem.";
    } catch (error: any) {
      logDetailedError('Gemini Vision Exception', error);
      
      if (error.message === 'Request timeout') {
        throw new Error("Análise demorou muito. Tente com uma imagem menor.");
      }
      
      throw error;
    }
  },

  async generateContract(details: string): Promise<string> {
    try {
      const response = await fetchWithTimeout('/api/gemini-generate-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details })
      }, REQUEST_TIMEOUT);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logDetailedError('Gemini Contract Error', errorData, response);
        
        if (response.status === 500) {
          return "❌ Erro no servidor ao gerar contrato. Verifique a configuração da API.";
        }
        
        return `❌ Erro ao gerar o contrato (código ${response.status}). Tente novamente mais tarde.`;
      }

      const data = await response.json();
      
      if (!data || typeof data.contract !== 'string') {
        console.error('Invalid contract response:', data);
        return "❌ Resposta inválida do servidor. Tente novamente.";
      }
      
      return data.contract || "Erro ao gerar contrato.";
    } catch (error: any) {
      logDetailedError('Gemini Contract Exception', error);
      
      if (error.message === 'Request timeout') {
        return "⏱️ Geração do contrato demorou muito. Tente novamente.";
      }
      
      if (error.message.includes('Failed to fetch')) {
        return "🌐 Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      return "❌ Erro inesperado ao gerar contrato. Tente novamente mais tarde.";
    }
  },

  // Novo método para testar conexão com a API
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchWithTimeout('/.netlify/functions/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'ping',
          history: []
        })
      }, 10000); // Timeout mais curto para teste

      if (response.ok) {
        return { success: true, message: '✅ Conexão com IA funcionando!' };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: `❌ Erro na API (${response.status}): ${errorData.error || 'Desconhecido'}` 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: `❌ Falha na conexão: ${error.message}` 
      };
    }
  }
};

