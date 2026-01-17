import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';
import * as cheerio from 'cheerio';

export class CotasContempladasScraper extends BaseScraper {
  constructor() {
    super('Cotas Contempladas', 'https://www.cotascontempladas.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartasImoveis = await this.scrapeCategoria('/cotas-de-imoveis/', 'imovel');
    const cartasVeiculos = await this.scrapeCategoria('/cotas-de-veiculos/', 'veiculo');
    
    const todasCartas = [...cartasImoveis, ...cartasVeiculos];
    console.log(`[${this.nome}] Extraídas ${todasCartas.length} cartas (${cartasImoveis.length} imóveis, ${cartasVeiculos.length} veículos)`);
    
    return todasCartas;
  }

  private async scrapeCategoria(path: string, tipo: TipoCarta): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML(path);
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Tabela simples com índices de coluna
      $('table tbody tr').each((_, row) => {
        try {
          const cells = $(row).find('td');
          if (cells.length < 6) return;

          const creditoText = $(cells[1]).text().trim();
          const entradaText = $(cells[2]).text().trim();
          const saldoDevedorText = $(cells[3]).text().trim();
          const administradora = $(cells[5]).text().trim();
          const link = $(cells[6])?.find('a').attr('href') || '';

          const credito = this.parseValor(creditoText);
          const entrada = this.parseValor(entradaText);

          // Parsear saldo devedor (formato: "67 x 19.060,00")
          let parcelas = 0;
          let parcela = 0;
          const parcelasMatch = saldoDevedorText.match(/(\d+)\s*x\s*([\d.,]+)/);
          if (parcelasMatch) {
            parcelas = parseInt(parcelasMatch[1]);
            parcela = this.parseValor(parcelasMatch[2]);
          }

          if (!credito || credito === 0) return;

          const fullUrl = link.startsWith('http') 
            ? link 
            : link ? `${this.urlBase}${link}` : `${this.urlBase}${path}`;

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: administradora || 'Outro',
            urlOriginal: fullUrl,
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
