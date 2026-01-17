import { NextResponse } from 'next/server';
import { getVendedores } from '@/lib/db';

export async function GET() {
  try {
    const vendedores = getVendedores();
    return NextResponse.json({ vendedores });
  } catch (error) {
    console.error('[API vendedores] Erro:', error);
    return NextResponse.json({ vendedores: [] }, { status: 500 });
  }
}
