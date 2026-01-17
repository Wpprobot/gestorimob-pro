import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';

export class QueroContempladascraper extends BaseScraper {
  constructor() {
    super('Quero Contemplada', 'https://contempladas.querocontemplada.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];

    try {
      // URL com parâmetro para buscar todos os segmentos
      const html = await this.fetchHTML('?segmento=todos');
      const todasCartas = this.parseCards(html);
      cartas.push(...todasCartas);
      console.log(`[Quero Contemplada] Total: ${todasCartas.length} cartas encontradas`);
    } catch (error) {
      console.error('[Quero Contemplada] Erro ao buscar cartas:', error);
    }

    return cartas;
  }

  /**
   * Parse dos cards do Quero Contemplada
   * Estrutura do card (.card-contempladas):
   * - Linha 0: ícone
   * - Linha 1: Administradora (MyCon, Bradesco)
   * - Linha 2: Crédito (R$ 35.618,00)
   * - Linha 3: "Entrada:"
   * - Linha 4: Entrada (R$ 13.041,58)
   * - Linha 5: "Parcelas:"
   * - Linha 6: Parcelas (34 x R$ 1.282,39)
   */
  private parseCards(html: string): CartaContemplada[] {
    const $ = this.parseHTML(html);
    const cartas: CartaContemplada[] = [];

    // Seletor: .card-contempladas
    const cards = $('.card-contempladas, .card');
    
    if (cards.length === 0) {
      console.log('[Quero Contemplada] Cards não encontrados');
      return cartas;
    }

    cards.each((_, card) => {
      const $card = $(card);
      const texto = $card.text();
      
      // Pula cards que não parecem ter dados de cartas
      if (!texto.includes('Entrada') && !texto.includes('Parcelas')) {
        return;
      }

      // Extrai linhas de texto
      const linhas = texto.split('\n').map(l => l.trim()).filter(l => l);
      
      // Tenta encontrar os dados nas linhas
      let administradora = '';
      let creditoText = '';
      let entradaText = '';
      let parcelasText = '';

      for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        
        // Crédito é geralmente o primeiro valor R$
        if (linha.startsWith('R$') && !creditoText) {
          creditoText = linha;
          // A linha anterior pode ser a administradora
          if (i > 0 && !linhas[i-1].startsWith('R$') && !linhas[i-1].includes(':')) {
            administradora = linhas[i-1];
          }
        }
        // Entrada vem depois de "Entrada:"
        else if (linha.toLowerCase().includes('entrada')) {
          const nextIdx = i + 1;
          if (nextIdx < linhas.length) {
            entradaText = linhas[nextIdx];
          }
        }
        // Parcelas vem depois de "Parcelas:"
        else if (linha.toLowerCase().includes('parcelas') && !linha.includes('x')) {
          const nextIdx = i + 1;
          if (nextIdx < linhas.length) {
            parcelasText = linhas[nextIdx];
          }
        }
        // Ou parcelas já está na mesma linha com "x"
        else if (linha.includes(' x ') && linha.includes('R$')) {
          parcelasText = linha;
        }
      }

      // Parse dos valores
      const valorCarta = this.parseValor(creditoText);
      const valorEntrada = this.parseValor(entradaText);
      const { parcelas, valorParcela } = this.parseParcelasText(parcelasText);

      // Detecta o tipo pelo ícone ou contexto
      let tipo: TipoCarta = 'imovel'; // Default
      if (texto.toLowerCase().includes('auto') || texto.toLowerCase().includes('veículo')) {
        tipo = 'veiculo';
      }

      // Só adiciona se tem valor válido
      if (valorCarta > 0) {
        cartas.push(this.criarCarta({
          tipo,
          valorCarta,
          valorEntrada,
          numeroParcelas: parcelas,
          valorParcela,
          administradora: this.limparAdministradora(administradora),
          urlOriginal: this.urlBase + '?segmento=todos',
          descricao: `${administradora} - Crédito ${creditoText}`,
        }));
      }
    });

    return cartas;
  }

  /**
   * Parse das parcelas no formato "34 x R$ 1.282,39"
   */
  private parseParcelasText(parcelasText: string): { parcelas: number; valorParcela: number } {
    const match = parcelasText.match(/(\d+)\s*[xX]\s*R?\$?\s*([\d.,]+)/);
    
    if (match) {
      return {
        parcelas: parseInt(match[1], 10),
        valorParcela: this.parseValor(match[2]),
      };
    }
    
    return { parcelas: 0, valorParcela: 0 };
  }

  /**
   * Limpa o nome da administradora
   */
  private limparAdministradora(admin: string): string {
    // Remove ícones e caracteres especiais
    const limpo = admin.replace(/home_work|directions_car|two_wheeler/gi, '').trim();
    return limpo || 'Outro';
  }
}
