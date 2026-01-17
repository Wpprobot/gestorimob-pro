import { 
  CotasPremiumScraper,
  PlayContempladasScraper,
  IconsorciosScraper,
  TramontanaScraper,
  LumeScraper,
  ConsorciocredScraper,
  ConsorcioMarketScraper,
  PrimeCotasScraper
} from '../lib/scrapers';

async function testProblemScrapers() {
  const scrapers = [
    new CotasPremiumScraper(),
    new PlayContempladasScraper(),
    new IconsorciosScraper(),
    new TramontanaScraper(),
    new LumeScraper(),
    new ConsorciocredScraper(),
    new ConsorcioMarketScraper(),
    new PrimeCotasScraper()
  ];

  console.log(`\n🔍 Testando ${scrapers.length} scrapers problemáticos...\n`);
  console.log('='.repeat(70));

  for (const scraper of scrapers) {
    const nome = scraper.getNome();
    try {
      console.log(`\n[${nome}] Testando...`);
      const cartas = await scraper.scrape();
      
      if (cartas.length > 0) {
        console.log(`✅ [${nome}] ${cartas.length} cartas encontradas`);
      } else {
        console.log(`❌ [${nome}] 0 cartas - AINDA COM PROBLEMA`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log(`❌ [${nome}] Erro: ${errorMsg}`);
    }
  }

  console.log('\n' + '='.repeat(70));
}

testProblemScrapers();
