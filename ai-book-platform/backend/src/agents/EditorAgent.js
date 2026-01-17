import { getGeminiModel } from '../config/ai.js';

/**
 * Agente Revisor
 * Revisa gramática, ortografia e fluidez
 */
class EditorAgent {
  constructor() {
    this.model = getGeminiModel();
  }

  /**
   * Revisa texto
   */
  async revise(params) {
    const { text, language } = params;

    const languageNames = {
      'pt-BR': 'português do Brasil',
      'pt-PT': 'português de Portugal',
      'en': 'inglês',
      'es': 'espanhol',
    };

    const langName = languageNames[language] || 'português do Brasil';

    const systemPrompt = `Você é um revisor profissional de língua ${langName}.
Sua função é:

1. Corrigir ortografia, gramática e pontuação.
2. Melhorar a fluidez e clareza das frases.
3. Manter o mesmo estilo, tom de voz e significado do autor.

Regras IMPORTANTES:

- NÃO mude o conteúdo factual.
- NÃO adicione novas ideias.
- NÃO remova conteúdo, apenas melhore a forma.
- Evite palavras muito rebuscadas, mantenha linguagem acessível.
- Mantenha o formato markdown original (títulos, listas, etc).

Saída:

Devolva apenas o texto revisado, no mesmo formato markdown recebido. Não adicione comentários ou explicações.`;

    const userPrompt = `Revise o seguinte texto:

${text}

Retorne apenas o texto revisado.`;

    try {
      const result = await this.model.generateContent([
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Vou revisar o texto mantendo o estilo original.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ]);

      const response = result.response;
      const revisedText = response.text();

      return revisedText.trim();
    } catch (error) {
      console.error('Erro ao revisar texto:', error);
      throw new Error(`Falha ao revisar: ${error.message}`);
    }
  }
}

export default EditorAgent;
