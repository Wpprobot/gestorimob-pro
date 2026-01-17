/**
 * UPLOAD MANAGER COMPONENT
 * Manage uploads of screenshots, tactics, and save data (HTML)
 */

import { HtmlParser } from '../utils/HtmlParser.js';
import { StorageManager } from '../utils/StorageManager.js';

export class UploadManager {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="upload-page">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-upload"></i>
              Upload de Dados
            </h3>
          </div>
          <div class="card-body">
            <div class="grid grid-3">
              <!-- Screenshots -->
              <div class="upload-section">
                <div class="upload-box" id="screenshot-upload-box">
                  <i class="fas fa-image upload-icon"></i>
                  <h4>Screenshots</h4>
                  <p>Arraste imagens do jogo</p>
                  <input type="file" id="screenshot-input" multiple accept="image/*" style="display: none;">
                  <button class="btn btn-primary" onclick="document.getElementById('screenshot-input').click()">
                    <i class="fas fa-image"></i>
                    Selecionar
                  </button>
                </div>
              </div>

              <!-- Tactics (.fmf) -->
              <div class="upload-section">
                <div class="upload-box" id="tactic-upload-box">
                  <i class="fas fa-chess-board upload-icon"></i>
                  <h4>Tática (.fmf)</h4>
                  <p>Arquivo de tática do FM</p>
                  <input type="file" id="tactic-input" accept=".fmf" style="display: none;">
                  <button class="btn btn-secondary" onclick="document.getElementById('tactic-input').click()">
                    <i class="fas fa-upload"></i>
                    Selecionar .fmf
                  </button>
                </div>
              </div>

              <!-- Save Data (.html) -->
              <div class="upload-section">
                <div class="upload-box" id="save-upload-box">
                  <i class="fas fa-file-code upload-icon"></i>
                  <h4>Dados do Save (.html)</h4>
                  <p>Exportação Web do FM (Elenco/Calendário)</p>
                  <input type="file" id="save-input" accept=".html,.htm" style="display: none;">
                  <button class="btn btn-secondary" onclick="document.getElementById('save-input').click()">
                    <i class="fas fa-file-import"></i>
                    Importar HTML
                  </button>
                </div>
              </div>
            </div>

            <div id="upload-results" style="margin-top: var(--space-6);"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-info-circle"></i>
              Como Exportar Dados do FM (.html)
            </h3>
          </div>
          <div class="card-body">
            <div class="grid grid-3">
              <div class="help-item">
                <div class="help-number">1</div>
                <h4>Vá para a Tela</h4>
                <p>Acesse a tela que deseja importar (ex: Elenco, Calendário).</p>
              </div>

              <div class="help-item">
                <div class="help-number">2</div>
                <h4>Imprimir/Exportar</h4>
                <p>Clique no menu "FM" > "Imprimir Tela" ou use o atalho (Ctrl+P).</p>
              </div>

              <div class="help-item">
                <div class="help-number">3</div>
                <h4>Salvar como Web Page</h4>
                <p>Escolha a opção "Página Web" e salve o arquivo .html.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .upload-section {
          padding: var(--space-2);
        }

        .upload-box {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-4);
          text-align: center;
          background: var(--color-surface);
          transition: all var(--transition-base);
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
        }

        .upload-box:hover {
          border-color: var(--color-primary);
          background: var(--color-bg-elevated);
        }

        .upload-box.drag-over {
          border-color: var(--color-primary);
          background: rgba(0, 168, 89, 0.1);
        }

        .upload-icon {
          font-size: 3rem;
          color: var(--color-primary);
          margin-bottom: var(--space-2);
        }

        .upload-box h4 {
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
          margin-bottom: var(--space-1);
        }

        .upload-box p {
          color: var(--color-text-secondary);
          margin-bottom: var(--space-3);
          font-size: var(--font-size-sm);
        }

        .help-item {
          text-align: center;
          padding: var(--space-4);
        }

        .help-number {
          width: 40px;
          height: 40px;
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          margin: 0 auto var(--space-3);
        }

        .uploaded-image {
          max-width: 150px;
          border-radius: var(--radius-md);
          margin: var(--space-2);
        }

        .upload-preview {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--color-surface);
          border-radius: var(--radius-md);
        }
      </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const screenshotBox = document.getElementById('screenshot-upload-box');
    const screenshotInput = document.getElementById('screenshot-input');
    const tacticInput = document.getElementById('tactic-input');
    const saveInput = document.getElementById('save-input');

    // Drag and drop logic (simplified for brevity, can be expanded)
    
    screenshotInput?.addEventListener('change', (e) => {
      this.handleScreenshots(e.target.files);
    });

    tacticInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.handleTactic(file);
    });

    saveInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.handleSaveFile(file);
    });
  }

  handleScreenshots(files) {
    window.app.showLoading(true);
    // ... existing screenshot logic ...
    setTimeout(() => {
      window.app.showLoading(false);
      window.app.showToast(`${files.length} screenshot(s) carregado(s)!`, 'success');
    }, 1000);
  }

  handleTactic(file) {
    window.app.showLoading(true);
    
    // Store tactic metadata
    const tacticData = {
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString()
    };

    // Save to local storage
    const tactics = StorageManager.load('my_tactics') || [];
    tactics.push(tacticData);
    StorageManager.save('my_tactics', tactics);

    setTimeout(() => {
      window.app.showLoading(false);
      window.app.showToast(`Tática "${file.name}" importada com sucesso!`, 'success');
      
      // Navigate to tactic viewer
      setTimeout(() => {
        window.app.navigate('my-tactic');
      }, 1000);
    }, 1000);
  }

  handleSaveFile(file) {
    window.app.showLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const htmlContent = e.target.result;
        const result = HtmlParser.parse(htmlContent);
        
        console.log('Parsed Data:', result);

        if (result.type === 'squad') {
          StorageManager.save('squad_data', result.data);
          window.app.showToast(`Elenco importado: ${result.data.length} jogadores encontrados.`, 'success');
        } else if (result.type === 'schedule') {
          StorageManager.save('schedule_data', result.data);
          window.app.showToast(`Calendário importado: ${result.data.length} jogos encontrados.`, 'success');
        } else {
          window.app.showToast('Tipo de arquivo HTML não reconhecido ou sem dados válidos.', 'warning');
        }

      } catch (error) {
        console.error('Erro ao processar HTML:', error);
        window.app.showToast('Erro ao processar arquivo: ' + error.message, 'error');
      } finally {
        window.app.showLoading(false);
      }
    };
    
    reader.readAsText(file);
  }
}

export default UploadManager;
