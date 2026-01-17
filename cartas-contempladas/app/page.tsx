'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SearchForm from '@/components/SearchForm';
import CartaGrid from '@/components/CartaGrid';
import CartaCard from '@/components/CartaCard';
import RefreshButton from '@/components/RefreshButton';
import { CartaContemplada, FiltrosBusca } from '@/lib/types';

interface SearchResult {
  cartas: CartaContemplada[];
  total: number;
  pagina: number;
  totalPaginas: number;
  temMais: boolean;
  sugestoes?: { cartasAcima: CartaContemplada[]; cartasAbaixo: CartaContemplada[] } | null;
}

interface Stats {
  total: number;
  porTipo: Record<string, number>;
}

export default function Home() {
  const [cartas, setCartas] = useState<CartaContemplada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsGerais, setStatsGerais] = useState<{ total: number; porTipo: Record<string, number> } | null>(null);
  const [vendedores, setVendedores] = useState<string[]>([]); // ⭐ NOVO
  const [resultado, setResultado] = useState<SearchResult>({
    cartas: [],
    total: 0,
    pagina: 1,
    totalPaginas: 0,
    temMais: false,
    sugestoes: null,
  });
  const [filtrosAtuais, setFiltrosAtuais] = useState<FiltrosBusca>({});

  // Carrega dados iniciais e lista de vendedores
  useEffect(() => {
    buscarCartas({});
    // Carregar lista de vendedores
    fetch('/api/vendedores')
      .then(r => r.json())
      .then(data => setVendedores(data.vendedores || []))
      .catch(err => console.error('Erro ao carregar vendedores:', err));
  }, []);

  const buscarCartas = async (filtros: FiltrosBusca, pagina = 1) => {
    setIsLoading(true);
    setFiltrosAtuais(filtros);
    
    try {
      const params = new URLSearchParams();
      
      if (filtros.tipo && filtros.tipo !== 'todos') {
        params.set('tipo', filtros.tipo);
      }
      if (filtros.valorCartaMin) {
        params.set('valorCartaMin', filtros.valorCartaMin.toString());
      }
      if (filtros.valorCartaMax) {
        params.set('valorCartaMax', filtros.valorCartaMax.toString());
      }
      if (filtros.valorEntradaMax) {
        params.set('valorEntradaMax', filtros.valorEntradaMax.toString());
      }
      if (filtros.valorParcelaMax) {
        params.set('valorParcelaMax', filtros.valorParcelaMax.toString());
      }
      if (filtros.parcelasMax) {
        params.set('parcelasMax', filtros.parcelasMax.toString());
      }
      if (filtros.administradora) {
        params.set('administradora', filtros.administradora);
      }
      if (filtros.vendedor) { // ⭐ NOVO
        params.set('vendedor', filtros.vendedor);
      }
      if (filtros.toleranciaValor) {
        params.set('tolerancia', filtros.toleranciaValor.toString());
      }
      params.set('pagina', pagina.toString());
      params.set('limite', '12');

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setCartas(data.data.cartas);
        setResultado(data.data);
        if (data.stats) {
          setStats(data.stats); // Estatísticas do resultado atual
        }
        if (data.statsGerais) {
          setStatsGerais(data.statsGerais); // Estatísticas gerais do banco
        }
      }
    } catch (error) {
      console.error('Erro ao buscar cartas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filtros: FiltrosBusca) => {
    buscarCartas(filtros, 1);
  };

  const handlePageChange = (novaPagina: number) => {
    buscarCartas(filtrosAtuais, novaPagina);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshData = async () => {
    try {
      // Chama a API com parâmetro refresh=true para forçar scraping
      const response = await fetch('/api/search?refresh=true');
      const data = await response.json();
      
      if (data.success) {
        // Recarrega os dados após atualização
        await buscarCartas(filtrosAtuais, 1);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  return (
    <main>
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="header-logo">
            <Image 
              src="/logo.png" 
              alt="Cartas Contempladas" 
              width={64}
              height={64}
              priority
            />
            <h1 className="hero-title">
              Cartas Contempladas
            </h1>
          </div>
          <p className="hero-subtitle">
            Encontre as melhores oportunidades de cartas de consórcio já contempladas. 
            Compare preços de múltiplos sites em um só lugar.
          </p>
        </section>

        {/* Botão de Atualização */}
        <div className="refresh-button-container">
          <RefreshButton onRefresh={handleRefreshData} />
        </div>

        {/* Formulário de Busca */}
        <SearchForm 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          vendedores={vendedores} 
        />

        {/* Sugestões de cartas próximas - exibe cards reais */}
        {resultado.total === 0 && resultado.sugestoes && !isLoading && (
          <section className="sugestoes-section-full">
            <div className="sugestoes-header">
              <p className="sugestoes-titulo">
                Não encontramos cartas no valor exato, mas temos opções próximas:
              </p>
            </div>
            
            {/* Cartas com valor abaixo */}
            {resultado.sugestoes.cartasAbaixo.length > 0 && (
              <div className="sugestoes-grupo">
                <h3 className="sugestoes-grupo-titulo">📉 Valores abaixo do solicitado</h3>
                <div className="cards-grid sugestoes-grid">
                  {resultado.sugestoes.cartasAbaixo.map((carta) => (
                    <CartaCard key={carta.id} carta={carta} />
                  ))}
                </div>
              </div>
            )}

            {/* Cartas com valor acima */}
            {resultado.sugestoes.cartasAcima.length > 0 && (
              <div className="sugestoes-grupo">
                <h3 className="sugestoes-grupo-titulo">📈 Valores acima do solicitado</h3>
                <div className="cards-grid sugestoes-grid">
                  {resultado.sugestoes.cartasAcima.map((carta) => (
                    <CartaCard key={carta.id} carta={carta} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Estatísticas do resultado atual */}
        {stats && stats.total > 0 && (
          <section className="stats-section">
            {/* Total encontrado */}
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Encontradas</div>
            </div>
            
            {/* Imóveis */}
            <div className="stat-item">
              <div className="stat-value">{stats.porTipo.imovel || 0}</div>
              <div className="stat-label">🏠 Imóveis</div>
            </div>
            
            {/* Veículos */}
            <div className="stat-item">
              <div className="stat-value">{stats.porTipo.veiculo || 0}</div>
              <div className="stat-label">🚗 Veículos</div>
            </div>
            
            {/* Pesados */}
            <div className="stat-item">
              <div className="stat-value">{stats.porTipo.pesado || 0}</div>
              <div className="stat-label">🚛 Pesados</div>
            </div>
            
            {/* Motos */}
            <div className="stat-item">
              <div className="stat-value">{stats.porTipo.moto || 0}</div>
              <div className="stat-label">🏍️ Motos</div>
            </div>
            
            
            {/* Total no Banco (sempre visível quando há statsGerais) */}
            {statsGerais && (
              <div className="stat-item stat-item-muted">
                <div className="stat-value">{statsGerais.total}</div>
                <div className="stat-label">Total no Banco</div>
              </div>
            )}
          </section>
        )}

        {/* Grid de Cartas */}
        <CartaGrid 
          cartas={cartas}
          isLoading={isLoading}
          total={resultado.total}
          pagina={resultado.pagina}
          totalPaginas={resultado.totalPaginas}
          onPageChange={handlePageChange}
        />

        {/* Footer */}
        <footer className="footer">
          <p>
            Dados coletados de múltiplos sites de consórcios. 
            Verifique sempre as condições atualizadas diretamente com o vendedor.
          </p>
          <p className="footer-copyright">
            © 2026 Cartas Contempladas - Plataforma de busca de consórcios
          </p>
        </footer>
      </div>
    </main>
  );
}


