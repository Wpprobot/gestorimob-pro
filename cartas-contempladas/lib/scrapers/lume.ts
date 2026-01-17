import { BaseScraper } from './base';
import { CartaContemplada, TipoCarta } from '../types';

export class LumeScraper extends BaseScraper {
  constructor() {
    // URL correta do Grupo LuME
    super('Grupo LuME', 'https://cartascontempladas.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    const cartas: CartaContemplada[] = [];

    // Scrape imóveis
    try {
      const imoveisCartas = await this.scrapeCategoria('/consorcios-contemplados-de-imoveis/', 'imovel');
      cartas.push(...imoveisCartas);
      console.log(`[${this.nome}] Imóveis: ${imoveisCartas.length} cartas`);
    } catch (error) {
      console.error(`[${this.nome}] Erro ao buscar imóveis:`, error);
    }

    // Scrape veículos
    try {
      const veiculosCartas = await this.scrapeCategoria('/cartas-contempladas-de-veiculos/', 'veiculo');
      cartas.push(...veiculosCartas);
      console.log(`[${this.nome}] Veículos: ${veiculosCartas.length} cartas`);
    } catch (error) {
      console.error(`[${this.nome}] Erro ao buscar veículos:`, error);
    }

    console.log(`[${this.nome}] Total: ${cartas.length} cartas coletadas`);
    return cartas;
  }

  private async scrapeCategoria(path: string, tipo: TipoCarta): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML(path);
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Cards de cartas contempladas - procura por vários seletores possíveis
      $('.card, .cota-card, .item-carta, .carta-item, [class*="cota"], [class*="carta"]').each((_, card) => {
        try {
          const $card = $(card);
          const text = $card.text();
          
          // Pular cards sem valores monetários
          if (!text.includes('R$') && !text.match(/\d{1,3}(?:\.\d{3})+/)) return;

          // Extrair valores do texto
          const creditoMatch = text.match(/cr[ée]dito[:\s]*R?\$?\s*([\d.,]+)/i) ||
                              text.match(/valor[:\s]*R?\$?\s*([\d.,]+)/i) ||
                              text.match(/R\$\s*([\d.,]+(?:\.\d{3})*)/i);
          
          const entradaMatch = text.match(/entrada[:\s]*R?\$?\s*([\d.,]+)/i) ||
                               text.match(/[aá]gio[:\s]*R?\$?\s*([\d.,]+)/i);
          
          const parcelasMatch = text.match(/(\d+)\s*(?:x|parcelas?)[:\s]*R?\$?\s*([\d.,]+)/i);
          
          const adminMatch = text.match(/(Bradesco|Itaú|Porto\s*Seguro|Caixa|Rodobens|Embracon|Santander|Chevrolet|Honda|Yamaha)/i);

          const credito = creditoMatch ? this.parseValor(creditoMatch[1]) : 0;
          const entrada = entradaMatch ? this.parseValor(entradaMatch[1]) : 0;
          const parcelas = parcelasMatch ? parseInt(parcelasMatch[1]) : 0;
          const parcela = parcelasMatch ? this.parseValor(parcelasMatch[2]) : 0;
          const administradora = adminMatch ? adminMatch[1].trim() : 'Outro';

          if (credito > 0) {
            cartas.push(this.criarCarta({
              tipo,
              valorCarta: credito,
              valorEntrada: entrada,
              valorParcela: parcela,
              numeroParcelas: parcelas,
              administradora,
              urlOriginal: `${this.urlBase}${path}`,
            }));
          }
        } catch (e) {
          // Skip on error
        }
      });

      // Fallback: procurar em tabelas
      if (cartas.length === 0) {
        $('table tbody tr').each((_, row) => {
          try {
            const cells = $(row).find('td');
            if (cells.length < 3) return;

            const textos = cells.map((_, c) => $(c).text().trim()).get();
            const textoCompleto = textos.join(' ');
            
            // Procurar valores monetários
            const valores = textoCompleto.match(/R?\$?\s*([\d.,]+(?:\.\d{3})*)/g) || [];
            if (valores.length < 2) return;

            const valorPrincipal = this.parseValor(valores[0]);
            const valorSecundario = this.parseValor(valores[1]);

            if (valorPrincipal > 10000) {
              cartas.push(this.criarCarta({
                tipo,
                valorCarta: valorPrincipal,
                valorEntrada: valorSecundario,
                administradora: 'Outro',
                urlOriginal: `${this.urlBase}${path}`,
              }));
            }
          } catch (e) {
            // Skip
          }
        });
      }

      return cartas;
    } catch (error) {
      console.error(`[${this.nome}] Erro no scraping de ${path}:`, error);
      return [];
    }
  }
}
