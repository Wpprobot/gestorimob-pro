/**
 * ASSISTANT PROFILE COMPONENT
 * Allows user to customize their assistant's profile
 */

export class AssistantProfile {
  constructor(container) {
    this.container = container;
    this.profile = this.loadProfile();
  }

  loadProfile() {
    const saved = localStorage.getItem('assistantProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Assistente Técnico',
      age: 45,
      nationality: 'Brasileiro',
      avatar: null,
      experience: 'Experiente',
      specialty: 'Táticas Modernas'
    };
  }

  saveProfile() {
    localStorage.setItem('assistantProfile', JSON.stringify(this.profile));
    window.app.showToast('Perfil salvo com sucesso!', 'success');
  }

  render() {
    this.container.innerHTML = `
      <div class="profile-page">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-user-tie"></i>
              Perfil do Assistente Técnico
            </h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="profile-avatar-section">
                <div class="avatar-preview" id="avatar-preview">
                  ${this.profile.avatar ? 
                    `<img src="${this.profile.avatar}" alt="Avatar">` :
                    `<div class="avatar-placeholder">
                      <i class="fas fa-user"></i>
                    </div>`
                  }
                </div>
                <div class="avatar-actions">
                  <button class="btn btn-primary" id="generate-avatar-btn">
                    <i class="fas fa-magic"></i>
                    Gerar Avatar com IA
                  </button>
                  <button class="btn btn-secondary" id="upload-avatar-btn">
                    <i class="fas fa-upload"></i>
                    Upload de Imagem
                  </button>
                  <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
                </div>
              </div>

              <div class="profile-form">
                <div class="form-group">
                  <label class="form-label">Nome do Assistente</label>
                  <input type="text" class="form-input" id="profile-name" 
                         value="${this.profile.name}" placeholder="Ex: Carlos Silva">
                </div>

                <div class="form-group">
                  <label class="form-label">Idade</label>
                  <input type="number" class="form-input" id="profile-age" 
                         value="${this.profile.age}" min="25" max="80">
                </div>

                <div class="form-group">
                  <label class="form-label">Nacionalidade</label>
                  <input type="text" class="form-input" id="profile-nationality" 
                         value="${this.profile.nationality}" placeholder="Ex: Brasileiro">
                </div>

                <div class="form-group">
                  <label class="form-label">Nível de Experiência</label>
                  <select class="form-select" id="profile-experience">
                    <option value="Iniciante" ${this.profile.experience === 'Iniciante' ? 'selected' : ''}>Iniciante</option>
                    <option value="Intermediário" ${this.profile.experience === 'Intermediário' ? 'selected' : ''}>Intermediário</option>
                    <option value="Experiente" ${this.profile.experience === 'Experiente' ? 'selected' : ''}>Experiente</option>
                    <option value="Lenda" ${this.profile.experience === 'Lenda' ? 'selected' : ''}>Lenda</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Especialidade Tática</label>
                  <select class="form-select" id="profile-specialty">
                    <option value="Táticas Modernas" ${this.profile.specialty === 'Táticas Modernas' ? 'selected' : ''}>Táticas Modernas</option>
                    <option value="Gegenpress" ${this.profile.specialty === 'Gegenpress' ? 'selected' : ''}>Gegenpress</option>
                    <option value="Tiki-Taka" ${this.profile.specialty === 'Tiki-Taka' ? 'selected' : ''}>Tiki-Taka</option>
                    <option value="Contra-Ataque" ${this.profile.specialty === 'Contra-Ataque' ? 'selected' : ''}>Contra-Ataque</option>
                    <option value="Posse de Bola" ${this.profile.specialty === 'Posse de Bola' ? 'selected' : ''}>Posse de Bola</option>
                    <option value="Defesa Sólida" ${this.profile.specialty === 'Defesa Sólida' ? 'selected' : ''}>Defesa Sólida</option>
                  </select>
                </div>

                <button class="btn btn-primary" id="save-profile-btn" style="width: 100%;">
                  <i class="fas fa-save"></i>
                  Salvar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-info-circle"></i>
              Sobre o Assistente
            </h3>
          </div>
          <div class="card-body">
            <div class="assistant-bio">
              <p>
                <strong>${this.profile.name}</strong>, ${this.profile.age} anos, é um assistente técnico ${this.profile.nationality.toLowerCase()} 
                especializado em <strong>${this.profile.specialty}</strong>. Com nível de experiência <strong>${this.profile.experience.toLowerCase()}</strong>, 
                está pronto para fornecer análises táticas profundas e recomendações estratégicas para o seu time no Football Manager.
              </p>
              <p class="mt-4">
                <i class="fas fa-lightbulb text-primary"></i>
                "O sucesso no futebol moderno vem da preparação meticulosa, análise detalhada do adversário e adaptação tática inteligente."
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        .profile-page {
          max-width: 1000px;
        }

        .profile-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }

        .avatar-preview {
          width: 200px;
          height: 200px;
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 4px solid var(--color-primary);
          box-shadow: var(--shadow-lg);
          background: var(--color-surface);
        }

        .avatar-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-elevated) 100%);
          color: var(--color-text-tertiary);
          font-size: 80px;
        }

        .avatar-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          width: 100%;
        }

        .assistant-bio {
          line-height: var(--line-height-relaxed);
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
        }

        .assistant-bio strong {
          color: var(--color-text-primary);
        }
      </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const saveBtn = document.getElementById('save-profile-btn');
    const generateAvatarBtn = document.getElementById('generate-avatar-btn');
    const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');

    saveBtn?.addEventListener('click', () => {
      this.profile.name = document.getElementById('profile-name').value;
      this.profile.age = parseInt(document.getElementById('profile-age').value);
      this.profile.nationality = document.getElementById('profile-nationality').value;
      this.profile.experience = document.getElementById('profile-experience').value;
      this.profile.specialty = document.getElementById('profile-specialty').value;
      this.saveProfile();
      this.render(); // Re-render to update bio
    });

    generateAvatarBtn?.addEventListener('click', () => {
      this.showAvatarSelector();
    });

    uploadAvatarBtn?.addEventListener('click', () => {
      avatarUpload?.click();
    });

    avatarUpload?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profile.avatar = e.target.result;
          this.saveProfile();
          this.render();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Show avatar selection modal
   */
  async showAvatarSelector() {
    // Import avatar library
    const { AvatarLibrary } = await import('../config/avatarLibrary.js');
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'avatar-selector-modal';
    modal.innerHTML = `
      <div class="avatar-selector-content">
        <div class="avatar-selector-header">
          <h3><i class="fas fa-users"></i> Escolha seu Avatar</h3>
          <button class="avatar-selector-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="avatar-selector-grid">
          ${AvatarLibrary.map(avatar => `
            <div class="avatar-option" data-avatar-url="${avatar.url}">
              <img src="${avatar.url}" alt="${avatar.name}">
              <div class="avatar-option-info">
                <strong>${avatar.name}</strong>
                <span>${avatar.age} anos</span>
                <span class="avatar-style">${avatar.style}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.avatar-selector-close');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    const avatarOptions = modal.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
      option.addEventListener('click', () => {
        const avatarUrl = option.dataset.avatarUrl;
        this.profile.avatar = avatarUrl;
        this.saveProfile();
        this.render();
        modal.remove();
      });
    });
    
    // Show modal
    setTimeout(() => modal.classList.add('active'), 10);
  }
}

export default AssistantProfile;
