import { getGeminiModel } from '../config/ai.js';

/**
 * Agente Tradutor
 * Traduz livros mantendo estilo e formatação
 */
class TranslatorAgent {
  constructor() {
    this.model = getGeminiModel();
  }

  /**
   * Traduz texto
   */
  async translate(params) {
    const { text, sourceLanguage, targetLanguage, preserveMarkdown } = params;

    const systemPrompt = `Você é um tradutor literário profissional.
Sua função é traduzir livros de ${sourceLanguage} para ${targetLanguage}.

Regras:

1. Preserve o sentido, o tom e o ritmo do texto original.
2. Adapte expressões culturais quando necessário, sem explicações entre parênteses.
3. Não faça notas de rodapé.
4. ${preserveMarkdown ? 'Mantenha a estrutura de markdown (títulos, listas, etc.).' : ''}
5. Mantenha a divisão de parágrafos.
6. Traduza de forma natural, como se o livro tivesse sido escrito originalmente em ${targetLanguage}.

Saída:

Apenas o texto traduzido, no mesmo formato do original.`;

    const userPrompt = `Traduza o seguinte texto de ${sourceLanguage} para ${targetLanguage}:

${text}

Retorne apenas a tradução.`;

    try {
      const result = await this.model.generateContent([
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Vou traduzir mantendo o estilo e naturalidade.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ]);

      const response = result.response;
      const translatedText = response.text();

      return translatedText.trim();
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      throw new Error(`Falha na tradução: ${error.message}`);
    }
  }
}

export default TranslatorAgent;
