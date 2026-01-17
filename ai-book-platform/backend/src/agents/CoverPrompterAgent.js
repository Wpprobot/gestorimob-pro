import { getGeminiModel } from '../config/ai.js';

/**
 * Agente de Prompt de Capa
 * Gera prompts para geração de imagens de capa
 */
class CoverPrompterAgent {
  constructor() {
    this.model = getGeminiModel();
  }

  /**
   * Gera prompt para imagem de capa
   */
  async generateCoverPrompt(params) {
    const { titulo, subtitulo, sinopse, genero, publicoAlvo, tom } = params;

    const systemPrompt = `Você é um diretor de arte especializado em capas de livros.
Sua função é transformar o briefing do livro em um prompt detalhado para um modelo de geração de imagens.

O prompt deve especificar:

1. Estilo visual (ex: minimalista, aquarela, futurista, realista, cartoon, fotográfico, etc.)
2. Cores principais e paleta
3. Elementos visuais que representem o tema
4. Clima/emoção da imagem (ex: inspirador, misterioso, leve, profissional, energético)
5. Composição (ex: centrado, assimétrico, com espaço para texto)
6. Iluminação e atmosfera

IMPORTANTE:
- NÃO peça para escrever texto na imagem (título/autor serão adicionados depois)
- Apenas descreva a arte visual da capa
- Seja específico e detalhado
- Pense em capas que vendem bem na Amazon

Saída:

Retorne um JSON com:
{
  "promptEN": "prompt em inglês detalhado",
  "promptPT": "versão em português do mesmo prompt",
  "styleNotes": "notas sobre o estilo sugerido"
}`;

    const userPrompt = `Crie um prompt de capa para este livro:

Título: ${titulo}
Subtítulo: ${subtitulo || 'N/A'}
Sinopse: ${sinopse}
Gênero: ${genero}
Público-alvo: ${publicoAlvo}
Tom: ${tom}

Retorne apenas o JSON.`;

    try {
      const result = await this.model.generateContent([
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Vou criar um prompt de capa profissional em JSON.' }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ]);

      const response = result.response;
      const text = response.text();

      // Extrair JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta não contém JSON válido');
      }

      const prompts = JSON.parse(jsonMatch[0]);
      return prompts;
    } catch (error) {
      console.error('Erro ao gerar prompt de capa:', error);
      throw new Error(`Falha ao gerar prompt de capa: ${error.message}`);
    }
  }
}

export default CoverPrompterAgent;
