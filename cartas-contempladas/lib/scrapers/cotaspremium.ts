import puppeteer, { Browser, Page } from 'puppeteer';
import { CartaContemplada, TipoCarta } from '../types';
import crypto from 'crypto';

/**
 * Scraper para Cotas Premium usando Puppeteer (para contornar proteção anti-bot)
 */
export class CotasPremiumScraper {
  protected nome = 'Cotas Premium';
  protected urlBase = 'https://cotaspremium.com.br';
  private browser: Browser | null = null;

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];
    
    try {
      // Inicia o navegador
      console.log(`[${this.nome}] Iniciando navegador Puppeteer...`);
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
        ],
      });

      const page = await this.browser.newPage();
      
      // Configura headers para parecer navegador real
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Adiciona delay entre requisições
      await page.setDefaultNavigationTimeout(60000);

      // Scrape imóveis
      try {
        const imoveisCartas = await this.scrapePage(page, '/servicos/cartas-contempladas-de-imoveis/', 'imovel');
        cartas.push(...imoveisCartas);
        console.log(`[${this.nome}] Imóveis: ${imoveisCartas.length} cartas`);
      } catch (error) {
        console.error(`[${this.nome}] Erro ao buscar imóveis:`, error);
      }

      // Scrape veículos
      try {
        const veiculosCartas = await this.scrapePage(page, '/cartas-contempladas-de-automoveis/', 'veiculo');
        cartas.push(...veiculosCartas);
        console.log(`[${this.nome}] Veículos: ${veiculosCartas.length} cartas`);
      } catch (error) {
        console.error(`[${this.nome}] Erro ao buscar veículos:`, error);
      }

      console.log(`[${this.nome}] Total: ${cartas.length} cartas coletadas`);
      
    } catch (error) {
      console.error(`[${this.nome}] Erro geral:`, error);
    } finally {
      // Fecha o navegador
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    }

    return cartas;
  }

  /**
   * Faz scraping de uma página específica
   */
  private async scrapePage(page: Page, path: string, tipo: TipoCarta): Promise<CartaContemplada[]> {
    const url = this.urlBase + path;
    console.log(`[${this.nome}] Navegando para: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Espera a tabela carregar
    await page.waitForSelector('table', { timeout: 15000 }).catch(() => {
      console.log(`[${this.nome}] Tabela não encontrada em ${path}`);
    });
    
    // Espera adicional para JavaScript carregar dados
    await this.delay(3000);

    // Extrai dados da tabela via JavaScript no contexto da página
    const cartas = await page.evaluate((tipoParam: string, urlOriginal: string, vendedor: string) => {
      const results: any[] = [];
      
      // Procura por todas as tabelas
      const tabelas = document.querySelectorAll('table');
      
      tabelas.forEach(tabela => {
        const rows = tabela.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 5) return;
          
          // Tenta extrair dados das colunas
          const textos = Array.from(cells).map(cell => cell.textContent?.trim() || '');
          
          // Procura por valores monetários (R$ ou números grandes)
          let credito = 0;
          let entrada = 0;
          let parcelas = 0;
          let valorParcela = 0;
          let administradora = '';
          
          textos.forEach((texto, idx) => {
            // Detecta valor de crédito (geralmente maior valor)
            const valorMatch = texto.match(/R?\$?\s*([\d.,]+)/);
            if (valorMatch) {
              const valor = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
              
              if (valor > 10000 && credito === 0) {
                credito = valor;
              } else if (valor > 1000 && entrada === 0 && credito > 0) {
                entrada = valor;
              }
            }
            
            // Detecta parcelas (formato: "198 x R$ 431")
            const parcelasMatch = texto.match(/(\d+)\s*[xX]\s*R?\$?\s*([\d.,]+)/);
            if (parcelasMatch) {
              parcelas = parseInt(parcelasMatch[1]);
              valorParcela = parseFloat(parcelasMatch[2].replace(/\./g, '').replace(',', '.'));
            }
            
            // Primeira coluna geralmente é código, segunda é administradora
            if (idx === 1 && texto.length > 2 && !texto.includes('R$')) {
              administradora = texto;
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

    // Converte para CartaContemplada com ID único
    return cartas.map(carta => this.criarCarta(carta));
  }

  /**
   * Cria uma carta com ID único
   */
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

  /**
   * Gera ID único baseado nos dados da carta
   */
  private gerarIdUnico(dados: Partial<CartaContemplada>): string {
    const identificador = [
      dados.valorCarta || 0,
      dados.administradora || 'Outro',
      this.nome,
      dados.grupo || '',
      dados.cota || '',
      dados.valorEntrada || 0,
      dados.numeroParcelas || 0,
      dados.valorParcela || 0,
    ].join('|');
    
    return crypto.createHash('md5').update(identificador).digest('hex');
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
