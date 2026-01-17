/**
 * MAIN APPLICATION CONTROLLER
 * FM Tactical Assistant - Football Manager Analysis Tool
 */

import { Dashboard } from './components/Dashboard.js';
import { AssistantProfile } from './components/AssistantProfile.js';
import { OpponentAnalysis } from './components/OpponentAnalysis.js';
import { SquadAnalysis } from './components/SquadAnalysis.js';
import { TacticalRecommendations } from './components/TacticalRecommendations.js';
import { UploadManager } from './components/UploadManager.js';
import { CommunityTactics } from './components/CommunityTactics.js';
import { TacticViewer } from './components/TacticViewer.js';
import { VoiceCoach } from './components/VoiceCoach.js';
import { ImageGenerator } from './utils/ImageGenerator.js';
import { StorageManager } from './utils/StorageManager.js';

class FMAssistantApp {
  constructor() {
    console.log('🚀 Inicializando FM Assistant App...');
    
    this.currentPage = 'dashboard';
    this.contentContainer = document.getElementById('content');
    this.pageTitle = document.getElementById('page-title');
    
    console.log('📦 Criando componentes...');
    
    // Components
    try {
      this.components = {
        dashboard: new Dashboard(this.contentContainer),
        profile: new AssistantProfile(this.contentContainer),
        opponent: new OpponentAnalysis(this.contentContainer),
        squad: new SquadAnalysis(this.contentContainer),
        tactics: new TacticalRecommendations(this.contentContainer),
        'my-tactic': new TacticViewer(this.contentContainer),
        upload: new UploadManager(this.contentContainer),
        'community-tactics': new CommunityTactics(this.contentContainer)
      };
      console.log('✅ Componentes criados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar componentes:', error);
      this.showError('Erro ao inicializar componentes: ' + error.message);
    }

    // Initialize Voice Coach (global, not page-specific)
    try {
      this.voiceCoach = new VoiceCoach();
      console.log('🎙️ Voice Coach inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar Voice Coach:', error);
    }

    // Make app accessible globally
    window.app = this;
    
    this.init();
  }

  init() {
    console.log('⚙️ Inicializando app...');
    try {
      this.setupNavigation();
      this.setupThemeToggle();
      this.loadInitialPage();
      this.checkFirstVisit();
      console.log('✅ App inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      this.showError('Erro na inicialização: ' + error.message);
    }
  }

  /**
   * Setup navigation listeners
   */
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        this.navigate(page);
      });
    });
  }

  /**
   * Navigate to a page
   */
  navigate(page) {
    console.log(`🧭 Navegando para: ${page}`);
    
    if (!this.components[page]) {
      console.error(`❌ Página "${page}" não encontrada`);
      this.showError(`Página "${page}" não encontrada`);
      return;
    }

    try {
      // Update navigation active state
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
          item.classList.add('active');
        }
      });

      // Update page title
      const titles = {
        dashboard: 'Dashboard',
        profile: 'Meu Assistente',
        opponent: 'Análise do Adversário',
        squad: 'Meu Plantel',
        tactics: 'Recomendações Táticas',
        'my-tactic': 'Minha Tática',
        upload: 'Upload de Dados',
        'community-tactics': 'Táticas da Comunidade'
      };
      this.pageTitle.textContent = titles[page] || 'FM Assistant';

      // Render component
      console.log(`📄 Renderizando componente: ${page}`);
      this.currentPage = page;
      this.components[page].render();
      console.log(`✅ Componente renderizado: ${page}`);

      // Scroll to top
      this.contentContainer.scrollTop = 0;
    } catch (error) {
      console.error(`❌ Erro ao navegar para ${page}:`, error);
      this.showError('Erro ao carregar página: ' + error.message);
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const container = this.contentContainer;
    if (container) {
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <div style="background: var(--color-error); color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Erro:</strong> ${message}
          </div>
          <p style="color: var(--color-text-secondary);">
            Verifique o console do navegador (F12) para mais detalhes.
          </p>
          <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">
            <i class="fas fa-redo"></i>
            Recarregar Página
          </button>
        </div>
      `;
    }
    this.showToast(message, 'error');
  }

  /**
   * Setup theme toggle
   */
  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      themeToggle.innerHTML = newTheme === 'light' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
      
      this.showToast(`Tema ${newTheme === 'light' ? 'claro' : 'escuro'} ativado`, 'info');
    });
  }

  /**
   * Load initial page
   */
  loadInitialPage() {
    const hash = window.location.hash.substring(1);
    const page = hash || 'dashboard';
    this.navigate(page);
  }

  /**
   * Check if first visit and show welcome
   */
  checkFirstVisit() {
    const hasVisited = localStorage.getItem('fm_assistant_visited');
    
    if (!hasVisited) {
      setTimeout(() => {
        this.showToast('Bem-vindo ao FM Tactical Assistant! 🎉', 'success');
        localStorage.setItem('fm_assistant_visited', 'true');
      }, 1000);
    }
  }

  /**
   * Show loading overlay
   */
  showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('active', show);
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };

    toast.innerHTML = `
      <i class="fas fa-${icons[type] || 'info-circle'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 4000);
  }

  /**
   * Generate assistant avatar
   */
  async generateAssistantAvatar(profile) {
    this.showLoading(true);

    try {
      // Generate avatar using ImageGenerator
      const avatarUrl = await ImageGenerator.generateAvatar(profile);
      
      // Save to profile
      const savedProfile = StorageManager.load(StorageManager.KEYS.ASSISTANT_PROFILE) || profile;
      savedProfile.avatar = avatarUrl;
      StorageManager.save(StorageManager.KEYS.ASSISTANT_PROFILE, savedProfile);

      this.showLoading(false);
      this.showToast('Avatar gerado com sucesso!', 'success');

      // Refresh profile page
      if (this.currentPage === 'profile') {
        this.components.profile.profile = savedProfile;
        this.components.profile.render();
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      this.showLoading(false);
      this.showToast('Erro ao gerar avatar', 'error');
    }
  }

  /**
   * Export analysis report
   */
  exportAnalysis(analysisData) {
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fm-analysis-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showToast('Análise exportada com sucesso!', 'success');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado, iniciando FM Assistant...');
  try {
    const app = new FMAssistantApp();
    console.log('✅ FM Assistant iniciado com sucesso!');
  } catch (error) {
    console.error('❌ ERRO FATAL ao iniciar aplicação:', error);
    console.error('Stack trace:', error.stack);
    
    // Show error in UI
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = `
        <div style="padding: 3rem; text-align: center; max-width: 600px; margin: 0 auto;">
          <div style="background: #ef4444; color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
            <i class="fas fa-times-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h2 style="margin: 0 0 1rem 0;">Erro ao Iniciar Aplicação</h2>
            <p style="margin: 0; font-size: 0.9rem;">${error.message}</p>
          </div>
          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: 8px; text-align: left;">
            <h3 style="color: var(--color-text-primary); margin-top: 0;">Como Corrigir:</h3>
            <ol style="color: var(--color-text-secondary); line-height: 1.8;">
              <li>Abra o Console do Navegador (pressione F12)</li>
              <li>Vá para a aba "Console"</li>
              <li>Procure por mensagens de erro em vermelho</li>
              <li>Verifique se todos os arquivos JavaScript foram carregados</li>
            </ol>
          </div>
          <button onclick="location.reload()" style="margin-top: 2rem; padding: 1rem 2rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600;">
            <i class="fas fa-redo"></i> Recarregar Página
          </button>
        </div>
      `;
    }
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('🚨 Erro global capturado:', event.error);
});

export default FMAssistantApp;

