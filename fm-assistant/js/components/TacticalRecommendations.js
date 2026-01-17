/**
 * TACTICAL RECOMMENDATIONS COMPONENT
 * Quick tactical tips and recommendations
 */

import KnowledgeBase from '../engine/KnowledgeBase.js';

export class TacticalRecommendations {
  constructor(container) {
    this.container = container;
    this.kb = KnowledgeBase;
  }

  render() {
    this.container.innerHTML = `
      <div class="tactical-recommendations-page">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-clipboard-list"></i>
              Biblioteca de Táticas e Formações
            </h3>
          </div>
          <div class="card-body">
            <p style="margin-bottom: var(--space-5); color: var(--color-text-secondary);">
              Explore formações modernas e estilos táticos para dominar o Football Manager.
            </p>

            <h4 style="color: var(--color-primary); margin-bottom: var(--space-4);">
              <i class="fas fa-users"></i> Formações Modernas
            </h4>

            <div class="grid grid-2">
              ${Object.values(this.kb.formations).map(formation => `
                <div class="tactic-card">
                  <div class="tactic-header">
                    <h5>${formation.name}</h5>
                  </div>
                  <p class="tactic-description">${formation.description}</p>
                  
                  <div class="tactic-section">
                    <strong><i class="fas fa-check-circle text-success"></i> Pontos Fortes:</strong>
                    <ul>
                      ${formation.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>

                  <div class="tactic-section">
                    <strong><i class="fas fa-exclamation-triangle" style="color: var(--color-warning);"></i> Pontos Fracos:</strong>
                    <ul>
                      ${formation.weaknesses.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>

            <h4 style="color: var(--color-primary); margin: var(--space-8) 0 var(--space-4);">
              <i class="fas fa-chess"></i> Estilos Táticos
            </h4>

            <div class="grid grid-2">
              ${Object.values(this.kb.tacticalStyles).map(style => `
                <div class="tactic-card">
                  <div class="tactic-header">
                    <h5>${style.name}</h5>
                    <span class="mentality-badge">${style.mentality}</span>
                  </div>
                  <p class="tactic-description">${style.description}</p>
                  
                  <div class="tactic-section">
                    <strong>Instruções de Equipe:</strong>
                    <ul class="instruction-list">
                      ${style.teamInstructions.slice(0, 5).map(inst => `<li>${inst}</li>`).join('')}
                    </ul>
                  </div>

                  <div class="tactic-section">
                    <strong>Atributos Necessários:</strong>
                    <ul>
                      ${style.requiredAttributes.slice(0, 3).map(attr => `<li>${attr}</li>`).join('')}
                    </ul>
                  </div>

                  <div class="tactic-section">
                    <strong>Melhores Formações:</strong>
                    <p>${style.bestFormations.join(', ')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-graduation-cap"></i>
              Dicas Rápidas
            </h3>
          </div>
          <div class="card-body">
            <div class="grid grid-3">
              <div class="tip-card">
                <i class="fas fa-lightbulb tip-icon"></i>
                <h5>Paciência na Posse</h5>
                <p>Contra blocos defensivos, reduza o ritmo e trabalhe a bola para área ao invés de forçar passes.</p>
              </div>

              <div class="tip-card">
                <i class="fas fa-running tip-icon"></i>
                <h5>Contra-Pressionar</h5>
                <p>Ative contra-pressão para recuperar a bola rapidamente após perdê-la, especialmente com equipes atléticas.</p>
              </div>

              <div class="tip-card">
                <i class="fas fa-arrows-alt tip-icon"></i>
                <h5>Largura Variável</h5>
                <p>Use instruções individuais para alguns jogadores "ficarem mais largos" e outros "ficarem mais centrais".</p>
              </div>

              <div class="tip-card">
                <i class="fas fa-sync tip-icon"></i>
                <h5>Rotação do Plantel</h5>
                <p>Gerencie condicionamento físico rotacionando jogadores, especialmente em períodos com muitos jogos.</p>
              </div>

              <div class="tip-card">
                <i class="fas fa-chart-line tip-icon"></i>
                <h5>Análise Pós-Jogo</h5>
                <p>Revise estatísticas após cada jogo para identificar padrões e ajustar táticas.</p>
              </div>

              <div class="tip-card">
                <i class="fas fa-brain tip-icon"></i>
                <h5>Atributos Mentais</h5>
                <p>Não subestime atributos mentais - Decisões, Trabalho em Equipe e Posicionamento são cruciais.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .tactic-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          transition: all var(--transition-base);
        }

        .tactic-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .tactic-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-border);
        }

        .tactic-header h5 {
          color: var(--color-text-primary);
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
        }

        .mentality-badge {
          background: var(--color-primary);
          color: white;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
        }

        .tactic-description {
          color: var(--color-text-secondary);
          margin-bottom: var(--space-4);
          line-height: var(--line-height-relaxed);
        }

        .tactic-section {
          margin-bottom: var(--space-3);
        }

        .tactic-section strong {
          color: var(--color-text-primary);
          display: block;
          margin-bottom: var(--space-2);
        }

        .tactic-section ul {
          list-style: none;
          padding-left: 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }

        .tactic-section li {
          padding: var(--space-1) 0;
          padding-left: var(--space-4);
          position: relative;
        }

        .tactic-section li::before {
          content: '•';
          position: absolute;
          left: var(--space-2);
          color: var(--color-primary);
        }

        .instruction-list li::before {
          content: '✓';
          color: var(--color-success);
        }

        .tip-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          text-align: center;
          transition: all var(--transition-base);
        }

        .tip-card:hover {
          border-color: var(--color-primary);
          transform:translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .tip-icon {
          font-size: var(--font-size-3xl);
          color: var(--color-primary);
          margin-bottom: var(--space-2);
          display: block;
        }

        .tip-card h5 {
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
          font-size: var(--font-size-base);
        }

        .tip-card p {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          line-height: var(--line-height-relaxed);
        }
      </style>
    `;
  }
}

export default TacticalRecommendations;
