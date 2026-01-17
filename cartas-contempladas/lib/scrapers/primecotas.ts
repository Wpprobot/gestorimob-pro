import { BaseScraper } from './base';
import { CartaContemplada } from '../types';
import * as cheerio from 'cheerio';

export class PrimeCotasScraper extends BaseScraper {
  constructor() {
    super('Prime Cotas Contempladas', 'https://primecotascontempladas.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML('/');
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Seções separadas por categoria
      const scrapeSection = (sectionId: string, tipo: 'imovel' | 'veiculo') => {
        $(`#${sectionId} .row`).each((_, row) => {
          try {
            const $row = $(row);
            
            // Procurar botão de negociação para confirmar que é um item
            const btn = $row.find('.btn-negociar');
            if (!btn.length) return;

            const rowText = $row.text();
            
            // Extrair dados do texto usando regex
            const adminMatch = rowText.match(/ADM[:\s]*([A-Za-zÀ-ú\s]+?)(?:\s*CRÉDITO|$)/i);
            const creditoMatch = rowText.match(/CRÉDITO[:\s]*R?\$?\s*([\d.,]+)/i);
            const entradaMatch = rowText.match(/ENTRADA[:\s]*R?\$?\s*([\d.,]+)/i);
            const parcelasMatch = rowText.match(/PARCELAS[:\s]*(\d+)\s*x\s*R?\$?\s*([\d.,]+)/i);

            const credito = creditoMatch ? this.parseValor(creditoMatch[1]) : 0;
            const entrada = entradaMatch ? this.parseValor(entradaMatch[1]) : 0;
            const parcelas = parcelasMatch ? parseInt(parcelasMatch[1]) : 0;
            const parcela = parcelasMatch ? this.parseValor(parcelasMatch[2]) : 0;
            const administradora = adminMatch ? adminMatch[1].trim() : 'Itaú';

            if (!credito || credito === 0) return;

            cartas.push(this.criarCarta({
              tipo,
              valorCarta: credito,
              valorEntrada: entrada,
              valorParcela: parcela,
              numeroParcelas: parcelas,
              administradora,
              urlOriginal: this.urlBase,
            }));
          } catch (e) {
            // Skip on error
          }
        });
      };

      // Scrape ambas as seções
      scrapeSection('cotas-automovel', 'veiculo');
      scrapeSection('cotas-imovel', 'imovel');

      console.log(`[${this.nome}] Extraídas ${cartas.length} cartas`);
      return cartas;
    } catch (error) {
      console.error(`[${this.nome}] Erro no scraping:`, error);
      return [];
    }
  }
}
