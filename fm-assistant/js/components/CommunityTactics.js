/**
 * COMMUNITY TACTICS COMPONENT
 * Upload, análise e galeria de táticas da comunidade FM
 */

import { AdvancedTacticalAnalysis } from '../engine/AdvancedTacticalAnalysis.js';
import { StorageManager } from '../utils/StorageManager.js';

export class CommunityTactics {
  constructor(container) {
    this.container = container;
    this.analyzer = new AdvancedTacticalAnalysis();
    this.communityTactics = this.loadCommunityTactics();
  }

  loadCommunityTactics() {
    return StorageManager.load('fm_community_tactics', []);
  }

  saveCommunityTactics() {
    StorageManager.save('fm_community_tactics', this.communityTactics);
  }

  render() {
    this.container.innerHTML = `
      <div class="community-tactics-page">
        <!-- Header -->
<div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-users"></i>
              Táticas da Comunidade FM
            </h3>
          </div>
          <div class="card-body">
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-5);">
              Faça upload de táticas criadas pela comunidade (FMScout, FM Base, etc.) para análise profunda baseada em 
              <strong>Periodização Tática</strong>, <strong>4 Momentos do Jogo</strong> e metodologias de treinadores de elite!
            </p>
            
            <div class="grid grid-2">
              <div class="upload-tactic-section">
                <h4 style="color: var(--color-primary); margin-bottom: var(--space-3);">
                  <i class="fas fa-upload"></i> Enviar Nova Tática
                </h4>
                <form id="tactic-upload-form">
                  <div class="form-group">
                    <label class="form-label">Nome da Tática</label>
                    <input type="text" class="form-input" id="tactic-name" 
                           placeholder="Ex: Meta 4-3-2-1 Gegenpress" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Formação</label>
                    <select class="form-select" id="tactic-formation" required>
                      <option value="4-2-3-1">4-2-3-1</option>
                      <option value="4-3-3">4-3-3</option>
                      <option value="4-3-2-1">4-3-2-1</option>
                      <option value="4-2-2-2">4-2-2-2</option>
                      <option value="4-4-2">4-4-2</option>
                      <option value="3-5-2">3-5-2</option>
                      <option value="3-4-3">3-4-3</option>
                      <option value="5-3-2">5-3-2</option>
                      <option value="4-1-4-1">4-1-4-1</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Mentalidade</label>
                    <select class="form-select" id="tactic-mentality">
                      <option value="very defensive">Muito Defensiva</option>
                      <option value="defensive">Defensiva</option>
                      <option value="balanced" selected>Balanceada</option>
                      <option value="positive">Positiva</option>
                      <option value="attacking">Atacante</option>
                      <option value="very attacking">Muito Atacante</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Instruções de Equipe (selecione todas que se aplicam)</label>
                    <div class="checkbox-grid" style="max-height: 300px; overflow-y: auto;">
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="manter posse"> Manter Posse</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="contra-ataque"> Contra-Ataque</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="contra-pressionar"> Contra-Pressionar</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="passar mais curto"> Passar Mais Curto</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="passar mais direto"> Passar Mais Direto</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="jogar para fora da defesa"> Jogar para Fora da Defesa</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="trabalhar bola para área"> Trabalhar Bola para Área</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="explorar flancos"> Explorar Flancos</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="cruzar mais"> Cruzar Mais</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="atirar de longe"> Atirar de Longe</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="distribuir rápido"> Distribuir Rápido aos Atacantes</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="linha defensiva mais alta"> Linha Defensiva Mais Alta</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="linha defensiva mais baixa"> Linha Defensiva Mais Baixa</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="linha de impedimento"> Linha de Impedimento</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="manter forma"> Manter Forma</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="marcar mais apertado"> Marcar Mais Apertado</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="pressionar muito mais"> Pressionar Muito Mais</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="urgência maior"> Urgência Maior</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="urgência muito maior"> Urgência Muito Maior</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="ritmo mais alto"> Ritmo Mais Alto</label>
                      <label class="checkbox-label"><input type="checkbox" name="instructions" value="ritmo menor"> Ritmo Menor</label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Descrição (opcional)</label>
                    <textarea class="form-textarea" id="tactic-description" 
                              placeholder="Descreva a tática, origem, resultados..."></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-brain"></i>
                    Analisar Tática
                  </button>
                </form>
              </div>

              <div class="quick-stats-section">
                <h4 style="color: var(--color-primary); margin-bottom: var(--space-3);">
                  <i class="fas fa-chart-bar"></i> Estatísticas
                </h4>
                <div class="stats-grid">
                  <div class="stat-mini-card">
                    <div class="stat-value">${this.communityTactics.length}</div>
                    <div class="stat-label">Táticas Analisadas</div>
                  </div>
                  <div class="stat-mini-card">
                    <div class="stat-value">${this.getRatingACount()}</div>
                    <div class="stat-label">Rating A ou superior</div>
                  </div>
                </div>

                <div style="margin-top: var(--space-5);">
                  <h5 style="color: var(--color-text-primary); margin-bottom: var(--space-3);">
                    Metodologias Populares:
                  </h5>
                  ${this.getPopularMethodologies()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Análise Resultado (vazio inicialmente) -->
        <div id="analysis-result"></div>

        <!-- Galeria de Táticas -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-th-large"></i>
              Galeria de Táticas
            </h3>
          </div>
          <div class="card-body">
            ${this.renderTacticsGallery()}
          </div>
        </div>
      </div>

      <style>
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--color-surface);
          border-radius: var(--radius-md);
        }

        .stat-mini-card {
          background: var(--color-surface);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          text-align: center;
          border: 1px solid var(--color-border);
        }

        .stat-mini-card .stat-value {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }

        .stat-mini-card .stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin-top: var(--space-1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        .tactic-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .tactic-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .tactic-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-border);
        }

        .rating-badge {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-sm);
        }

        .rating-s { background: #f59e0b; color: white; }
        .rating-a { background: var(--color-success); color: white; }
        .rating-b { background: var(--color-info); color: white; }
        .rating-c { background: var(--color-warning); color: white; }
        .rating-d { background: var(--color-error); color: white; }

        .methodology-tag {
          display: inline-block;
          padding: var(--space-1) var(--space-2);
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          margin-right: var(--space-1);
          margin-bottom: var(--space-1);
        }

        .four-moments-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
          margin: var(--space-4) 0;
        }

        .moment-card {
          background: var(--color-bg-elevated);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-primary);
        }

        .moment-score {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }
      </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = document.getElementById('tactic-upload-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.analyzeTactic();
    });
  }

  analyzeTactic() {
    window.app.showLoading(true);

    const tacticData = {
      name: document.getElementById('tactic-name').value,
      formation: document.getElementById('tactic-formation').value,
      mentality: document.getElementById('tactic-mentality').value,
      instructions: Array.from(document.querySelectorAll('input[name="instructions"]:checked')).map(cb => cb.value),
      description: document.getElementById('tactic-description').value,
      uploadDate: new Date().toISOString()
    };

    setTimeout(() => {
      const analysis = this.analyzer.analyzeCustomTactic(tacticData);
      
      // Salvar tática com análise
      const tacticWithAnalysis = {
        ...tacticData,
        analysis,
        id: Date.now()
      };
      
      this.communityTactics.unshift(tacticWithAnalysis);
      this.saveCommunityTactics();

      // Mostrar análise
      this.displayAnalysis(tacticWithAnalysis);
      
      window.app.showLoading(false);
      window.app.showToast('Tática analisada com sucesso!', 'success');

      // Atualizar galeria
      setTimeout(() => {
        this.render();
        // Scroll para análise
        document.getElementById('analysis-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }, 1500);
  }

  displayAnalysis(tacticWithAnalysis) {
    const { analysis, name, formation, mentality } = tacticWithAnalysis;
    const resultsContainer = document.getElementById('analysis-result');

    resultsContainer.innerHTML = `
      <div class="card" style="border: 2px solid var(--color-primary);">
        <div class="card-header" style="background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%); color: white;">
          <h3 style="margin: 0; display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fas fa-microscope"></i> Análise Completa: ${name}</span>
            <span class="rating-badge rating-${analysis.rating.rating.toLowerCase()}">${analysis.rating.rating}</span>
          </h3>
        </div>
        <div class="card-body">
          <!-- Rating Geral -->
          <div style="text-align: center; padding: var(--space-5); background: var(--color-surface); border-radius: var(--radius-lg); margin-bottom: var(--space-5);">
            <div style="font-size: 4rem; font-weight: var(--font-weight-bold); color: var(--color-primary);">
              ${analysis.rating.overall}/100
            </div>
            <p style="color: var(--color-text-secondary); margin-top: var(--space-2);">
              ${analysis.rating.description}
            </p>
          </div>

          <!-- Metodologia Match -->
          ${analysis.methodologyMatch.coach ? `
            <div class="recommendation-section">
              <h4><i class="fas fa-graduation-cap"></i> Metodologia Identificada</h4>
              <p><strong>${analysis.methodologyMatch.match}</strong> (${analysis.methodologyMatch.similarity}% similaridade)</p>
              <p>${analysis.methodologyMatch.description}</p>
              <div style="margin-top: var(--space-3);">
                <strong>Princípios Aplicados:</strong>
                <ul class="instruction-list">
                  ${analysis.methodologyMatch.principles.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- 4 Momentos do Jogo -->
          <div class="recommendation-section">
            <h4><i class="fas fa-sync-alt"></i> Análise dos 4 Momentos do Jogo</h4>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
              Framework da Periodização Tática - Análise de como a tática aborda cada fase do jogo
            </p>
            <div class="four-moments-grid">
              ${Object.entries(analysis.fourMomentsAnalysis).map(([key, moment]) => `
                <div class="moment-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
                    <strong style="color: var(--color-text-primary);">${moment.name}</strong>
                    <span class="moment-score">${moment.score}</span>
                  </div>
                  <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-2);">
                    ${moment.description}
                  </p>
                  ${moment.characteristics.length > 0 ? `
                    <ul style="font-size: var(--font-size-sm); color: var(--color-text-secondary); padding-left: var(--space-4);">
                      ${moment.characteristics.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Superioridades -->
          ${Object.values(analysis.superioritiesAnalysis).some(arr => arr.length > 0) ? `
            <div class="recommendation-section">
              <h4><i class="fas fa-chess"></i> Superioridades Táticas</h4>
              <p style="color: var(--color-text-secondary); margin-bottom: var(--space-3);">
                Vantagens que a tática busca criar (Framework de Ray Power)
              </p>
              ${analysis.superioritiesAnalysis.numerical.length > 0 ? `
                <div style="margin-bottom: var(--space-3);">
                  <strong style="color: var(--color-success);">Superioridade Numérica:</strong>
                  <ul class="instruction-list">
                    ${analysis.superioritiesAnalysis.numerical.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${analysis.superioritiesAnalysis.positional.length > 0 ? `
                <div style="margin-bottom: var(--space-3);">
                  <strong style="color: var(--color-info);">Superioridade Posicional:</strong>
                  <ul class="instruction-list">
                    ${analysis.superioritiesAnalysis.positional.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${analysis.superioritiesAnalysis.qualitative.length > 0 ? ` <div>
                  <strong style="color: var(--color-warning);">Superioridade Qualitativa:</strong>
                  <ul class="instruction-list">
                    ${analysis.superioritiesAnalysis.qualitative.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Pontos Fortes e Fracos -->
          <div class="grid grid-2">
            <div class="recommendation-section" style="background: rgba(16, 185, 129, 0.1); border-left-color: var(--color-success);">
              <h4 style="color: var(--color-success);"><i class="fas fa-check-circle"></i> Pontos Fortes</h4>
              <ul class="instruction-list">
                ${analysis.strengthsWeaknesses.strengths.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>

            <div class="recommendation-section" style="background: rgba(239, 68, 68, 0.1); border-left-color: var(--color-error);">
              <h4 style="color: var(--color-error);"><i class="fas fa-exclamation-triangle"></i> Pontos Fracos</h4>
              <ul class="instruction-list">
                ${analysis.strengthsWeaknesses.weaknesses.map(w => `<li>${w}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Recomendações -->
          ${analysis.recommendations.length > 0 ? `
            <div class="recommendation-section">
              <h4><i class="fas fa-lightbulb"></i> Recomendações de Melhoria</h4>
              ${analysis.recommendations.map(rec => `
                <div style="margin-bottom: var(--space-3); padding: var(--space-3); background: var(--color-surface); border-radius: var(--radius-md); border-left: 3px solid ${rec.impact === 'Alto' ? 'var(--color-error)' : rec.impact === 'Médio' ? 'var(--color-warning)' : 'var(--color-info)'};">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-1);">
                    <strong style="color: var(--color-text-primary);">${rec.category}</strong>
                    <span style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">Impacto: ${rec.impact}</span>
                  </div>
                  <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">${rec.suggestion}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderTacticsGallery() {
    if (this.communityTactics.length === 0) {
      return `
        <p style="text-align: center; padding: var(--space-8); color: var(--color-text-secondary);">
          <i class="fas fa-inbox" style="font-size: 3rem; display: block; margin-bottom: var(--space-3); opacity: 0.5;"></i>
          Nenhuma tática analisada ainda.<br>
          Faça upload da primeira tática acima!
        </p>
      `;
    }

    return `
      <div class="grid grid-3">
        ${this.communityTactics.map(tactic => `
          <div class="tactic-card" onclick="window.app.components['community-tactics'].displayAnalysis(${JSON.stringify(tactic).replace(/"/g, '&quot;')})">
            <div class="tactic-card-header">
              <strong style="color: var(--color-text-primary); font-size: var(--font-size-lg);">
                ${tactic.name}
              </strong>
              <span class="rating-badge rating-${tactic.analysis.rating.rating.toLowerCase()}">
                ${tactic.analysis.rating.rating}
              </span>
            </div>
            <div>
              <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-2);">
                <i class="fas fa-users"></i> ${tactic.formation} | ${tactic.mentality}
              </p>
              ${tactic.analysis.methodologyMatch.coach ? `
                <span class="methodology-tag">
                  ${tactic.analysis.methodologyMatch.match.split(' ')[0]}
                </span>
              ` : ''}
              <p style="color: var(--color-text-tertiary); font-size: var(--font-size-xs); margin-top: var(--space-2);">
                Score: ${tactic.analysis.rating.overall}/100
              </p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  getRatingACount() {
    return this.communityTactics.filter(t => ['S', 'A'].includes(t.analysis?.rating?.rating)).length;
  }

  getPopularMethodologies() {
    const methodologies = {};
    this.communityTactics.forEach(t => {
      const match = t.analysis?.methodologyMatch?.match;
      if (match && match !== 'Tática Única') {
        const name = match.split(' ')[0];
        methodologies[name] = (methodologies[name] || 0) + 1;
      }
    });

    const sorted = Object.entries(methodologies).sort((a, b) => b[1] - a[1]).slice(0, 3);
    
    if (sorted.length === 0) {
      return '<p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm);">Nenhuma tática analisada ainda</p>';
    }

    return sorted.map(([name, count]) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-2); background: var(--color-surface); border-radius: var(--radius-sm); margin-bottom: var(--space-2);">
        <span style="color: var(--color-text-primary); font-weight: var(--font-weight-semibold);">${name}</span>
        <span style="color: var(--color-primary); font-weight: var(--font-weight-bold);">${count}</span>
      </div>
    `).join('');
  }
}

export default CommunityTactics;
