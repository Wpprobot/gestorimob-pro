import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';

export class DFContemplaDosScraper extends BaseScraper {
  constructor() {
    super('DF Contemplados', 'https://dfcontemplados.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];

    // DF Contemplados tem página "todas" que lista todas as cartas
    try {
      const html = await this.fetchHTML('/todas-consorcios-contemplados');
      const todasCartas = this.parseTabela(html);
      cartas.push(...todasCartas);
      console.log(`[DF Contemplados] Total: ${todasCartas.length} cartas encontradas`);
    } catch (error) {
      console.error('[DF Contemplados] Erro ao buscar cartas:', error);
    }

    return cartas;
  }

  /**
   * Parse da tabela do DF Contemplados
   * Estrutura (índices baseados em 0):
   * - Coluna 0: Administradora (BANCORBRÁS, BR CONSÓRCIOS)
   * - Coluna 1: Crédito (R$ 39.600,00)
   * - Coluna 2: Entrada (R$ 18.000,00)
   * - Coluna 3: Parcelas (41 x 887)
   * - Coluna 4: ???
   * - Coluna 5: Tipo (Automóvel, Imóvel)
   */
  private parseTabela(html: string): CartaContemplada[] {
    const $ = this.parseHTML(html);
    const cartas: CartaContemplada[] = [];

    // Seletor: .table-responsive table
    const tabela = $('.table-responsive table, table');
    
    if (tabela.length === 0) {
      console.log('[DF Contemplados] Tabela não encontrada');
      return cartas;
    }

    // Itera sobre as linhas (pula o cabeçalho)
    tabela.find('tr').slice(1).each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length < 5) return;

      // Extrai dados das colunas
      const administradora = $(cells[0]).text().trim();
      const creditoText = $(cells[1]).text().trim();
      const entradaText = $(cells[2]).text().trim();
      const parcelasText = $(cells[3]).text().trim();
      const tipoText = cells.length >= 6 ? $(cells[5]).text().trim().toLowerCase() : '';

      // Determina o tipo
      let tipo: TipoCarta = 'veiculo';
      if (tipoText.includes('imóv') || tipoText.includes('imov')) {
        tipo = 'imovel';
      } else if (tipoText.includes('pesad') || tipoText.includes('caminh')) {
        tipo = 'pesado';
      } else if (tipoText.includes('moto')) {
        tipo = 'moto';
      }

      // Parse dos valores
      const valorCarta = this.parseValor(creditoText);
      const valorEntrada = this.parseValor(entradaText);
      const { parcelas, valorParcela } = this.parseParcelasComValor(parcelasText);

      // Só adiciona se tem valor válido
      if (valorCarta > 0) {
        cartas.push(this.criarCarta({
          tipo,
          valorCarta,
          valorEntrada,
          numeroParcelas: parcelas,
          valorParcela,
          administradora: administradora || 'Outro',
          urlOriginal: this.urlBase + '/todas-consorcios-contemplados',
          descricao: `${administradora} - ${tipo === 'imovel' ? 'Imóvel' : 'Veículo'}`,
        }));
      }
    });

    return cartas;
  }

  /**
   * Parse das parcelas no formato "41 x 887" ou "120 x 1.200"
   */
  private parseParcelasComValor(parcelasText: string): { parcelas: number; valorParcela: number } {
    // Formato pode ser "41 x 887" ou "41 x 887 mais 21 x 353"
    const match = parcelasText.match(/(\d+)\s*[xX]\s*([\d.,]+)/);
    
    if (match) {
      return {
        parcelas: parseInt(match[1], 10),
        valorParcela: this.parseValor(match[2]),
      };
    }
    
    return { parcelas: 0, valorParcela: 0 };
  }
}
