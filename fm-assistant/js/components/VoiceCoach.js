/**
 * VOICE COACH COMPONENT
 * Real-time voice conversation with FM Assistant using Ultravox AI
 */

import { VoiceCoachConfig } from '../config/voiceCoachConfig.js';
import { UltravoxSession } from 'ultravox-client';

export class VoiceCoach {
  constructor() {
    this.session = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.isSpeaking = false;
    this.transcript = [];
    
    this.createUI();
    this.setupEventListeners();
  }

  /**
   * Create voice coach UI
   */
  createUI() {
    // Create floating button
    const button = document.createElement('button');
    button.id = 'voice-coach-button';
    button.className = 'voice-coach-button';
    button.innerHTML = `
      <i class="fas fa-walkie-talkie"></i>
      <span class="voice-coach-status-text">Falar com o Coach</span>
    `;
    button.title = 'Conversar por voz com o assistente técnico';
    document.body.appendChild(button);
    this.button = button;

    // Create modal for conversation
    const modal = document.createElement('div');
    modal.id = 'voice-coach-modal';
    modal.className = 'voice-coach-modal';
    modal.innerHTML = `
      <div class="voice-coach-modal-content">
        <div class="voice-coach-header">
          <h3>
            <i class="fas fa-headset"></i>
            Conversa com o Coach
          </h3>
          <button class="voice-coach-close" title="Fechar">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="voice-coach-avatar-section" id="voice-coach-avatar">
          <div class="coach-avatar-container">
            <img src="${VoiceCoachConfig.getAvatar() || 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=Black&facialHairType=BeardMedium&clotheType=BlazerShirt&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light'}" 
                 alt="Coach Avatar" 
                 class="coach-avatar" 
                 id="coach-avatar-img">
            <div class="speaking-indicator" id="speaking-indicator"></div>
          </div>
        </div>
        
        <div class="voice-coach-status-bar">
          <div class="status-indicator">
            <div class="status-dot"></div>
            <span class="status-label">Desconectado</span>
          </div>
          <div class="audio-visualizer">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>

        <div class="voice-coach-transcript" id="voice-transcript">
          <div class="transcript-welcome">
            <i class="fas fa-info-circle"></i>
            <p>Clique em "Conectar" e comece a fazer perguntas sobre Football Manager!</p>
            <div class="quick-tips">
              <strong>Dicas rápidas:</strong>
              <ul>
                ${VoiceCoachConfig.quickTips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="voice-coach-controls">
          <button class="voice-coach-modal-btn" id="voice-connect-btn" title="Conectar">
            <i class="fas fa-walkie-talkie"></i>
          </button>
          <button class="btn-voice-danger" id="voice-disconnect-btn" style="display: none;">
            <i class="fas fa-phone-slash"></i>
            Desconectar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Button click - toggle modal
    this.button.addEventListener('click', () => {
      this.toggleModal();
    });

    // Close button
    this.modal.querySelector('.voice-coach-close').addEventListener('click', () => {
      this.hideModal();
    });

    // Connect button
    this.modal.querySelector('#voice-connect-btn').addEventListener('click', () => {
      this.connect();
    });

    // Disconnect button
    this.modal.querySelector('#voice-disconnect-btn').addEventListener('click', () => {
      this.disconnect();
    });

    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });
  }

  /**
   * Toggle modal visibility
   */
  toggleModal() {
    if (this.modal.classList.contains('active')) {
      this.hideModal();
    } else {
      this.showModal();
    }
  }

  /**
   * Show modal
   */
  showModal() {
    // Reload avatar from profile
    this.reloadAvatar();
    this.modal.classList.add('active');
  }

  /**
   * Reload avatar from current profile
   */
  reloadAvatar() {
    const avatarImg = this.modal.querySelector('#coach-avatar-img');
    if (avatarImg) {
      const currentAvatar = VoiceCoachConfig.getAvatar();
      if (currentAvatar) {
        avatarImg.src = currentAvatar;
      }
    }
  }

  /**
   * Hide modal
   */
  hideModal() {
    this.modal.classList.remove('active');
  }

  /**
   * Update status display
   */
  updateStatus(status, label) {
    const statusBar = this.modal.querySelector('.voice-coach-status-bar');
    const statusDot = statusBar.querySelector('.status-dot');
    const statusLabel = statusBar.querySelector('.status-label');
    const visualizer = statusBar.querySelector('.audio-visualizer');
    const avatarSection = this.modal.querySelector('.voice-coach-avatar-section');
    
    // Remove all status classes
    statusDot.className = 'status-dot';
    visualizer.className = 'audio-visualizer';
    
    // Add new status
    statusDot.classList.add(`status-${status}`);
    statusLabel.textContent = label;
    
    // Update button
    this.button.classList.remove('idle', 'connecting', 'listening', 'speaking');
    this.button.classList.add(status);

    // Update modal button
    const modalBtn = this.modal.querySelector('#voice-connect-btn');
    if (modalBtn) {
      modalBtn.classList.remove('idle', 'connecting', 'listening', 'speaking');
      modalBtn.classList.add(status);
    }
    
    // Update avatar section
    if (avatarSection) {
      avatarSection.classList.remove('idle', 'connecting', 'listening', 'speaking');
      avatarSection.classList.add(status);
    }
    
    if (status === 'listening' || status === 'speaking') {
      visualizer.classList.add('active');
    }
  }

  /**
   * Add message to transcript
   */
  addTranscript(role, text) {
    const transcriptDiv = this.modal.querySelector('#voice-transcript');
    
    // Remove welcome message if exists
    const welcome = transcriptDiv.querySelector('.transcript-welcome');
    if (welcome) {
      welcome.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `transcript-message transcript-${role}`;
    
    const icon = role === 'user' ? 'user' : 'headset';
    const label = role === 'user' ? 'Você' : 'Coach';
    
    messageDiv.innerHTML = `
      <div class="message-header">
        <i class="fas fa-${icon}"></i>
        <strong>${label}</strong>
        <span class="message-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="message-text">${text}</div>
    `;
    
    transcriptDiv.appendChild(messageDiv);
    
    // Scroll to bottom
    transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
    
    // Store in memory
    this.transcript.push({ role, text, timestamp: new Date() });
  }

  /**
   * Show error message
   */
  showError(message) {
    const transcriptDiv = this.modal.querySelector('#voice-transcript');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'transcript-error';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;
    transcriptDiv.appendChild(errorDiv);
    transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
  }

  /**
   * Connect to Ultravox
   */
  async connect() {
    if (this.isConnecting || this.isConnected) return;

    try {
      this.isConnecting = true;
      this.updateStatus('connecting', 'Conectando...');
      
      // Show/hide buttons
      this.modal.querySelector('#voice-connect-btn').style.display = 'none';
      this.modal.querySelector('#voice-disconnect-btn').style.display = 'inline-flex';

      console.log('🎙️ === INICIANDO CONEXÃO ===');
      console.log('Server URL:', VoiceCoachConfig.serverUrl);
      
      const systemPrompt = VoiceCoachConfig.getSystemPrompt();
      console.log('System Prompt length:', systemPrompt.length);
      
      const requestBody = {
        systemPrompt: systemPrompt,
        voice: VoiceCoachConfig.voiceSettings.voice,
        temperature: VoiceCoachConfig.voiceSettings.temperature
      };
      
      console.log('Request body:', requestBody);
      
      const url = `${VoiceCoachConfig.serverUrl}/api/ultravox/create-call`;
      console.log('Full URL:', url);

      console.log('📤 Enviando requisição para backend...');
      
      // Create call via backend
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Resposta recebida!');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error('Falha ao criar chamada no servidor');
      }

      const data = await response.json();
      console.log('✅ Dados recebidos:', data);
      
      const { joinUrl } = data;
      
      if (!joinUrl) {
        throw new Error('joinUrl não retornado pelo servidor');
      }
      
      console.log('Join URL:', joinUrl);

      // Create Ultravox session
      console.log('📞 Criando sessão Ultravox...');
      this.session = new UltravoxSession();
      
      // Setup event listeners
      this.session.addEventListener('status', (event) => {
        console.log('Session status:', event.state);
        
        if (event.state === 'idle') {
          this.updateStatus('idle', 'Ocioso');
        } else if (event.state === 'listening') {
          this.updateStatus('listening', 'Ouvindo...');
          this.isSpeaking = false;
        } else if (event.state === 'thinking') {
          this.updateStatus('thinking', 'Pensando...');
        } else if (event.state === 'speaking') {
          this.updateStatus('speaking', 'Respondendo...');
          this.isSpeaking = true;
        }
      });

      this.session.addEventListener('transcripts', (event) => {
        console.log('Transcripts:', event);
        
        // User speech
        if (event.role === 'user' && event.text) {
          this.addTranscript('user', event.text);
        }
        
        // Agent speech
        if (event.role === 'agent' && event.text) {
          this.addTranscript('agent', event.text);
        }
      });

      this.session.addEventListener('error', (event) => {
        console.error('Session error:', event);
        this.showError('Erro na conexão: ' + event.message);
        this.disconnect();
      });

      // Join the call
      console.log('🔗 Entrando na call...');
      await this.session.joinCall(joinUrl);
      
      this.isConnected = true;
      this.isConnecting = false;
      this.updateStatus('listening', 'Conectado - Pode falar!');
      
      console.log('✅ CONEXÃO ESTABELECIDA!');
      this.addTranscript('agent', 'Olá! Sou seu assistente técnico. Como posso ajudar com suas táticas hoje?');

    } catch (error) {
      console.error('❌ === ERRO NA CONEXÃO ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      this.isConnecting = false;
      this.updateStatus('idle', 'Erro ao conectar');
      this.showError('Não foi possível conectar: ' + error.message);
      
      // Reset buttons
      this.modal.querySelector('#voice-connect-btn').style.display = 'inline-flex';
      this.modal.querySelector('#voice-disconnect-btn').style.display = 'none';
    }
  }

  /**
   * Disconnect from Ultravox
   */
  async disconnect() {
    if (this.session && this.isConnected) {
      try {
        await this.session.leaveCall();
        this.session = null;
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
    
    this.isConnected = false;
    this.isConnecting = false;
    this.isSpeaking = false;
    this.updateStatus('idle', 'Desconectado');
    
    // Show/hide buttons
    this.modal.querySelector('#voice-connect-btn').style.display = 'inline-flex';
    this.modal.querySelector('#voice-disconnect-btn').style.display = 'none';
    
    this.addTranscript('agent', 'Conversa encerrada. Até a próxima!');
  }

  /**
   * Cleanup
   */
  destroy() {
    this.disconnect();
    if (this.button) this.button.remove();
    if (this.modal) this.modal.remove();
  }
}

export default VoiceCoach;
