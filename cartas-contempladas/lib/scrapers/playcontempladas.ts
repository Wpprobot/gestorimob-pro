import { BaseScraper } from './base';
import { CartaContemplada } from '../types';

export class PlayContempladasScraper extends BaseScraper {
  constructor() {
    // Nova URL base - dados mudaram para subdomínio
    super('Play Contempladas', 'https://contempladas.playcontempladas.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];

    try {
      // Busca página com todos os segmentos
      const html = await this.fetchHTML('/?segmento=todos');
      const $ = this.parseHTML(html);

      // Os dados estão dentro dos links de WhatsApp em formato URL-encoded
      // Ex: Administradora%3A%20Porto%20Seguro%0ACrédito%3A%20R%24%2049.000%2C00
      $('a[href*="api.whatsapp.com"]').each((_, link) => {
        try {
          const href = $(link).attr('href') || '';
          
          // Extrai o texto do parâmetro "text"
          const textMatch = href.match(/text=([^&]+)/);
          if (!textMatch) return;
          
          // Decodifica o texto URL-encoded
          const texto = decodeURIComponent(textMatch[1]);
          
          // Extrai dados usando regex
          const administradora = this.extrair(texto, /Administradora[:\s]+([^\n]+)/i);
          const segmento = this.extrair(texto, /Segmento[:\s]+([^\n]+)/i);
          const creditoStr = this.extrair(texto, /Crédito[:\s]+R?\$?\s*([\d.,]+)/i);
          const entradaStr = this.extrair(texto, /Entrada[:\s]+R?\$?\s*([\d.,]+)/i);
          const parcelamentoStr = this.extrair(texto, /Parcelamento[:\s]+(\d+)\s*x\s*R?\$?\s*([\d.,]+)/i);

          if (!creditoStr) return;

          const credito = this.parseValorTexto(creditoStr);
          const entrada = this.parseValorTexto(entradaStr);
          
          let parcelas = 0;
          let valorParcela = 0;
          
          // Parse do parcelamento (formato: "186 x R$ 255,00")
          const parcelasMatch = texto.match(/Parcelamento[:\s]+(\d+)\s*x\s*R?\$?\s*([\d.,]+)/i);
          if (parcelasMatch) {
            parcelas = parseInt(parcelasMatch[1]) || 0;
            valorParcela = this.parseValorTexto(parcelasMatch[2]);
          }

          if (credito > 0) {
            const tipo = segmento?.toLowerCase().includes('veículo') || 
                         segmento?.toLowerCase().includes('veiculo') ? 'veiculo' : 'imovel';

            cartas.push(this.criarCarta({
              tipo: tipo as 'imovel' | 'veiculo',
              valorCarta: credito,
              valorEntrada: entrada,
              numeroParcelas: parcelas,
              valorParcela,
              administradora: administradora || 'Outro',
              urlOriginal: this.urlBase + '/?segmento=' + (tipo === 'veiculo' ? 'veiculo' : 'imovel'),
            }));
          }
        } catch (e) {
          // Skip on error
        }
      });

      // Remove duplicatas (mesmo link pode aparecer múltiplas vezes)
      const cartasUnicas = this.removerDuplicatas(cartas);

      console.log(`[${this.nome}] Extraídas ${cartasUnicas.length} cartas únicas (de ${cartas.length} total)`);
      return cartasUnicas;
    } catch (error) {
      console.error(`[${this.nome}] Erro no scraping:`, error);
      return [];
    }
  }

  /**
   * Extrai valor de um regex
   */
  private extrair(texto: string, regex: RegExp): string {
    const match = texto.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Parse de valor monetário
   */
  private parseValorTexto(texto: string): number {
    if (!texto) return 0;
    // Remove R$, pontos de milhar, e converte vírgula decimal
    const limpo = texto.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
  }

  /**
   * Remove cartas duplicadas baseado no ID
   */
  private removerDuplicatas(cartas: CartaContemplada[]): CartaContemplada[] {
    const vistos = new Set<string>();
    return cartas.filter(carta => {
      if (vistos.has(carta.id)) return false;
      vistos.add(carta.id);
      return true;
    });
  }
}
