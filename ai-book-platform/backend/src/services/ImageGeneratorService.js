import { getOpenAI } from '../config/ai.js';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serviço de Geração de Imagens
 * Responsável por gerar capas de livros usando DALL-E 3
 */
class ImageGeneratorService {
  constructor() {
    this.openai = null;
    this.coversDir = process.env.COVERS_DIR || './uploads/covers';
  }

  /**
   * Inicializa o cliente OpenAI
   */
  initOpenAI() {
    if (!this.openai) {
      this.openai = getOpenAI();
    }
  }

  /**
   * Gera uma imagem de capa usando DALL-E 3
   * @param {string} prompt - Prompt descritivo da imagem
   * @param {Object} options - Opções de geração
   * @param {string} options.quality - 'standard' ou 'hd' (default: 'hd')
   * @param {string} options.size - '1024x1024', '1024x1792', '1792x1024' (default: '1024x1792')
   * @param {string} options.projectId - ID do projeto
   * @returns {Promise<Object>} - Informações da imagem gerada
   */
  async generateCover(prompt, options = {}) {
    this.initOpenAI();

    const {
      quality = process.env.DEFAULT_COVER_QUALITY || 'hd',
      size = process.env.DEFAULT_COVER_SIZE || '1024x1792',
      projectId,
    } = options;

    if (!projectId) {
      throw new Error('projectId é obrigatório');
    }

    try {
      console.log(`Gerando imagem de capa para projeto ${projectId}...`);
      console.log(`Prompt: ${prompt.substring(0, 100)}...`);

      // Gerar imagem com DALL-E 3
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality,
        response_format: 'url',
      });

      const imageUrl = response.data[0].url;
      const revisedPrompt = response.data[0].revised_prompt;

      console.log(`Imagem gerada com sucesso: ${imageUrl}`);

      // Criar diretório do projeto se não existir
      const projectDir = path.join(this.coversDir, projectId);
      await fs.mkdir(projectDir, { recursive: true });

      // Download da imagem
      const imagePath = path.join(projectDir, 'original.png');
      await this.downloadImage(imageUrl, imagePath);

      console.log(`Imagem salva em: ${imagePath}`);

      return {
        imageUrl,
        imagePath,
        revisedPrompt,
        quality,
        size,
      };
    } catch (error) {
      console.error('Erro ao gerar imagem de capa:', error);

      // Tratamento específico de erros da OpenAI
      if (error.status === 429) {
        throw new Error('Limite de requisições atingido. Tente novamente em alguns minutos.');
      } else if (error.status === 400) {
        throw new Error(`Prompt inválido: ${error.message}`);
      } else if (error.status === 401) {
        throw new Error('Chave API da OpenAI inválida ou não configurada.');
      }

      throw new Error(`Falha ao gerar imagem: ${error.message}`);
    }
  }

  /**
   * Faz download de uma imagem de uma URL e salva localmente
   * @param {string} imageUrl - URL da imagem
   * @param {string} savePath - Caminho onde salvar a imagem
   * @returns {Promise<void>}
   */
  async downloadImage(imageUrl, savePath) {
    return new Promise((resolve, reject) => {
      const file = fs.open(savePath, 'w');

      https
        .get(imageUrl, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Falha ao baixar imagem: ${response.statusCode}`));
            return;
          }

          const chunks = [];

          response.on('data', (chunk) => {
            chunks.push(chunk);
          });

          response.on('end', async () => {
            try {
              const buffer = Buffer.concat(chunks);
              await fs.writeFile(savePath, buffer);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  /**
   * Remove a imagem de capa de um projeto
   * @param {string} projectId - ID do projeto
   * @returns {Promise<void>}
   */
  async deleteCover(projectId) {
    const projectDir = path.join(this.coversDir, projectId);

    try {
      // Remove todo o diretório do projeto
      await fs.rm(projectDir, { recursive: true, force: true });
      console.log(`Capa do projeto ${projectId} removida com sucesso`);
    } catch (error) {
      console.error(`Erro ao remover capa: ${error.message}`);
      // Não lançar erro se o diretório não existir
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Verifica se existe uma imagem de capa para o projeto
   * @param {string} projectId - ID do projeto
   * @returns {Promise<boolean>}
   */
  async hasCover(projectId) {
    const imagePath = path.join(this.coversDir, projectId, 'original.png');

    try {
      await fs.access(imagePath);
      return true;
    } catch {
      return false;
    }
  }
}

export default ImageGeneratorService;
