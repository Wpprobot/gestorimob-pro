/**
 * DASHBOARD COMPONENT
 * Main dashboard with overview and quick actions
 */

export class Dashboard {
  constructor(container) {
    this.container = container;
  }

  render() {
    // Load stats from storage
    const squadData = JSON.parse(localStorage.getItem('squad_data') || '[]');
    const scheduleData = JSON.parse(localStorage.getItem('schedule_data') || '[]');
    
    // Calculate basic stats
    const totalPlayers = squadData.length;
    const totalGames = scheduleData.length;
    const wins = scheduleData.filter(g => g['Res'] && g['Res'].includes('V')).length;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    this.container.innerHTML = `
      <div class="dashboard">
        <div class="welcome-section card">
          <h2>Bem-vindo ao FM Tactical Assistant! <i class="fas fa-futbol"></i></h2>
          <p>Seu assistente técnico profissional para Football Manager está pronto para ajudar você a dominar a competição.</p>
        </div>

        <div class="grid grid-4">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-value">${totalPlayers}</div>
            <div class="stat-label">Jogadores no Plantel</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-value">${winRate}%</div>
            <div class="stat-label">Taxa de Vitória</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-value">${totalGames}</div>
            <div class="stat-label">Jogos Analisados</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <div class="stat-value">0</div>
            <div class="stat-label">Recomendações</div>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="card quick-action-card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-shield-alt"></i>
                Próximo Jogo
              </h3>
            </div>
            <div class="card-body">
              <p class="text-center" style="padding: 2rem 0; color: var(--color-text-tertiary);">
                <i class="fas fa-info-circle"></i><br>
                Nenhum jogo analisado ainda.<br>
                Vá para "Análise do Adversário" para começar.
              </p>
              <button class="btn btn-primary" onclick="window.app.navigate('opponent')" style="width: 100%;">
                <i class="fas fa-plus"></i>
                Analisar Adversário
              </button>
            </div>
          </div>

          <div class="card quick-action-card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-users"></i>
                Seu Plantel
              </h3>
            </div>
            <div class="card-body">
              <p class="text-center" style="padding: 2rem 0; color: var(--color-text-tertiary);">
                <i class="fas fa-info-circle"></i><br>
                Nenhum plantel carregado.<br>
                Faça upload dos dados do seu time.
              </p>
              <button class="btn btn-primary" onclick="window.app.navigate('squad')" style="width: 100%;">
                <i class="fas fa-upload"></i>
                Carregar Plantel
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-book"></i>
              Guia Rápido
            </h3>
          </div>
          <div class="card-body">
            <div class="grid grid-3">
              <div class="guide-item">
                <div class="guide-icon">
                  <i class="fas fa-user-tie"></i>
                </div>
                <h4>1. Personalize seu Assistente</h4>
                <p>Configure nome, idade e avatar do seu assistente técnico.</p>
              </div>

              <div class="guide-item">
                <div class="guide-icon">
                  <i class="fas fa-upload"></i>
                </div>
                <h4>2. Carregue seus Dados</h4>
                <p>Faça upload de screenshots ou insira dados manualmente.</p>
              </div>

              <div class="guide-item">
                <div class="guide-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <h4>3. Receba Recomendações</h4>
                <p>Análises táticas personalizadas para cada partida.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .welcome-section {
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
          color: white;
          text-align: center;
          padding: var(--space-8) var(--space-6);
        }

        .welcome-section h2 {
          font-size: var(--font-size-3xl);
          margin-bottom: var(--space-3);
        }

        .welcome-section p {
          font-size: var(--font-size-lg);
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
        }

        .quick-action-card {
          min-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .quick-action-card .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .guide-item {
          text-align: center;
          padding: var(--space-4);
        }

        .guide-icon {
          font-size: var(--font-size-4xl);
          color: var(--color-primary);
          margin-bottom: var(--space-3);
        }

        .guide-item h4 {
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
          font-size: var(--font-size-lg);
        }

        .guide-item p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
      </style>
    `;
  }
}

export default Dashboard;
