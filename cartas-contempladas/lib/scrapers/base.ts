import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { CartaContemplada, TipoCarta } from '../types';
import crypto from 'crypto';

// Headers para simular navegador real
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
};

export abstract class BaseScraper {
  protected nome: string;
  protected urlBase: string;
  protected client: AxiosInstance;
  
  constructor(nome: string, urlBase: string) {
    this.nome = nome;
    this.urlBase = urlBase;
    this.client = axios.create({
      baseURL: urlBase,
      headers: BROWSER_HEADERS,
      timeout: 30000,
    });
  }

  /**
   * Busca o HTML de uma URL
   */
  protected async fetchHTML(path: string): Promise<string> {
    try {
      // Rate limiting - espera entre 1-3 segundos
      await this.delay(1000 + Math.random() * 2000);
      
      const response = await this.client.get(path);
      return response.data;
    } catch (error) {
      console.error(`[${this.nome}] Erro ao buscar ${path}:`, error);
      throw error;
    }
  }

  /**
   * Faz parsing do HTML usando Cheerio
   */
  protected parseHTML(html: string): cheerio.CheerioAPI {
    return cheerio.load(html);
  }

  /**
   * Delay helper para rate limiting
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Converte string de valor monetário para número
   * Ex: "R$ 250.000,00" -> 250000
   */
  protected parseValor(valorStr: string): number {
    if (!valorStr) return 0;
    
    // Remove "R$", espaços e caracteres não numéricos exceto vírgula e ponto
    const cleaned = valorStr
      .replace(/R\$\s*/gi, '')
      .replace(/\s/g, '')
      .trim();
    
    // Formato brasileiro: 250.000,00
    // Remove pontos de milhar e troca vírgula por ponto
    const normalized = cleaned
      .replace(/\./g, '')
      .replace(',', '.');
    
    const valor = parseFloat(normalized);
    return isNaN(valor) ? 0 : valor;
  }

  /**
   * Extrai número de parcelas de uma string
   * Ex: "120 parcelas" -> 120, "48x" -> 48
   */
  protected parseParcelas(parcelasStr: string): number {
    if (!parcelasStr) return 0;
    
    const match = parcelasStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Extrai percentual de uma string
   * Ex: "15%" -> 15, "12,5%" -> 12.5
   */
  protected parsePercentual(percStr: string): number {
    if (!percStr) return 0;
    
    const cleaned = percStr.replace('%', '').replace(',', '.').trim();
    const valor = parseFloat(cleaned);
    return isNaN(valor) ? 0 : valor;
  }

  /**
   * Detecta o tipo de carta a partir de texto
   */
  protected detectarTipo(texto: string): TipoCarta {
    const lower = texto.toLowerCase();
    
    if (lower.includes('imóvel') || lower.includes('imovel') || lower.includes('imobiliário') || lower.includes('casa') || lower.includes('apartamento')) {
      return 'imovel';
    }
    if (lower.includes('pesado') || lower.includes('caminhão') || lower.includes('caminhao') || lower.includes('ônibus') || lower.includes('onibus') || lower.includes('carreta')) {
      return 'pesado';
    }
    if (lower.includes('moto') || lower.includes('motocicleta')) {
      return 'moto';
    }
    // Default para veículo
    return 'veiculo';
  }

  /**
   * Detecta a administradora a partir de texto
   */
  protected detectarAdministradora(texto: string): string {
    const lower = texto.toLowerCase();
    
    const administradoras: Record<string, string> = {
      'bradesco': 'Bradesco',
      'itau': 'Itaú',
      'itaú': 'Itaú',
      'caixa': 'Caixa',
      'santander': 'Santander',
      'porto': 'Porto Seguro',
      'rodobens': 'Rodobens',
      'embracon': 'Embracon',
      'ademilar': 'Ademilar',
      'volkswagen': 'Volkswagen',
      'vw': 'Volkswagen',
      'honda': 'Honda',
      'yamaha': 'Yamaha',
      'randon': 'Randon',
      'bancorbras': 'Bancorbrás',
      'sicredi': 'Sicredi',
      'mycon': 'Mycon',
    };

    for (const [key, value] of Object.entries(administradoras)) {
      if (lower.includes(key)) {
        return value;
      }
    }
    
    return 'Outro';
  }

  /**
   * Gera ID único e determinístico baseado nos dados da carta
   * Mesmos dados = mesmo ID (evita duplicatas)
   * Inclui TODAS as características que tornam uma carta única
   */
  protected gerarIdUnico(dados: Partial<CartaContemplada>): string {
    // Cria string única baseada em TODOS os dados identificadores da carta
    const identificador = [
      dados.valorCarta || 0,
      dados.administradora || 'Outro',
      this.nome, // vendedor
      dados.grupo || '',
      dados.cota || '',
      dados.valorEntrada || 0,
      dados.numeroParcelas || 0,     // ⭐ ADICIONADO
      dados.valorParcela || 0,        // ⭐ ADICIONADO
    ].join('|');
    
    // Gera hash MD5 determinístico
    return crypto.createHash('md5').update(identificador).digest('hex');
  }

  /**
   * Cria um objeto de carta com valores padrão
   */
  protected criarCarta(dados: Partial<CartaContemplada>): CartaContemplada {
    return {
      id: this.gerarIdUnico(dados), // ID determinístico ao invés de aleatório
      tipo: dados.tipo || 'veiculo',
      valorCarta: dados.valorCarta || 0,
      valorEntrada: dados.valorEntrada || 0,
      numeroParcelas: dados.numeroParcelas || 0,
      valorParcela: dados.valorParcela || 0,
      taxaAdministracao: dados.taxaAdministracao,
      administradora: dados.administradora || 'Outro',
      vendedor: this.nome,
      urlOriginal: dados.urlOriginal || this.urlBase,
      dataAtualizacao: new Date(),
      descricao: dados.descricao,
      grupo: dados.grupo,
      cota: dados.cota,
    };
  }

  /**
   * Método abstrato - cada scraper implementa sua lógica específica
   */
  abstract scrape(): Promise<CartaContemplada[]>;

  /**
   * Retorna o nome do scraper
   */
  getNome(): string {
    return this.nome;
  }

  /**
   * Retorna a URL base do scraper
   */
  getUrl(): string {
    return this.urlBase;
  }
}
