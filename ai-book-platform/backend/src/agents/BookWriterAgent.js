import { getGeminiModel } from '../config/ai.js';

/**
 * Agente Escritor de Livros
 * Gera conteúdo de capítulos
 */
class BookWriterAgent {
  constructor() {
    this.model = getGeminiModel();
  }

  /**
   * Gera conteúdo de um capítulo
   */
  async generateChapter(params) {
    const {
      chapterTitle,
      chapterDescription,
      targetWords,
      context,
    } = params;

    const systemPrompt = `Você é um escritor profissional. Vai escrever um capítulo de livro de alta qualidade.

Regras gerais:

1. Escreva em português do Brasil.
2. Seja claro, didático e envolvente.
3. Não repita a mesma ideia de formas diferentes só para encher espaço.
4. Nunca copie textos de livros existentes. O conteúdo deve ser original.
5. Use exemplos simples, metáforas moderadas e linguagem acessível ao público indicado.
6. Estruture o texto em parágrafos curtos e bem organizados.
7. Escreva aproximadamente ${targetWords} palavras.
8. NÃO inclua título do capítulo no início (ele será adicionado depois).
9. Mantenha o tom de voz: ${context.tone}

Tom de voz: ${context.tone}
Livro: ${context.bookTitle}
Resumo do livro: ${context.bookSummary}

${context.previousChapters.length > 0 ? `
Contexto dos capítulos anteriores (para manter continuidade):
${context.previousChapters.slice(-2).join('\n\n---\n\n')}
` : ''}

IMPORTANTE: Escreva APENAS o conteúdo do capítulo em formato markdown simples. Não inclua metadados, não escreva "Capítulo X" no início.`;

    const userPrompt = `Escreva o capítulo com as seguintes informações:

Título do capítulo: ${chapterTitle}
Descrição: ${chapterDescription}
Meta de palavras: ~${targetWords} palavras

Escreva o conteúdo completo do capítulo agora.`;

    try {
      const result = await this.model.generateContent([
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Vou escrever o capítulo com qualidade e originalidade.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ]);

      const response = result.response;
      const content = response.text();

      return content.trim();
    } catch (error) {
      console.error('Erro ao gerar capítulo:', error);
      throw new Error(`Falha ao gerar capítulo: ${error.message}`);
    }
  }
}

export default BookWriterAgent;
