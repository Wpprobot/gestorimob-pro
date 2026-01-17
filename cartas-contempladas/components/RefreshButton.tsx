'use client';

import { useState, useEffect } from 'react';
import './RefreshButton.css';

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
}

export default function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Carrega timestamp da última atualização
  useEffect(() => {
    fetchLastUpdate();
    // Atualiza o "tempo atrás" a cada minuto
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateTimeAgo();
  }, [lastUpdate]);

  const fetchLastUpdate = async () => {
    try {
      const response = await fetch('/api/metadata');
      const data = await response.json();
      if (data.success && data.data.lastUpdate) {
        setLastUpdate(new Date(data.data.lastUpdate));
      }
    } catch (error) {
      console.error('Erro ao buscar metadata:', error);
    }
  };

  const updateTimeAgo = () => {
    if (!lastUpdate) {
      setTimeAgo('Nunca atualizado');
      return;
    }

    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      setTimeAgo('Agora mesmo');
    } else if (diffMins < 60) {
      setTimeAgo(`há ${diffMins} min`);
    } else if (diffHours < 24) {
      setTimeAgo(`há ${diffHours}h`);
    } else {
      setTimeAgo(`há ${diffDays}d`);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      await fetchLastUpdate();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="refresh-container">
      <button
        className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Atualizar dados dos scrapers"
      >
        <svg
          className="refresh-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
      </button>
      {lastUpdate && (
        <span className="last-update-text" title={lastUpdate.toLocaleString('pt-BR')}>
          {timeAgo}
        </span>
      )}
    </div>
  );
}
