import puppeteer, { Browser, Page } from 'puppeteer';
import { CartaContemplada, TipoCarta } from '../types';
import crypto from 'crypto';

/**
 * Scraper para Tramontana Consórcios usando Puppeteer
 */
export class TramontanaScraper {
  protected nome = 'Tramontana Consórcios';
  protected urlBase = 'https://tramontanaconsorcios.com.br';
  private browser: Browser | null = null;

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];
    
    try {
      console.log(`[${this.nome}] Iniciando navegador Puppeteer...`);
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });

      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setDefaultNavigationTimeout(60000);

      // Tenta a página de cartas
      try {
        const cartasData = await this.scrapePage(page, '/cartas-contempladas/');
        cartas.push(...cartasData);
        console.log(`[${this.nome}] Cartas: ${cartasData.length}`);
      } catch (error) {
        console.error(`[${this.nome}] Erro ao buscar cartas:`, error);
      }

      console.log(`[${this.nome}] Total: ${cartas.length} cartas coletadas`);
      
    } catch (error) {
      console.error(`[${this.nome}] Erro geral:`, error);
    } finally {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    }

    return cartas;
  }

  private async scrapePage(page: Page, path: string): Promise<CartaContemplada[]> {
    const url = this.urlBase + path;
    console.log(`[${this.nome}] Navegando para: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
      console.log(`[${this.nome}] Timeout ou erro de navegação`);
      return [];
    }
    
    await this.delay(3000);

    const cartas = await page.evaluate((vendedor: string, urlOriginal: string) => {
      const results: any[] = [];
      
      // Tenta encontrar cards ou tabelas
      const textoCompleto = document.body.innerText;
      
      // Procura padrões de cartas no texto
      const matches = textoCompleto.match(/(?:crédito|valor)[:\s]*R?\$?\s*([\d.,]+)(?:[\s\S]*?)(?:entrada|ágio)[:\s]*R?\$?\s*([\d.,]+)/gi);
      
      if (matches) {
        matches.forEach(match => {
          const creditoMatch = match.match(/R?\$?\s*([\d.,]+(?:\.\d{3})*)/);
          if (creditoMatch) {
            const valor = parseFloat(creditoMatch[1].replace(/\./g, '').replace(',', '.'));
            if (valor > 10000) {
              results.push({
                tipo: valor > 100000 ? 'imovel' : 'veiculo',
                valorCarta: valor,
                valorEntrada: 0,
                numeroParcelas: 0,
                valorParcela: 0,
                administradora: 'Outro',
                urlOriginal: urlOriginal,
                vendedor: vendedor,
              });
            }
          }
        });
      }
      
      // Tenta tabelas
      document.querySelectorAll('table tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return;
        
        const valores: number[] = [];
        cells.forEach(cell => {
          const match = cell.textContent?.match(/R?\$?\s*([\d.,]+)/);
          if (match) {
            valores.push(parseFloat(match[1].replace(/\./g, '').replace(',', '.')));
          }
        });
        
        if (valores.length > 0 && valores[0] > 10000) {
          results.push({
            tipo: valores[0] > 100000 ? 'imovel' : 'veiculo',
            valorCarta: valores[0],
            valorEntrada: valores[1] || 0,
            numeroParcelas: 0,
            valorParcela: 0,
            administradora: 'Outro',
            urlOriginal: urlOriginal,
            vendedor: vendedor,
          });
        }
      });
      
      return results;
    }, this.nome, url);

    return cartas.map(carta => this.criarCarta(carta));
  }

  private criarCarta(dados: Partial<CartaContemplada>): CartaContemplada {
    const id = crypto.createHash('md5').update([
      dados.valorCarta || 0,
      dados.administradora || 'Outro',
      this.nome,
      dados.valorEntrada || 0,
    ].join('|')).digest('hex');

    return {
      id,
      tipo: dados.tipo || 'imovel',
      valorCarta: dados.valorCarta || 0,
      valorEntrada: dados.valorEntrada || 0,
      numeroParcelas: dados.numeroParcelas || 0,
      valorParcela: dados.valorParcela || 0,
      taxaAdministracao: dados.taxaAdministracao,
      administradora: dados.administradora || 'Outro',
      vendedor: this.nome,
      urlOriginal: dados.urlOriginal || this.urlBase,
      dataAtualizacao: new Date().toISOString(),
      descricao: dados.descricao,
      grupo: dados.grupo,
      cota: dados.cota,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
