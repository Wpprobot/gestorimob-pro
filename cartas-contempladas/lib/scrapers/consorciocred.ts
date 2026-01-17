import puppeteer, { Browser, Page } from 'puppeteer';
import { CartaContemplada, TipoCarta } from '../types';
import crypto from 'crypto';

/**
 * Scraper para ConsorcioCred usando Puppeteer
 */
export class ConsorciocredScraper {
  protected nome = 'ConsorcioCred';
  protected urlBase = 'https://consorciocred.com.br';
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

      const url = `${this.urlBase}/carta-de-credito-contemplada`;
      console.log(`[${this.nome}] Navegando para: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle2' });
      await this.delay(3000);

      // Extrai dados dos cards de cartas
      const cartasData = await page.evaluate((vendedor: string, urlBase: string) => {
        const results: any[] = [];
        
        // Procura por cards de cartas
        const cards = document.querySelectorAll('[class*="card"], [class*="cota"], .item');
        
        cards.forEach(card => {
          const texto = card.textContent || '';
          
          // Procura padrões de valores
          const creditoMatch = texto.match(/(?:crédito|valor)[:\s]*(R?\$?\s*[\d.,]+)/i) ||
                               texto.match(/R\$\s*([\d.,]+(?:\.\d{3})*)/);
          
          if (!creditoMatch) return;
          
          const valorTexto = creditoMatch[1] || creditoMatch[0];
          const valor = parseFloat(valorTexto.replace(/[R$\s.]/g, '').replace(',', '.'));
          
          if (valor < 10000) return;
          
          // Tenta extrair entrada
          const entradaMatch = texto.match(/(?:entrada|ágio)[:\s]*(R?\$?\s*[\d.,]+)/i);
          const entrada = entradaMatch ? 
            parseFloat(entradaMatch[1].replace(/[R$\s.]/g, '').replace(',', '.')) : 0;
          
          // Tenta extrair parcelas
          const parcelasMatch = texto.match(/(\d+)\s*[xX]\s*R?\$?\s*([\d.,]+)/);
          const parcelas = parcelasMatch ? parseInt(parcelasMatch[1]) : 0;
          const valorParcela = parcelasMatch ? 
            parseFloat(parcelasMatch[2].replace(/[.]/g, '').replace(',', '.')) : 0;
          
          // Administradora
          const adminMatch = texto.match(/(Bradesco|Itaú|Porto\s*Seguro|Caixa|Rodobens|Embracon|Santander)/i);
          
          results.push({
            tipo: valor > 100000 ? 'imovel' : 'veiculo',
            valorCarta: valor,
            valorEntrada: entrada,
            numeroParcelas: parcelas,
            valorParcela: valorParcela,
            administradora: adminMatch ? adminMatch[1] : 'Outro',
            urlOriginal: urlBase + '/carta-de-credito-contemplada',
            vendedor: vendedor,
          });
        });
        
        return results;
      }, this.nome, this.urlBase);

      cartas.push(...cartasData.map(c => this.criarCarta(c)));
      console.log(`[${this.nome}] Cartas: ${cartas.length}`);
      
    } catch (error) {
      console.error(`[${this.nome}] Erro:`, error);
    } finally {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    }

    console.log(`[${this.nome}] Total: ${cartas.length} cartas coletadas`);
    return cartas;
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
