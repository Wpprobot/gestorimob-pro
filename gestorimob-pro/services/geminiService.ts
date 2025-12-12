import { GoogleGenAI } from "@google/genai";

// Initialize the API client with hardcoded key
// ⚠️ WARNING: API Key is exposed in code - OK for personal use, NOT for production
const GEMINI_API_KEY = "AIzaSyArveX__r4_cof2l-CUTJQYO-lfqr2irLc";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System instruction for general assistance
const SYSTEM_INSTRUCTION = `Você é um assistente especializado em gestão imobiliária brasileira. 
Ajude com contratos, leis do inquilinato (Lei 8.245/91), manutenção, e análise de vistorias. 
Seja formal, preciso e útil.`;

export const GeminiService = {
  /**
   * General Chat with Vision capabilities
   */
  async chat(message: string, history: {role: string, parts: any[]}[], images: string[] = []): Promise<string> {
    try {
      const contents = history.map(h => ({
        role: h.role,
        parts: h.parts
      }));

      const userParts: any[] = [{ text: message }];
      
      // Add images if present
      for (const img of images) {
        const base64Data = img.split(',')[1] || img;
        userParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        });
      }

      contents.push({ role: 'user', parts: userParts });

      const response = await ai.models.generateContent({
        model: 'gemini-pro',
        contents: contents as any,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      return response.text || "Desculpe, não consegui gerar uma resposta.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Ocorreu um erro ao processar sua solicitação.";
    }
  },

  /**
   * Analyzes an image (e.g., for Vistoria/Inspection)
   */
  async analyzeImage(base64Image: string, prompt: string): Promise<string> {
    try {
      const base64Data = base64Image.split(',')[1] || base64Image;
      
      const response = await ai.models.generateContent({
        model: 'gemini-pro-vision',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            },
            { text: prompt }
          ]
        }
      });
      return response.text || "Não foi possível analisar a imagem.";
    } catch (error) {
      console.error("Gemini Vision Error:", error);
      throw error;
    }
  },

  /**
   * Generates a complex document (Contract)
   */
  async generateContract(details: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-pro',
        contents: `Elabore um contrato de aluguel residencial completo e juridicamente válido segundo as leis brasileiras. 
        Utilize os seguintes dados: ${details}. 
        Inclua cláusulas sobre pagamento, vistoria, rescisão, multa e foro.`
      });

      return response.text || "Erro ao gerar contrato.";
    } catch (error) {
      console.error("Gemini Contract Error:", error);
      return "Erro ao gerar o contrato. Tente novamente mais tarde.";
    }
  }
};
