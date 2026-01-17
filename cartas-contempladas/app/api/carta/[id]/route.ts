import { NextRequest, NextResponse } from 'next/server';
import { getCartaById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carta = getCartaById(id);
    
    if (!carta) {
      return NextResponse.json(
        { success: false, error: 'Carta não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: carta,
    });
  } catch (error) {
    console.error('Erro ao buscar carta:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar carta' },
      { status: 500 }
    );
  }
}
