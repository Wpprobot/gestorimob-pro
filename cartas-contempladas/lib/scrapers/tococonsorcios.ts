import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';
import * as cheerio from 'cheerio';

export class TocoConsorciosScraper extends BaseScraper {
  constructor() {
    super('Toco Consórcios', 'https://tococonsorcios.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML('/contempladas/');
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Tabela ninja_table_pro com estrutura específica
      $('table.ninja_table_pro tbody tr, table tbody tr').each((_, row) => {
        try {
          const cells = $(row).find('td');
          if (cells.length < 8) return;

          // Índices: 2=Categoria, 3=Crédito, 4=Entrada, 5=Prazo, 6=Parcela, 7=Admin, 14=Status
          const categoria = $(cells[2]).text().trim().toLowerCase();
          const creditoText = $(cells[3]).text().trim();
          const entradaText = $(cells[4]).text().trim();
          const prazoText = $(cells[5]).text().trim();
          const parcelaText = $(cells[6]).text().trim();
          const administradora = $(cells[7]).text().trim();
          const status = cells.length > 14 ? $(cells[14]).text().trim().toLowerCase() : 'disponível';

          // Pular se não disponível
          if (status.includes('reservad') || status.includes('vendid')) return;

          const credito = this.parseValor(creditoText);
          const entrada = this.parseValor(entradaText);
          const parcela = this.parseValor(parcelaText);
          const parcelas = this.parseParcelas(prazoText);

          if (!credito || credito === 0) return;

          const tipo = this.detectarTipo(categoria);

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: administradora || 'Outro',
            urlOriginal: `${this.urlBase}/contempladas/`,
          }));
        } catch (e) {
          // Skip row on error
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
