import { BaseScraper } from './base';
import { CartaContemplada } from '../types';
import * as cheerio from 'cheerio';

export class LizzyPrimeScraper extends BaseScraper {
  constructor() {
    super('Lizzy Prime Financial', 'https://lizzyprime.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML('/carta-contemplada/');
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Tabela DataTables #listaCompleta
      // Colunas: checkbox, Segmento, Administradora, Crédito, Entrada, Parcelas, Valor parcela
      $('#listaCompleta tbody tr').each((_, row) => {
        try {
          const cells = $(row).find('td');
          if (cells.length < 7) return;

          const segmento = $(cells[1]).text().trim().toLowerCase();
          const administradora = $(cells[2]).text().trim();
          const creditoText = $(cells[3]).text().trim();
          const entradaText = $(cells[4]).text().trim();
          const parcelasText = $(cells[5]).text().trim();
          const valorParcelaText = $(cells[6]).text().trim();

          const credito = this.parseValor(creditoText);
          const entrada = this.parseValor(entradaText);
          const parcelas = this.parseParcelas(parcelasText);
          const parcela = this.parseValor(valorParcelaText);

          if (!credito || credito === 0) return;

          const tipo = this.detectarTipo(segmento);

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: administradora || 'Outro',
            urlOriginal: `${this.urlBase}/carta-contemplada/`,
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
