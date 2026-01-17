/**
 * SQUAD ANALYSIS COMPONENT
 * Analyzeplantel and recommend best lineup
 */

import { TacticalEngine } from '../engine/TacticalEngine.js';

export class SquadAnalysis {
  constructor(container) {
    this.container = container;
    this.engine = new TacticalEngine();
    this.squad = [];
  }

  render() {
    this.container.innerHTML = `
      <div class="squad-analysis-page">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-users"></i>
              Análise do Plantel
            </h3>
          </div>
          <div class="card-body">
            <p class="text-center" style="padding: 2rem; color: var(--color-text-secondary);">
              <i class="fas fa-info-circle" style="font-size: 3rem; display: block; margin-bottom: 1rem; color: var(--color-primary);"></i>
              <strong>Funcionalidade em Desenvolvimento</strong><br>
              Esta seção permitirá que você faça upload de screenshots do seu plantel<br>
              ou insira dados manualmente para receber análises e recomendações.
            </p>

            <div class="demo-section">
              <h4 style="color: var(--color-text-primary); margin-bottom: var(--space-4);">
                <i class="fas fa-flask"></i> Demonstração
              </h4>
              
              <button class="btn btn-primary" id="load-demo-squad">
                <i class="fas fa-download"></i>
                Carregar Plantel de Demonstração
              </button>
            </div>

            <div id="squad-results" style="margin-top: var(--space-6);"></div>
          </div>
        </div>
      </div>

      <style>
        .demo-section {
          text-align: center;
          padding: var(--space-6);
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          margin-top: var(--space-5);
        }

        .player-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          margin-bottom: var(--space-3);
        }

        .player-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-border);
        }

        .player-name {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
        }

        .player-rating {
          background: var(--color-primary);
          color: white;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-bold);
        }

        .player-positions {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }

        .formation-visual {
          background: linear-gradient(180deg, #1a5a3a 0%, #0d3d26 100%);
          padding: var(--space-6);
          border-radius: var(--radius-lg);
          position: relative;
          min-height: 500px;
        }

        .formation-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-rows: repeat(4, 1fr);
          gap: var(--space-2);
          padding: var(--space-4);
        }

        .formation-line {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .formation-player {
          background: white;
          color: var(--color-bg-primary);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          box-shadow: var(--shadow-md);
          text-align: center;
          min-width: 80px;
        }
      </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const loadDemoBtn = document.getElementById('load-demo-squad');
    loadDemoBtn?.addEventListener('click', () => {
      this.loadDemoSquad();
    });
  }

  loadDemoSquad() {
    window.app.showLoading(true);

    // Demo squad data
    this.squad = [
      { name: 'João Silva', position: 'GK', rating: '7.2', age: 28, positions: ['GK'] },
      { name: 'Carlos Santos', position: 'DC', rating: '7.5', age: 26, positions: ['DC', 'DL'] },
      { name: 'Roberto Lima', position: 'DC', rating: '7.4', age: 29, positions: ['DC'] },
      { name: 'Miguel Costa', position: 'DL', rating: '7.1', age: 24, positions: ['DL', 'WBL'] },
      { name: 'André Oliveira', position: 'DR', rating: '7.3', age: 25, positions: ['DR', 'WBR'] },
      { name: 'Fernando Dias', position: 'DM', rating: '7.6', age: 27, positions: ['DM', 'MC'] },
      { name: 'Paulo Rodrigues', position: 'DM', rating: '7.2', age: 30, positions: ['DM'] },
      { name: 'Lucas Almeida', position: 'AML', rating: '7.8', age: 23, positions: ['AML', 'ST'] },
      { name: 'Pedro Martins', position: 'AMC', rating: '8.0', age: 25, positions: ['AMC', 'MC'] },
      { name: 'Tiago Ferreira', position: 'AMR', rating: '7.7', age: 22, positions: ['AMR', 'ST'] },
      { name: 'Rafael Sousa', position: 'ST', rating: '7.9', age: 26, positions: ['ST', 'AMC'] }
    ];

    setTimeout(() => {
      this.displaySquadAnalysis();
      window.app.showLoading(false);
      window.app.showToast('Plantel carregado com sucesso!', 'success');
    }, 1000);
  }

  displaySquadAnalysis() {
    const results = document.getElementById('squad-results');
    
    results.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-futbol"></i>
            Melhor Formação: 4-2-3-1
          </h3>
        </div>
        <div class="card-body">
          <div class="formation-visual">
            <div class="formation-lines">
              <div class="formation-line">
                <div class="formation-player">
                  <div>ST</div>
                  <div>Rafael Sousa</div>
                </div>
              </div>
              <div class="formation-line">
                <div class="formation-player">
                  <div>AML</div>
                  <div>Lucas Almeida</div>
                </div>
                <div class="formation-player">
                  <div>AMC</div>
                  <div>Pedro Martins</div>
                </div>
                <div class="formation-player">
                  <div>AMR</div>
                  <div>Tiago Ferreira</div>
                </div>
              </div>
              <div class="formation-line">
                <div class="formation-player">
                  <div>DM</div>
                  <div>Fernando Dias</div>
                </div>
                <div class="formation-player">
                  <div>DM</div>
                  <div>Paulo Rodrigues</div>
                </div>
              </div>
              <div class="formation-line">
                <div class="formation-player">
                  <div>DL</div>
                  <div>Miguel Costa</div>
                </div>
                <div class="formation-player">
                  <div>DC</div>
                  <div>Carlos Santos</div>
                </div>
                <div class="formation-player">
                  <div>DC</div>
                  <div>Roberto Lima</div>
                </div>
                <div class="formation-player">
                  <div>DR</div>
                  <div>André Oliveira</div>
                </div>
              </div>
              <div class="formation-line" style="margin-top: var(--space-4);">
                <div class="formation-player">
                  <div>GK</div>
                  <div>João Silva</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-chart-bar"></i>
            Análise do Plantel
          </h3>
        </div>
        <div class="card-body">
          <div class="grid grid-2">
            <div class="analysis-section">
              <h4 style="color: var(--color-success); margin-bottom: var(--space-3);">
                <i class="fas fa-check-circle"></i> Pontos Fortes
              </h4>
              <ul class="instruction-list">
                <li>Meio-campo criativo e técnico</li>
                <li>Atacantes versáteis e rápidos</li>
                <li>Boa média de idade (equilíbrio)</li>
              </ul>
            </div>

            <div class="analysis-section">
              <h4 style="color: var(--color-warning); margin-bottom: var(--space-3);">
                <i class="fas fa-exclamation-triangle"></i> Áreas para Melhorar
              </h4>
              <ul class="instruction-list">
                <li>Falta de opções de qualidade no ataque</li>
                <li>Defesa precisa de mais profundidade</li>
                <li>Meio-campo defensivo pode ser reforçado</li>
              </ul>
            </div>
          </div>

          <div style="margin-top: var(--space-5);">
            <h4 style="color: var(--color-primary); margin-bottom: var(--space-3);">
              <i class="fas fa-lightbulb"></i> Recomendações
            </h4>
            <ul class="instruction-list">
              <li>Considere contratar um volante mais físico para complementar Fernando Dias</li>
              <li>Busque um zagueiro experiente para liderança defensiva</li>
              <li>Um ponta-de-lança alternativo seria útil para rotação</li>
            </ul>
          </div>
        </div>
      </div>

      <style>
        .analysis-section {
          padding: var(--space-4);
          background: var(--color-surface);
          border-radius: var(--radius-md);
        }

        .instruction-list {
          list-style: none;
          padding: 0;
        }

        .instruction-list li {
          padding: var(--space-2);
          margin-bottom: var(--space-2);
          background: var(--color-bg-elevated);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .instruction-list li::before {
          content: '•';
          color: var(--color-primary);
          font-weight: bold;
          font-size: var(--font-size-xl);
        }
      </style>
    `;
  }
}

export default SquadAnalysis;
