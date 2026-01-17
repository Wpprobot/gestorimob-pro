'use client';

import { CartaContemplada } from '@/lib/types';

interface CartaCardProps {
  carta: CartaContemplada;
}

// Formata valor para moeda brasileira
function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Ícones para cada tipo
const tipoIcons: Record<string, string> = {
  imovel: '🏠',
  veiculo: '🚗',
  pesado: '🚛',
  moto: '🏍️',
};

// Labels para cada tipo
const tipoLabels: Record<string, string> = {
  imovel: 'Imóvel',
  veiculo: 'Veículo',
  pesado: 'Pesado',
  moto: 'Moto',
};

export default function CartaCard({ carta }: CartaCardProps) {
  return (
    <div className="carta-card">
      {/* Badge de tipo */}
      <span className={`carta-badge ${carta.tipo}`}>
        {tipoIcons[carta.tipo]} {tipoLabels[carta.tipo]}
      </span>
      
      {/* Valor da carta */}
      <div className="carta-valor-principal">
        <span className="carta-valor-label">Crédito</span>
        <span className="carta-valor">{formatarMoeda(carta.valorCarta)}</span>
      </div>
      
      {/* Valor da entrada */}
      <div className="carta-valor-principal">
        <span className="carta-valor-label">Entrada / Ágio</span>
        <span className="carta-valor carta-valor-destaque">
          {formatarMoeda(carta.valorEntrada)}
        </span>
      </div>
      
      {/* Detalhes */}
      <div className="carta-detalhes">
        <div className="carta-detalhe">
          <span className="carta-detalhe-label">Parcelas</span>
          <span className="carta-detalhe-valor">
            {carta.numeroParcelas > 0 ? `${carta.numeroParcelas}x` : 'N/I'}
          </span>
        </div>
        
        <div className="carta-detalhe">
          <span className="carta-detalhe-label">Valor Parcela</span>
          <span className="carta-detalhe-valor">
            {carta.valorParcela > 0 ? formatarMoeda(carta.valorParcela) : 'N/I'}
          </span>
        </div>
        
        {carta.taxaAdministracao && (
          <div className="carta-detalhe">
            <span className="carta-detalhe-label">Taxa Admin.</span>
            <span className="carta-detalhe-valor">{carta.taxaAdministracao}%</span>
          </div>
        )}
      </div>
      
      {/* Saldo Devedor = Entrada + (Parcelas × Valor Parcela) */}
      {(carta.valorEntrada > 0 || (carta.numeroParcelas > 0 && carta.valorParcela > 0)) && (() => {
        const saldoDevedor = carta.valorEntrada + (carta.numeroParcelas * carta.valorParcela);
        const percentualAMais = carta.valorCarta > 0 
          ? ((saldoDevedor - carta.valorCarta) / carta.valorCarta) * 100 
          : 0;
        
        return (
          <>
            <div className="carta-saldo-devedor">
              <span className="carta-saldo-label">Saldo Devedor Total</span>
              <span className="carta-saldo-valor">
                {formatarMoeda(saldoDevedor)}
              </span>
            </div>
            
            {/* Percentual pago a mais */}
            {percentualAMais !== 0 && (
              <div className={`carta-percentual ${percentualAMais > 0 ? 'positivo' : 'negativo'}`}>
                <span className="carta-percentual-label">
                  {percentualAMais > 0 ? 'Custo Adicional' : 'Economia'}
                </span>
                <span className="carta-percentual-valor">
                  {percentualAMais > 0 ? '+' : ''}{percentualAMais.toFixed(1)}%
                </span>
                <span className="carta-percentual-diff">
                  ({percentualAMais > 0 ? '+' : ''}{formatarMoeda(saldoDevedor - carta.valorCarta)})
                </span>
              </div>
            )}
          </>
        );
      })()}
      
      {/* Info de administradora e vendedor */}
      <div className="carta-info">
        <span className="carta-administradora">{carta.administradora}</span>
        <span className="carta-vendedor">{carta.vendedor}</span>
      </div>
      
      {/* Ações */}
      <div className="carta-actions">
        <a 
          href={carta.urlOriginal}
          target="_blank"
          rel="noopener noreferrer"
          className="carta-btn carta-btn-primary"
        >
          Ver no Site →
        </a>
      </div>
    </div>
  );
}
