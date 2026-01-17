import { BaseScraper } from './base';
import { CartaContemplada } from '../types';
import * as cheerio from 'cheerio';

export class ContempladasBrasilScraper extends BaseScraper {
  constructor() {
    super('Contempladas Brasil', 'https://contempladas.contempladasbrasil.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML('/?segmento=todos');
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Inputs com data-attributes
      $('input.check-soma').each((_, input) => {
        try {
          const $input = $(input);
          
          const administradora = $input.attr('data-administradora') || '';
          const categoria = ($input.attr('data-categoria') || '').toLowerCase();
          const creditoStr = $input.attr('data-credito') || '';
          const entradaStr = $input.attr('data-entrada') || '';
          const prazoStr = $input.attr('data-prazo') || '';
          const parcelaStr = $input.attr('data-valor-parcela') || '';

          const credito = parseFloat(creditoStr) || 0;
          const entrada = parseFloat(entradaStr) || 0;
          const parcela = parseFloat(parcelaStr) || 0;
          const parcelas = parseInt(prazoStr) || 0;

          if (!credito || credito === 0) return;

          const tipo = this.detectarTipo(categoria);

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: administradora || 'Outro',
            urlOriginal: `${this.urlBase}/?segmento=todos`,
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
