import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';

export class UnicontemplaDosScraper extends BaseScraper {
  constructor() {
    super('Unicontemplados', 'https://unicontemplados.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];

    const categorias: { url: string; tipo: TipoCarta }[] = [
      { url: '/imobiliario', tipo: 'imovel' },
      { url: '/veiculos', tipo: 'veiculo' },
    ];

    for (const categoria of categorias) {
      try {
        const html = await this.fetchHTML(categoria.url);
        const cartasCategoria = this.parseTabela(html, categoria.tipo, categoria.url);
        cartas.push(...cartasCategoria);
        console.log(`[Unicontemplados] ${categoria.tipo}: ${cartasCategoria.length} cartas encontradas`);
      } catch (error) {
        console.error(`[Unicontemplados] Erro ao buscar ${categoria.tipo}:`, error);
      }
    }

    return cartas;
  }

  /**
   * Parse da tabela do Unicontemplados
   * Estrutura (índices baseados em 0):
   * - Coluna 0: CRÉDITO (R$57.200,00)
   * - Coluna 1: ENTRADA (R$25.500,00)  
   * - Coluna 2: PARCELAS (154 x R$409,00)
   * - Coluna 3: TAXA DE TRANSFERÊNCIA
   * - Coluna 4: ADMINISTRADORA (Caixa Consórcios)
   * - Coluna 5: VENCIMENTO DA PARCELA
   * - Coluna 6: OBSERVAÇÕES
   */
  private parseTabela(html: string, tipoDefault: TipoCarta, path: string): CartaContemplada[] {
    const $ = this.parseHTML(html);
    const cartas: CartaContemplada[] = [];

    // Busca a tabela de dados
    const tabela = $('table.dataTable, table');
    
    if (tabela.length === 0) {
      console.log('[Unicontemplados] Tabela não encontrada');
      return cartas;
    }

    // Itera sobre as linhas do tbody
    tabela.find('tbody tr, tr').each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      // Precisa de pelo menos 5 colunas para ter todos os dados necessários
      if (cells.length < 5) return;

      // Extrai dados das colunas
      const creditoText = $(cells[0]).text().trim();
      const entradaText = $(cells[1]).text().trim();
      const parcelasText = $(cells[2]).text().trim();
      const administradora = $(cells[4]).text().trim();

      // Parse dos valores
      const valorCarta = this.parseValor(creditoText);
      const valorEntrada = this.parseValor(entradaText);
      const { parcelas, valorParcela } = this.parseParcelasComValor(parcelasText);

      // Só adiciona se tem valor válido
      if (valorCarta > 0) {
        cartas.push(this.criarCarta({
          tipo: tipoDefault,
          valorCarta,
          valorEntrada,
          numeroParcelas: parcelas,
          valorParcela,
          administradora: administradora || 'Outro',
          urlOriginal: this.urlBase + path,
          descricao: `Carta ${tipoDefault === 'imovel' ? 'Imóvel' : 'Veículo'} - ${administradora}`,
        }));
      }
    });

    return cartas;
  }

  /**
   * Parse das parcelas no formato "154 x R$409,00"
   */
  private parseParcelasComValor(parcelasText: string): { parcelas: number; valorParcela: number } {
    const match = parcelasText.match(/(\d+)\s*[xX]\s*R?\$?\s*([\d.,]+)/);
    
    if (match) {
      return {
        parcelas: parseInt(match[1], 10),
        valorParcela: this.parseValor(match[2]),
      };
    }
    
    return { parcelas: 0, valorParcela: 0 };
  }
}
