import { NextRequest, NextResponse } from 'next/server';
import { 
  CotasPremiumScraper, 
  BolsaDoConsorcioScraper, 
  UnicontemplaDosScraper,
  DFContemplaDosScraper,
  QueroContempladascraper
} from '@/lib/scrapers';

// Endpoint de debug para testar scrapers individuais
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  
  const scrapers: Record<string, () => Promise<any>> = {
    'cotaspremium': async () => new CotasPremiumScraper().scrape(),
    'bolsadoconsorcio': async () => new BolsaDoConsorcioScraper().scrape(),
    'unicontemplados': async () => new UnicontemplaDosScraper().scrape(),
    'dfcontemplados': async () => new DFContemplaDosScraper().scrape(),
    'querocontemplada': async () => new QueroContempladascraper().scrape(),
  };

  if (!source) {
    return NextResponse.json({
      message: 'Use ?source=nome para testar um scraper',
      available: Object.keys(scrapers),
    });
  }

  const scraperFn = scrapers[source.toLowerCase()];
  
  if (!scraperFn) {
    return NextResponse.json({
      error: `Scraper "${source}" não encontrado`,
      available: Object.keys(scrapers),
    }, { status: 400 });
  }

  try {
    console.log(`[Debug] Testando scraper: ${source}`);
    const startTime = Date.now();
    const cartas = await scraperFn();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      source,
      success: true,
      total: cartas.length,
      durationMs: duration,
      sample: cartas.slice(0, 5),
      allData: cartas,
    });
  } catch (error) {
    console.error(`[Debug] Erro no scraper ${source}:`, error);
    return NextResponse.json({
      source,
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
