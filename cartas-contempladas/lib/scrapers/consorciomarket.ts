import { BaseScraper } from './base';
import { CartaContemplada } from '../types';
import * as cheerio from 'cheerio';

export class ConsorcioMarketScraper extends BaseScraper {
  constructor() {
    super('Consórcio Market', 'https://www.consorciomarket.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML('/cotas');
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Tabela com estrutura de colunas específica
      // 0: Administradora, 1: Crédito, 2: Saldo Devedor, 3: Parcelas, 4: Valor Parcela, 5: Entrada
      $('tbody tr').each((_, row) => {
        try {
          const cells = $(row).find('td');
          if (cells.length < 6) return;

          const administradora = $(cells[0]).text().trim();
          const creditoText = $(cells[1]).text().trim();
          const parcelasText = $(cells[3]).text().trim();
          const valorParcelaText = $(cells[4]).text().trim();
          const entradaText = $(cells[5]).text().trim();

          const credito = this.parseValor(creditoText);
          const entrada = this.parseValor(entradaText);
          const parcela = this.parseValor(valorParcelaText);
          const parcelas = this.parseParcelas(parcelasText);

          if (!credito || credito === 0) return;

          // Determinar tipo pelo valor
          const tipo = credito >= 100000 ? 'imovel' : credito >= 30000 ? 'veiculo' : 'moto';

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: administradora || 'Outro',
            urlOriginal: `${this.urlBase}/cotas`,
          }));
        } catch (e) {
          // Skip on error
        }
      });

      console.log(`[${this.nome}] Extraídas ${cartas.length} cartas`);
      return cartas;
    } catch (error) {
      console.error(`[${this.nome}] Erro no scraping:`, error);
      return [];
    }
  }
}
