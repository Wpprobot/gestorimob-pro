import puppeteer, { Browser, Page } from 'puppeteer';
import { CartaContemplada, TipoCarta } from '../types';
import crypto from 'crypto';

/**
 * Scraper para iConsórcios usando Puppeteer (proteção anti-bot)
 */
export class IconsorciosScraper {
  protected nome = 'iConsórcios';
  protected urlBase = 'https://iconsorcios.com.br';
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

      // Scrape imóveis
      try {
        const imoveisCartas = await this.scrapePage(page, '/cartas-contempladas-imoveis/', 'imovel');
        cartas.push(...imoveisCartas);
        console.log(`[${this.nome}] Imóveis: ${imoveisCartas.length} cartas`);
      } catch (error) {
        console.error(`[${this.nome}] Erro ao buscar imóveis:`, error);
      }

      // Pequena pausa entre requisições
      await this.delay(2000);

      // Scrape veículos
      try {
        const veiculosCartas = await this.scrapePage(page, '/cartas-contempladas-veiculos/', 'veiculo');
        cartas.push(...veiculosCartas);
        console.log(`[${this.nome}] Veículos: ${veiculosCartas.length} cartas`);
      } catch (error) {
        console.error(`[${this.nome}] Erro ao buscar veículos:`, error);
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

  private async scrapePage(page: Page, path: string, tipo: TipoCarta): Promise<CartaContemplada[]> {
    const url = this.urlBase + path;
    console.log(`[${this.nome}] Navegando para: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('table', { timeout: 15000 }).catch(() => null);
    await this.delay(3000);

    const cartas = await page.evaluate((tipoParam: string, urlOriginal: string, vendedor: string) => {
      const results: any[] = [];
      const tabelas = document.querySelectorAll('table');
      
      tabelas.forEach(tabela => {
        const rows = tabela.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 4) return;
          
          const textos = Array.from(cells).map(cell => cell.textContent?.trim() || '');
          
          // Tenta identificar valores monetários
          let credito = 0;
          let entrada = 0;
          let parcelas = 0;
          let valorParcela = 0;
          let administradora = '';
          
          textos.forEach((texto, idx) => {
            // Parse valor (R$ XXX.XXX,XX)
            const valorMatch = texto.match(/R?\$?\s*([\d.]+,\d{2})/);
            if (valorMatch) {
              const valor = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
              if (valor > 10000 && credito === 0) {
                credito = valor;
              } else if (valor > 1000 && entrada === 0) {
                entrada = valor;
              }
            }
            
            // Parse parcelas (80x R$ 1.350,00)
            const parcelasMatch = texto.match(/(\d+)\s*[xX]\s*R?\$?\s*([\d.,]+)/);
            if (parcelasMatch) {
              parcelas = parseInt(parcelasMatch[1]);
              valorParcela = parseFloat(parcelasMatch[2].replace(/\./g, '').replace(',', '.'));
            }
            
            // Administradora (texto sem valores)
            if (!texto.includes('R$') && !texto.match(/^\d/) && texto.length > 2 && texto.length < 30) {
              if (!administradora) administradora = texto;
            }
          });
          
          if (credito > 0) {
            results.push({
              tipo: tipoParam,
              valorCarta: credito,
              valorEntrada: entrada,
              numeroParcelas: parcelas,
              valorParcela: valorParcela,
              administradora: administradora || 'Outro',
              urlOriginal: urlOriginal,
              vendedor: vendedor,
            });
          }
        });
      });
      
      return results;
    }, tipo, url, this.nome);

    return cartas.map(carta => this.criarCarta(carta));
  }

  private criarCarta(dados: Partial<CartaContemplada>): CartaContemplada {
    const id = this.gerarIdUnico(dados);
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

  private gerarIdUnico(dados: Partial<CartaContemplada>): string {
    const identificador = [
      dados.valorCarta || 0,
      dados.administradora || 'Outro',
      this.nome,
      dados.valorEntrada || 0,
      dados.numeroParcelas || 0,
      dados.valorParcela || 0,
    ].join('|');
    return crypto.createHash('md5').update(identificador).digest('hex');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
