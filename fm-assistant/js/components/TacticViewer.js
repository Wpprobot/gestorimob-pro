/**
 * TACTIC VIEWER COMPONENT
 * Visualizes uploaded tactics and allows screenshot/HTML import for details
 */

import { StorageManager } from '../utils/StorageManager.js';

export class TacticViewer {
  constructor(container) {
    this.container = container;
  }

  render() {
    const tactics = StorageManager.load('my_tactics') || [];
    const currentTactic = tactics[tactics.length - 1]; // Show latest uploaded

    if (!currentTactic) {
      this.renderEmptyState();
      return;
    }

    this.container.innerHTML = `
      <div class="tactic-viewer-page">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-chess-board"></i>
              Visualizador de Tática
            </h3>
            <div class="card-actions">
              <span class="badge badge-primary">${currentTactic.name}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="alert alert-info" style="margin-bottom: var(--space-6);">
              <i class="fas fa-info-circle"></i>
              <strong>Atenção:</strong> Arquivos .fmf são criptografados. Para visualizar o esquema e instruções, por favor faça upload de um <strong>Screenshot</strong> ou exporte a tela como <strong>Página Web (.html)</strong>.
            </div>

            <div class="grid grid-2">
              <!-- Screenshot Section -->
              <div class="tactic-visual-section">
                <h4><i class="fas fa-image"></i> Screenshot da Tática</h4>
                
                <div class="screenshot-area" id="tactic-screenshot-area">
                  ${currentTactic.screenshot 
                    ? `<img src="${currentTactic.screenshot}" class="tactic-screenshot-img" alt="Tactic Screenshot">` 
                    : `
                      <div class="upload-placeholder" onclick="document.getElementById('tactic-screen-input').click()">
                        <i class="fas fa-plus-circle"></i>
                        <p>Adicionar Screenshot</p>
                        <span class="text-sm text-muted">Clique para upload</span>
                      </div>
                    `
                  }
                  <input type="file" id="tactic-screen-input" accept="image/*" style="display: none;">
                </div>
              </div>

              <!-- Details Section -->
              <div class="tactic-details-section">
                <h4><i class="fas fa-list"></i> Detalhes da Tática</h4>
                
                <div id="tactic-details-content">
                  ${currentTactic.formation 
                    ? this.renderTacticDetails(currentTactic)
                    : `
                      <div class="empty-details">
                        <p>Nenhum detalhe importado.</p>
                        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('tactic-html-input').click()">
                          <i class="fas fa-file-import"></i> Importar HTML da Tática
                        </button>
                        <input type="file" id="tactic-html-input" accept=".html,.htm" style="display: none;">
                      </div>
                    `
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .tactic-visual-section, .tactic-details-section {
          background: var(--color-bg-elevated);
          padding: var(--space-4);
          border-radius: var(--radius-md);
        }

        .tactic-visual-section h4, .tactic-details-section h4 {
          margin-bottom: var(--space-4);
          color: var(--color-text-primary);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--space-2);
        }

        .screenshot-area {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-surface);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .screenshot-area:hover {
          border-color: var(--color-primary);
        }

        .tactic-screenshot-img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .upload-placeholder {
          text-align: center;
          color: var(--color-text-secondary);
        }

        .upload-placeholder i {
          font-size: 3rem;
          margin-bottom: var(--space-2);
          color: var(--color-primary);
        }

        .empty-details {
          text-align: center;
          padding: var(--space-8);
          color: var(--color-text-secondary);
        }
      </style>
    `;

    this.attachEventListeners();
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="card">
        <div class="card-body text-center" style="padding: var(--space-8);">
          <i class="fas fa-chess-board" style="font-size: 4rem; color: var(--color-text-tertiary); margin-bottom: var(--space-4);"></i>
          <h3>Nenhuma tática carregada</h3>
          <p>Vá para "Upload de Dados" para carregar seu arquivo .fmf</p>
          <button class="btn btn-primary mt-4" onclick="window.app.navigate('upload')">
            Ir para Upload
          </button>
        </div>
      </div>
    `;
  }

  renderTacticDetails(tactic) {
    return `
      <div class="tactic-info">
        <div class="info-item">
          <strong>Formação:</strong> ${tactic.formation || 'Desconhecida'}
        </div>
        <div class="info-item">
          <strong>Mentalidade:</strong> ${tactic.mentality || 'Padrão'}
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const screenInput = document.getElementById('tactic-screen-input');
    const htmlInput = document.getElementById('tactic-html-input');

    screenInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.handleScreenshot(file);
    });

    htmlInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.handleHtml(file);
    });
  }

  handleScreenshot(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const tactics = StorageManager.load('my_tactics') || [];
      if (tactics.length > 0) {
        tactics[tactics.length - 1].screenshot = e.target.result;
        StorageManager.save('my_tactics', tactics);
        this.render(); // Re-render to show image
        window.app.showToast('Screenshot salvo com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  }

  handleHtml(file) {
    // Placeholder for HTML parsing of tactic
    window.app.showToast('Importação de HTML de tática em breve...', 'info');
  }
}

export default TacticViewer;
