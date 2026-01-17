import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';
import * as cheerio from 'cheerio';

export class ContemplaDosSPScraper extends BaseScraper {
  constructor() {
    super('Contemplados SP', 'https://www.contempladosp.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartasImoveis = await this.scrapeCategoria('/cartas-de-credito-contemplada-de-imoveis', 'imovel');
    const cartasVeiculos = await this.scrapeCategoria('/cartas-de-credito-contemplada-de-veiculos', 'veiculo');
    
    const todasCartas = [...cartasImoveis, ...cartasVeiculos];
    console.log(`[${this.nome}] Extraídas ${todasCartas.length} cartas (${cartasImoveis.length} imóveis, ${cartasVeiculos.length} veículos)`);
    
    return todasCartas;
  }

  private async scrapeCategoria(path: string, tipo: TipoCarta): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML(path);
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Tabela com classe cotaContemplada
      $('tr.cotaContemplada').each((_, row) => {
        try {
          const cells = $(row).find('td');
          if (cells.length < 5) return;

          const creditoText = $(cells[0]).text().trim();
          const entradaText = $(cells[1]).text().trim();
          const parcelasText = $(cells[2]).text().trim();
          const administradora = $(cells[3]).text().trim();
          const situacao = $(cells[4]).text().trim().toLowerCase();

          // Pular se não disponível
          if (situacao.includes('reservad') || situacao.includes('vendid')) return;

          const credito = this.parseValor(creditoText);
          const entrada = this.parseValor(entradaText);

          // Parsear parcelas (formato: "42 x 671,00")
          let parcelas = 0;
          let parcela = 0;
          const parcelasMatch = parcelasText.match(/(\d+)\s*x\s*([\d.,]+)/);
          if (parcelasMatch) {
            parcelas = parseInt(parcelasMatch[1]);
            parcela = this.parseValor(parcelasMatch[2]);
          }

          if (!credito || credito === 0) return;

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: administradora || 'Outro',
            urlOriginal: `${this.urlBase}${path}`,
          }));
        } catch (e) {
          // Skip on error
        }
      });

      return cartas;
    } catch (error) {
      console.error(`[${this.nome}] Erro no scraping de ${path}:`, error);
      return [];
    }
  }
}
