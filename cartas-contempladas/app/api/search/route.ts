import { NextRequest, NextResponse } from 'next/server';
import { searchCartas, getStats, saveCartas, cleanOldCartas, getCartasProximas, setLastUpdate, removeDuplicates } from '@/lib/db';
import { scrapeAll } from '@/lib/scrapers';
import { FiltrosBusca, CartaContemplada } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse dos parâmetros de filtro
    const filtros: FiltrosBusca = {
      tipo: (searchParams.get('tipo') as FiltrosBusca['tipo']) || 'todos',
      valorCartaMin: searchParams.get('valorCartaMin') ? Number(searchParams.get('valorCartaMin')) : undefined,
      valorCartaMax: searchParams.get('valorCartaMax') ? Number(searchParams.get('valorCartaMax')) : undefined,
      valorEntradaMax: searchParams.get('valorEntradaMax') ? Number(searchParams.get('valorEntradaMax')) : undefined,
      valorParcelaMax: searchParams.get('valorParcelaMax') ? Number(searchParams.get('valorParcelaMax')) : undefined,
      parcelasMax: searchParams.get('parcelasMax') ? Number(searchParams.get('parcelasMax')) : undefined,
      administradora: searchParams.get('administradora') || undefined,
      vendedor: searchParams.get('vendedor') || undefined, // ⭐ ADICIONADO
      toleranciaValor: searchParams.get('tolerancia') ? Number(searchParams.get('tolerancia')) : 10000,
      pagina: searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1,
      limite: searchParams.get('limite') ? Number(searchParams.get('limite')) : 20,
    };

    // 🔍 DEBUG COMPLETO
    console.log('\n========== [API /search] DEBUG ==========');
    console.log('Query params recebidos:');
    searchParams.forEach((value, key) => {
      console.log(`  ${key} = "${value}"`);
    });
    console.log('\nFiltros parseados:');
    console.log(JSON.stringify(filtros, null, 2));
    console.log('==========================================\n');

    // Verifica se deve forçar scraping
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Limpa cartas antigas (mais de 24h)
    cleanOldCartas();

    // Tenta buscar do banco de dados primeiro
    let resultado = searchCartas(filtros);
    
    // Se não há dados no banco ou forceRefresh, faz scraping
    if (resultado.total === 0 || forceRefresh) {
      console.log('[API] Banco vazio ou refresh solicitado, iniciando scraping...');
      
      try {
        const cartas = await scrapeAll();
        
        if (cartas.length > 0) {
          console.log(`[API] Salvando ${cartas.length} cartas no banco...`);
          saveCartas(cartas);
          
          // Remove duplicatas que podem ter sido criadas
          const duplicatasRemovidas = removeDuplicates();
          if (duplicatasRemovidas > 0) {
            console.log(`[API] Removidas ${duplicatasRemovidas} duplicatas`);
          }
          
          setLastUpdate(); // Salva timestamp da atualização
          resultado = searchCartas(filtros);
          console.log(`[API] Busca retornou ${resultado.total} resultados para os filtros`);
        } else {
          console.log('[API] Nenhuma carta encontrada no scraping');
        }
      } catch (scrapeError) {
        console.error('[API] Erro no scraping:', scrapeError);
        
        // Retorna erro se não tem dados e o scraping falhou
        if (resultado.total === 0) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Não foi possível buscar dados. Verifique sua conexão e tente novamente.',
              details: scrapeError instanceof Error ? scrapeError.message : 'Erro desconhecido'
            },
            { status: 503 }
          );
        }
      }
    }

    const totalPaginas = Math.ceil(resultado.total / (filtros.limite || 20));
    
    // Estatísticas gerais do banco (para referência)
    const statsGerais = getStats();
    
    // Estatísticas do resultado atual da busca (usa porTipo do banco de dados)
    const statsResultado = {
      total: resultado.total,
      porTipo: {
        imovel: resultado.porTipo.imovel || 0,
        veiculo: resultado.porTipo.veiculo || 0,
        pesado: resultado.porTipo.pesado || 0,
        moto: resultado.porTipo.moto || 0,
      },
    };
    
    // Sugestões desativadas - quando não há resultados, mostra "Nenhuma carta encontrada"
    // Se o usuário quer cartas próximas, deve ajustar os filtros manualmente
    const sugestoes = null;
    
    return NextResponse.json({
      success: true,
      data: {
        cartas: resultado.cartas,
        total: resultado.total,
        pagina: filtros.pagina || 1,
        totalPaginas,
        temMais: (filtros.pagina || 1) < totalPaginas,
        sugestoes, // Cartas sugeridas quando não há resultados
      },
      stats: statsResultado, // Estatísticas do resultado atual
      statsGerais, // Estatísticas gerais do banco
      fonte: 'scraping_real',
    });
  } catch (error) {
    console.error('[API] Erro na busca:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar cartas contempladas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}



