import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';

export class BolsaDoConsorcioScraper extends BaseScraper {
  constructor() {
    super('Bolsa do Consórcio', 'https://www.bolsadoconsorcio.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];

    // A Bolsa do Consórcio tem uma página principal que lista todas as cotas
    // com a possibilidade de filtrar por tipo
    try {
      const html = await this.fetchHTML('/categoria-cota/cotas-contempladas/');
      const todasCartas = this.parseTabela(html);
      cartas.push(...todasCartas);
      console.log(`[Bolsa do Consórcio] Total: ${todasCartas.length} cartas encontradas`);
    } catch (error) {
      console.error('[Bolsa do Consórcio] Erro ao buscar cartas:', error);
    }

    return cartas;
  }

  /**
   * Parse da tabela #CotasTable da Bolsa do Consórcio
   * Estrutura (índices baseados em 0):
   * - Coluna 0: Administradora (ITAÚ, BRADESCO, MYCON)
   * - Coluna 1: Tipo (Autos, Imóveis)
   * - Coluna 2: Crédito (39.464,00)
   * - Coluna 3: Entrada/Ágio (18.790,00)
   * - Coluna 4: Parcelas (186 X 255) - formato: [num] X [valor]
   * - Coluna 5: Próxima Parcela (275,00)
   * - Coluna 10: Vendedor/Parceiro
   */
  private parseTabela(html: string): CartaContemplada[] {
    const $ = this.parseHTML(html);
    const cartas: CartaContemplada[] = [];

    // Seletor principal: tabela com id "CotasTable"
    const tabela = $('table#CotasTable, table.dataTable, table');
    
    if (tabela.length === 0) {
      console.log('[Bolsa do Consórcio] Tabela não encontrada');
      return cartas;
    }

    // Itera sobre as linhas do tbody
    tabela.find('tbody tr').each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length < 6) return; // Precisa de pelo menos 6 colunas

      // Extrai dados das colunas
      const administradora = $(cells[0]).text().trim();
      const tipoText = $(cells[1]).text().trim().toLowerCase();
      const creditoText = $(cells[2]).text().trim();
      const entradaText = $(cells[3]).text().trim();
      const parcelasText = $(cells[4]).text().trim();
      const vendedor = cells.length >= 11 ? $(cells[10]).text().trim() : '';

      // Determina o tipo
      let tipo: TipoCarta = 'veiculo';
      if (tipoText.includes('imóv') || tipoText.includes('imov')) {
        tipo = 'imovel';
      } else if (tipoText.includes('pesad')) {
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
          urlOriginal: this.urlBase + '/categoria-cota/cotas-contempladas/',
          descricao: vendedor ? `Via ${vendedor} - ${administradora}` : `${administradora}`,
        }));
      }
    });

    return cartas;
  }

  /**
   * Parse das parcelas no formato "186 X 255" ou "120 x 1.200,00"
   */
  private parseParcelasComValor(parcelasText: string): { parcelas: number; valorParcela: number } {
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
