import { BaseScraper } from './base';
import { CartaContemplada } from '../types';
import * as cheerio from 'cheerio';

export class ContemladosRsScraper extends BaseScraper {
  constructor() {
    super('Contemplados RS', 'https://contempladosrs.com.br');
  }

  async scrape(): Promise<CartaContemplada[]> {
    try {
      const html = await this.fetchHTML('/cartas-contempladas/');
      const $ = this.parseHTML(html);
      const cartas: CartaContemplada[] = [];

      // Tabela com data-col attributes
      $('table tbody tr').each((_, row) => {
        try {
          const $row = $(row);
          
          const categoria = $row.find('td[data-col="CATEGORIA"]').text().trim().toLowerCase();
          const creditoText = $row.find('td[data-col="VALOR DO CRÉDITO"]').text().trim();
          const entradaText = $row.find('td[data-col="ENTRADA"]').text().trim();
          const parcelasText = $row.find('td[data-col="PARCELAS"]').text().trim();
          const observacoes = $row.find('td[data-col="OBSERVAÇÕES"]').text().trim();
          const disponibilidade = $row.find('td[data-col="DISPONIBILIDADE"]').text().trim().toLowerCase();

          // Pular se não disponível
          if (disponibilidade.includes('reservad') || disponibilidade.includes('vendid')) return;

          const credito = this.parseValor(creditoText);
          const entrada = this.parseValor(entradaText);

          // Parsear parcelas (formato: "199x6959,00")
          let parcelas = 0;
          let parcela = 0;
          const parcelasMatch = parcelasText.match(/(\d+)\s*x\s*([\d.,]+)/);
          if (parcelasMatch) {
            parcelas = parseInt(parcelasMatch[1]);
            parcela = this.parseValor(parcelasMatch[2]);
          }

          if (!credito || credito === 0) return;

          const tipo = this.detectarTipo(categoria);

          cartas.push(this.criarCarta({
            tipo,
            valorCarta: credito,
            valorEntrada: entrada,
            valorParcela: parcela,
            numeroParcelas: parcelas,
            administradora: observacoes || 'Outro',
            urlOriginal: `${this.urlBase}/cartas-contempladas/`,
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
