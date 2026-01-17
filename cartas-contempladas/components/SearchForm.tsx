'use client';

import { useState, FormEvent } from 'react';
import { FiltrosBusca, TipoCarta, ADMINISTRADORAS } from '@/lib/types';

interface SearchFormProps {
  onSearch: (filtros: FiltrosBusca) => void;
  isLoading: boolean;
  vendedores?: string[]; // ⭐ NOVO
}

export default function SearchForm({ onSearch, isLoading, vendedores = [] }: SearchFormProps) {
  const [tipo, setTipo] = useState<TipoCarta | 'todos'>('todos');
  const [valorCarta, setValorCarta] = useState('');
  const [valorEntradaMax, setValorEntradaMax] = useState('');
  const [valorParcelaMax, setValorParcelaMax] = useState('');
  const [parcelasMax, setParcelasMax] = useState('');
  const [administradora, setAdministradora] = useState('');
  const [vendedor, setVendedor] = useState(''); // ⭐ NOVO
  const [tolerancia, setTolerancia] = useState('10000');

  // Formata valor para exibição (R$ XXX.XXX)
  const formatarValor = (valor: string): string => {
    const numero = valor.replace(/\D/g, '');
    if (!numero) return '';
    return Number(numero).toLocaleString('pt-BR');
  };

  // Converte valor formatado para número
  const valorParaNumero = (valor: string): number | undefined => {
    const numero = valor.replace(/\D/g, '');
    return numero ? Number(numero) : undefined;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const filtros: FiltrosBusca = {
      tipo: tipo,
      valorCartaMin: valorParaNumero(valorCarta),
      valorEntradaMax: valorParaNumero(valorEntradaMax),
      valorParcelaMax: valorParaNumero(valorParcelaMax),
      parcelasMax: parcelasMax ? Number(parcelasMax) : undefined,
      administradora: administradora || undefined,
      vendedor: vendedor || undefined, // ⭐ NOVO
      toleranciaValor: valorParaNumero(tolerancia) || 10000,
    };
    
    onSearch(filtros);
  };

  const handleReset = () => {
    setTipo('todos');
    setValorCarta('');
    setValorEntradaMax('');
    setValorParcelaMax('');
    setParcelasMax('');
    setAdministradora('');
    setVendedor(''); // ⭐ NOVO
    setTolerancia('10000');
    onSearch({});
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Tipo de carta */}
        <div className="form-group">
          <label className="form-label">Tipo de Carta</label>
          <select 
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCarta | 'todos')}
          >
            <option value="todos">🔍 Todos os Tipos</option>
            <option value="imovel">🏠 Imóvel</option>
            <option value="veiculo">🚗 Veículo</option>
            <option value="pesado">🚛 Pesado</option>
            <option value="moto">🏍️ Moto</option>
          </select>
        </div>

        {/* Valor da carta */}
        <div className="form-group">
          <label className="form-label">Valor da Carta (R$)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: 300.000"
            value={valorCarta}
            onChange={(e) => setValorCarta(formatarValor(e.target.value))}
          />
        </div>

        {/* Entrada máxima */}
        <div className="form-group">
          <label className="form-label">Entrada Máxima (R$)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: 50.000"
            value={valorEntradaMax}
            onChange={(e) => setValorEntradaMax(formatarValor(e.target.value))}
          />
        </div>

        {/* Valor máximo da parcela */}
        <div className="form-group">
          <label className="form-label">Valor Máximo da Parcela (R$)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: 2.000"
            value={valorParcelaMax}
            onChange={(e) => setValorParcelaMax(formatarValor(e.target.value))}
          />
        </div>

        {/* Parcelas máximas */}
        <div className="form-group">
          <label className="form-label">Parcelas Máximas</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ex: 120"
            min="1"
            max="240"
            value={parcelasMax}
            onChange={(e) => setParcelasMax(e.target.value)}
          />
        </div>

        {/* Administradora */}
        <div className="form-group">
          <label className="form-label">Administradora</label>
          <select 
            className="form-select"
            value={administradora}
            onChange={(e) => setAdministradora(e.target.value)}
          >
            <option value="">Todas</option>
            {ADMINISTRADORAS.map((adm) => (
              <option key={adm} value={adm}>{adm}</option>
            ))}
          </select>
        </div>

        {/* Tolerância de valor */}
        <div className="form-group">
          <label className="form-label">Tolerância (±R$)</label>
          <select 
            className="form-select"
            value={tolerancia}
            onChange={(e) => setTolerancia(e.target.value)}
          >
            <option value="5000">R$ 5.000</option>
            <option value="10000">R$ 10.000</option>
            <option value="20000">R$ 20.000</option>
            <option value="50000">R$ 50.000</option>
            <option value="100000">R$ 100.000</option>
          </select>
        </div>

        {/* Vendedor */}
        <div className="form-group">
          <label className="form-label">Vendedor</label>
          <select 
            className="form-select"
            value={vendedor}
            onChange={(e) => setVendedor(e.target.value)}
          >
            <option value="">Todos os Vendedores</option>
            {vendedores.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner" style={{ width: 20, height: 20 }}></span>
              Buscando...
            </>
          ) : (
            <>
              🔍 Buscar Cartas
            </>
          )}
        </button>
        
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          ✖ Limpar
        </button>
      </div>
    </form>
  );
}
