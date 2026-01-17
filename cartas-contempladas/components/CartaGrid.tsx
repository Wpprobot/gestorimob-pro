'use client';

import { CartaContemplada } from '@/lib/types';
import CartaCard from './CartaCard';

interface CartaGridProps {
  cartas: CartaContemplada[];
  isLoading: boolean;
  total: number;
  pagina: number;
  totalPaginas: number;
  onPageChange: (pagina: number) => void;
}

export default function CartaGrid({ 
  cartas, 
  isLoading, 
  total, 
  pagina, 
  totalPaginas,
  onPageChange 
}: CartaGridProps) {
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Buscando cartas contempladas...</span>
      </div>
    );
  }

  if (cartas.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3 className="empty-state-title">Nenhuma carta encontrada</h3>
        <p className="empty-state-text">
          Tente ajustar os filtros ou buscar por um valor diferente.
          <br />
          Lembre-se: a busca considera uma tolerância de ±R$ 10.000 do valor desejado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="results-header">
        <span className="results-count">
          Encontradas <strong>{total}</strong> cartas contempladas
        </span>
      </div>
      
      <div className="cards-grid">
        {cartas.map((carta) => (
          <CartaCard key={carta.id} carta={carta} />
        ))}
      </div>
      
      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(pagina - 1)}
            disabled={pagina <= 1}
          >
            ← Anterior
          </button>
          
          <span className="pagination-info">
            Página {pagina} de {totalPaginas}
          </span>
          
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(pagina + 1)}
            disabled={pagina >= totalPaginas}
          >
            Próxima →
          </button>
        </div>
      )}
    </>
  );
}
