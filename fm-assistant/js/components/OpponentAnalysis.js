/**
 * OPPONENT ANALYSIS COMPONENT
 * Interface for analyzing opponents and receiving tactical recommendations
 */

import { TacticalEngine } from '../engine/TacticalEngine.js';

export class OpponentAnalysis {
  constructor(container) {
    this.container = container;
    this.engine = new TacticalEngine();
    this.currentAnalysis = null;
  }

  render() {
    this.container.innerHTML = `
      <div class="opponent-analysis-page">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-shield-alt"></i>
              Análise do Próximo Adversário
            </h3>
          </div>
          <div class="card-body">
            <form id="opponent-form">
              <div class="grid grid-2">
                <div class="form-group">
                  <label class="form-label">Nome do Adversário</label>
                  <input type="text" class="form-input" id="opponent-name" 
                         placeholder="Ex: Manchester United" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Formação Principal</label>
                  <select class="form-select" id="opponent-formation" required>
                    <option value="4-2-3-1">4-2-3-1</option>
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-4-2">4-4-2</option>
                    <option value="3-5-2">3-5-2</option>
                    <option value="5-3-2">5-3-2</option>
                    <option value="4-1-2-1-2">4-1-2-1-2 (Diamante)</option>
                    <option value="3-4-3">3-4-3</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Estilo de Jogo</label>
                  <select class="form-select" id="opponent-style" required>
                    <option value="balanced">Equilibrado</option>
                    <option value="possession">Posse de Bola</option>
                    <option value="gegenpress">Gegenpress/Pressão Alta</option>
                    <option value="counterattack">Contra-Ataque</option>
                    <option value="defensive">Defensivo</option>
                    <option value="attacking">Ofensivo</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Forma Recente</label>
                  <select class="form-select" id="opponent-form">
                    <option value="excellent">Excelente (80%+ vitórias)</option>
                    <option value="good">Boa (60-80% vitórias)</option>
                    <option value="average">Média</option>
                    <option value="poor">Ruim</option>
                    <option value="terrible">Péssima</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Pontos Fortes (selecione todos que se aplicam)</label>
                <div class="checkbox-grid">
                  <label class="checkbox-label">
                    <input type="checkbox" name="strengths" value="passing"> Qualidade de Passe
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="strengths" value="pressing"> Pressão Intensa
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="strengths" value="pace"> Velocidade
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="strengths" value="aerial"> Jogo Aéreo
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="strengths" value="width"> Jogo pelas Laterais
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="strengths" value="defensive"> Solidez Defensiva
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Pontos Fracos (selecione todos que se aplicam)</label>
                <div class="checkbox-grid">
                  <label class="checkbox-label">
                    <input type="checkbox" name="weaknesses" value="pace"> Falta de Velocidade
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="weaknesses" value="aerial"> Fraco Jogo Aéreo
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="weaknesses" value="defensive"> Defesa Frágil
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="weaknesses" value="pressing"> Vulnerável à Pressão
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="weaknesses" value="width"> Pouca Largura
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="weaknesses" value="goalkeeper"> Goleiro Fraco
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Jogadores-Chave (separados por vírgula)</label>
                <input type="text" class="form-input" id="key-players" 
                       placeholder="Ex: Cristiano Ronaldo, Bruno Fernandes">
              </div>

              <div class="form-group">
                <label class="form-label">Local do Jogo</label>
                <select class="form-select" id="match-location">
                  <option value="home">Casa</option>
                  <option value="away">Fora</option>
                  <option value="neutral">Campo Neutro</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-brain"></i>
                Gerar Análise Tática
              </button>
            </form>
          </div>
        </div>

        <div id="analysis-results"></div>
      </div>

      <style>
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--color-surface);
          border-radius: var(--radius-md);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          color: var(--color-text-secondary);
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .recommendation-section {
          background: var(--color-bg-elevated);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          border-left: 4px solid var(--color-primary);
        }

        .recommendation-section h4 {
          color: var(--color-primary);
          margin-bottom: var(--space-3);
          font-size: var(--font-size-lg);
        }

        .instruction-list {
          list-style: none;
          padding: 0;
        }

        .instruction-list li {
          padding: var(--space-2);
          margin-bottom: var(--space-2);
          background: var(--color-surface);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .instruction-list li::before {
          content: '✓';
          color: var(--color-success);
          font-weight: bold;
          font-size: var(--font-size-lg);
        }
      </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = document.getElementById('opponent-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.analyzeOpponent();
    });
  }

  analyzeOpponent() {
    window.app.showLoading(true);

    // Collect form data
    const opponentData = {
      name: document.getElementById('opponent-name').value,
      formation: document.getElementById('opponent-formation').value,
      style: document.getElementById('opponent-style').value,
      recentForm: document.getElementById('opponent-form').value,
      homeAway: document.getElementById('match-location').value,
      strengths: Array.from(document.querySelectorAll('input[name="strengths"]:checked')).map(cb => cb.value),
      weaknesses: Array.from(document.querySelectorAll('input[name="weaknesses"]:checked')).map(cb => cb.value),
      keyPlayers: document.getElementById('key-players').value.split(',').map(s => s.trim()).filter(s => s)
    };

    // Simulate analysis delay
    setTimeout(() => {
      this.currentAnalysis = this.engine.analyzeOpponent(opponentData);
      this.displayResults(opponentData);
      window.app.showLoading(false);
      window.app.showToast('Análise concluída com sucesso!', 'success');
    }, 1500);
  }

  displayResults(opponentData) {
    const resultsContainer = document.getElementById('analysis-results');
    const analysis = this.currentAnalysis;

    resultsContainer.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-lightbulb"></i>
            Relatório de Análise: ${opponentData.name}
          </h3>
        </div>
        <div class="card-body">
          <div class="recommendation-section">
            <h4><i class="fas fa-users"></i> Formação Recomendada</h4>
            <div class="formation-recommendation">
              <div class="formation-badge">${analysis.formation.recommended}</div>
              <p><strong>Raciocínio:</strong> ${analysis.formation.reasoning}</p>
              <p><strong>Alternativa:</strong> ${analysis.formation.alternative}</p>
            </div>
          </div>

          <div class="recommendation-section">
            <h4><i class="fas fa-chess"></i> Estilo Tático</h4>
            <p><strong>Estilo:</strong> ${analysis.tacticalStyle.style}</p>
            <p><strong>Mentalidade:</strong> ${analysis.tacticalStyle.mentality}</p>
            <p><strong>Raciocínio:</strong> ${analysis.tacticalStyle.reasoning}</p>
          </div>

          <div class="recommendation-section">
            <h4><i class="fas fa-clipboard-list"></i> Instruções de Equipe</h4>
            <ul class="instruction-list">
              ${analysis.teamInstructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ul>
          </div>

          ${analysis.keyPoints && analysis.keyPoints.length > 0 ? `
            <div class="recommendation-section">
              <h4><i class="fas fa-exclamation-triangle"></i> Pontos-Chave</h4>
              <ul class="instruction-list">
                ${analysis.keyPoints.map(point => `<li>${point}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="recommendation-section">
            <h4><i class="fas fa-futbol"></i> Bolas Paradas</h4>
            ${analysis.setpieces.corners && analysis.setpieces.corners.length > 0 ? `
              <p><strong>Escanteios:</strong></p>
              <ul class="instruction-list">
                ${analysis.setpieces.corners.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            ` : ''}
            ${analysis.setpieces.freekicks && analysis.setpieces.freekicks.length > 0 ? `
              <p><strong>Faltas:</strong></p>
              <ul class="instruction-list">
                ${analysis.setpieces.freekicks.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <button class="btn btn-primary" onclick="window.print()">
            <i class="fas fa-print"></i>
            Imprimir Relatório
          </button>
        </div>
      </div>

      <style>
        .formation-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          color: white;
          padding: var(--space-2) var(--space-5);
          border-radius: var(--radius-lg);
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-3);
          box-shadow: var(--shadow-glow);
        }

        .formation-recommendation p {
          margin-top: var(--space-2);
          color: var(--color-text-secondary);
        }
      </style>
    `;

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default OpponentAnalysis;
