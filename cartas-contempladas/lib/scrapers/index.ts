import { CartaContemplada } from '../types';

// Interface base para scrapers
interface Scraper {
  scrape(): Promise<CartaContemplada[]>;
}

// Importa scrapers funcionando
import { CotasPremiumScraper } from './cotaspremium';
import { BolsaDoConsorcioScraper } from './bolsadoconsorcio';
import { UnicontemplaDosScraper } from './unicontemplados';
import { DFContemplaDosScraper } from './dfcontemplados';
import { QueroContempladascraper } from './querocontemplada';
import { TocoConsorciosScraper } from './tococonsorcios';
import { PlayContempladasScraper } from './playcontempladas';
import { LumeScraper } from './lume';
import { FinprimeScraper } from './finprime';
import { ContemladosRsScraper } from './contempladosrs';
import { CotasContempladasScraper } from './cotascontempladas';
import { ContempladasBrasilScraper } from './contempladasbrasil';
import { ContemplaDosSPScraper } from './contempladosp';
import { LizzyPrimeScraper } from './lizzyprime';

// Exporta scrapers funcionando
export { BaseScraper } from './base';
export { CotasPremiumScraper } from './cotaspremium';
export { BolsaDoConsorcioScraper } from './bolsadoconsorcio';
export { UnicontemplaDosScraper } from './unicontemplados';
export { DFContemplaDosScraper } from './dfcontemplados';
export { QueroContempladascraper } from './querocontemplada';
export { TocoConsorciosScraper } from './tococonsorcios';
export { PlayContempladasScraper } from './playcontempladas';
export { LumeScraper } from './lume';
export { FinprimeScraper } from './finprime';
export { ContemladosRsScraper } from './contempladosrs';
export { CotasContempladasScraper } from './cotascontempladas';
export { ContempladasBrasilScraper } from './contempladasbrasil';
export { ContemplaDosSPScraper } from './contempladosp';
export { LizzyPrimeScraper } from './lizzyprime';

/**
 * Lista de todos os scrapers ativos (14 fontes)
 * Removidos: iConsórcios, Tramontana, ConsorcioCred, ConsorcioMarket, PrimeCotas (sites sem cartas públicas)
 */
export function getActiveScrapers(): Scraper[] {
  return [
    // Originais funcionando
    new CotasPremiumScraper(),  // Puppeteer - 37 cartas
    new BolsaDoConsorcioScraper(),
    new UnicontemplaDosScraper(),
    new DFContemplaDosScraper(),
    new QueroContempladascraper(),
    // Novos scrapers funcionando
    new TocoConsorciosScraper(),
    new PlayContempladasScraper(),  // Nova URL - 1714 cartas
    new LumeScraper(),  // Nova URL cartascontempladas.com.br - 251 cartas
    new FinprimeScraper(),
    new ContemladosRsScraper(),
    new CotasContempladasScraper(),
    new ContempladasBrasilScraper(),
    new ContemplaDosSPScraper(),
    new LizzyPrimeScraper(),
  ];
}

/**
 * Executa todos os scrapers e retorna todas as cartas encontradas
 */
export async function scrapeAll(): Promise<CartaContemplada[]> {
  const scrapers = getActiveScrapers();
  const todasCartas: CartaContemplada[] = [];

  console.log(`[Scraper] Iniciando scraping de ${scrapers.length} fontes...`);

  for (const scraper of scrapers) {
    try {
      const cartas = await scraper.scrape();
      todasCartas.push(...cartas);
    } catch (error) {
      console.error(`[Scraper] Erro no scraper:`, error);
    }
  }

  console.log(`[Scraper] Total: ${todasCartas.length} cartas coletadas de ${scrapers.length} fontes`);
  return todasCartas;
}

/**
 * Executa scraping por nome da fonte (não implementado, retorna array vazio)
 */
export async function scrapeByName(nome: string): Promise<CartaContemplada[]> {
  console.log(`[Scraper] Scrape por nome não implementado: ${nome}`);
  return [];
}
