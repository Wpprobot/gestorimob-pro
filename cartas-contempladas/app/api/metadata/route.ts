import { NextResponse } from 'next/server';
import { getLastUpdate } from '@/lib/db';

export async function GET() {
  try {
    const lastUpdate = getLastUpdate();
    
    return NextResponse.json({
      success: true,
      data: {
        lastUpdate: lastUpdate ? lastUpdate.toISOString() : null,
      },
    });
  } catch (error) {
    console.error('[API] Erro ao buscar metadata:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar metadados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
