import { NextRequest, NextResponse } from 'next/server';
import { scrapeAll, scrapeByName } from '@/lib/scrapers';
import { saveCartas, cleanOldCartas, getStats } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fonte } = body;
    
    // Limpa cartas antigas antes de novos scrapes
    const removidas = cleanOldCartas();
    if (removidas > 0) {
      console.log(`Removidas ${removidas} cartas antigas`);
    }
    
    let cartas;
    
    if (fonte) {
      // Scrape de uma fonte específica
      cartas = await scrapeByName(fonte);
    } else {
      // Scrape de todas as fontes
      cartas = await scrapeAll();
    }
    
    // Salva as cartas no banco
    if (cartas.length > 0) {
      saveCartas(cartas);
    }
    
    const stats = getStats();
    
    return NextResponse.json({
      success: true,
      message: `Scraping concluído. ${cartas.length} cartas encontradas.`,
      cartasNovas: cartas.length,
      stats,
    });
  } catch (error) {
    console.error('Erro no scraping:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao executar scraping'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = getStats();
    
    return NextResponse.json({
      success: true,
      stats,
      fontes: [
        { nome: 'Cotas Premium', ativo: true },
        { nome: 'Bolsa do Consórcio', ativo: true },
        { nome: 'Unicontemplados', ativo: true },
      ],
    });
  } catch (error) {
    console.error('Erro ao obter stats:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter estatísticas' },
      { status: 500 }
    );
  }
}
