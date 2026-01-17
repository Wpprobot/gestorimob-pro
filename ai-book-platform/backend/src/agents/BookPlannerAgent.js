import { getGeminiModel } from '../config/ai.js';

/**
 * Agente de Planejamento de Livros
 * Gera ideias de livros baseado em briefing
 */
class BookPlannerAgent {
  constructor() {
    this.model = getGeminiModel();
  }

  /**
   * Gera 3 ideias de livro
   */
  async generateIdeas(briefing) {
    const { tema, publicoAlvo, idioma, tamanho, tomDeVoz, tipo } = briefing;

    const systemPrompt = `Você é um escritor e editor profissional de livros em língua portuguesa.
Sua função é transformar um briefing em ideias concretas de livros prontos para publicação na Amazon KDP.

Regras:

1. Escreva em português do Brasil, claro e acessível.
2. Proponha 3 opções de livro.
3. Para cada opção, traga:
   - Título (criativo e chamativo)
   - Subtítulo (explicativo)
   - Sinopse (2 a 3 parágrafos)
   - Público-alvo sugerido
   - Tom de voz
   - Lista de capítulos (entre 8 e 15 capítulos, dependendo do tamanho)
     * Cada capítulo deve ter: título + 1 linha descrevendo o conteúdo
4. Nunca copie trechos de obras com direitos autorais. Use apenas ideias originais ou conhecimento geral.
5. Use criatividade, mas respeite exatamente o tema, público e tamanho desejado.

IMPORTANTE: Retorne APENAS um JSON válido, sem texto adicional antes ou depois.

Formato JSON esperado:
{
  "opcoes": [
    {
      "titulo": "string",
      "subtitulo": "string",
      "sinopse": "string",
      "publicoAlvo": "string",
      "tomDeVoz": "string",
      "capitulos": [
        { "titulo": "string", "descricao": "string" }
      ]
    }
  ]
}`;

    const userPrompt = `Gere 3 ideias de livro com base neste briefing:

Tema: ${tema}
Público-alvo: ${publicoAlvo}
Idioma: ${idioma}
Tamanho: ${tamanho}
Tom de voz: ${tomDeVoz}
Tipo: ${tipo}

Retorne apenas o JSON com as 3 opções.`;

    try {
      const result = await this.model.generateContent([
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Vou gerar 3 ideias de livro em formato JSON.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ]);

      const response = result.response;
      const text = response.text();

      // Extrair JSON do texto
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta não contém JSON válido');
      }

      const ideas = JSON.parse(jsonMatch[0]);
      return ideas;
    } catch (error) {
      console.error('Erro ao gerar ideias:', error);
      throw new Error(`Falha ao gerar ideias: ${error.message}`);
    }
  }
}

export default BookPlannerAgent;
