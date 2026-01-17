import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Utilitário de Processamento de Imagens
 * Funções para redimensionar, otimizar e manipular imagens de capa
 */
class ImageProcessor {
  /**
   * Dimensões recomendadas para Amazon KDP
   */
  static KDP_DIMENSIONS = {
    width: 1600,
    height: 2400,
    aspectRatio: 2 / 3, // altura/largura
  };

  /**
   * Redimensiona imagem para dimensões ideais do KDP
   * @param {string} inputPath - Caminho da imagem de entrada
   * @param {string} outputPath - Caminho da imagem de saída
   * @param {Object} options - Opções de redimensionamento
   * @returns {Promise<Object>} - Informações da imagem processada
   */
  static async resizeForKDP(inputPath, outputPath, options = {}) {
    const {
      width = this.KDP_DIMENSIONS.width,
      height = this.KDP_DIMENSIONS.height,
      fit = 'cover', // 'cover', 'contain', 'fill'
      quality = 95,
    } = options;

    try {
      const metadata = await sharp(inputPath).metadata();

      console.log(`Redimensionando imagem de ${metadata.width}x${metadata.height} para ${width}x${height}`);

      await sharp(inputPath)
        .resize(width, height, {
          fit,
          position: 'center',
          withoutEnlargement: false,
        })
        .jpeg({ quality, progressive: true })
        .toFile(outputPath);

      const outputMetadata = await sharp(outputPath).metadata();

      console.log(`Imagem redimensionada com sucesso: ${outputPath}`);

      return {
        width: outputMetadata.width,
        height: outputMetadata.height,
        format: outputMetadata.format,
        size: (await fs.stat(outputPath)).size,
      };
    } catch (error) {
      console.error('Erro ao redimensionar imagem:', error);
      throw new Error(`Falha ao redimensionar imagem: ${error.message}`);
    }
  }

  /**
   * Otimiza imagem mantendo qualidade
   * @param {string} imagePath - Caminho da imagem
   * @param {string} outputPath - Caminho de saída (opcional, sobrescreve se não fornecido)
   * @param {Object} options - Opções de otimização
   * @returns {Promise<Object>} - Informações da imagem otimizada
   */
  static async optimizeImage(imagePath, outputPath = null, options = {}) {
    const output = outputPath || imagePath;
    const { quality = 90 } = options;

    try {
      const metadata = await sharp(imagePath).metadata();
      const originalSize = (await fs.stat(imagePath)).size;

      console.log(`Otimizando imagem: ${imagePath} (${this.formatBytes(originalSize)})`);

      if (metadata.format === 'png') {
        await sharp(imagePath).png({ quality, compressionLevel: 9 }).toFile(output);
      } else {
        await sharp(imagePath).jpeg({ quality, progressive: true }).toFile(output);
      }

      const optimizedSize = (await fs.stat(output)).size;
      const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

      console.log(
        `Imagem otimizada: ${this.formatBytes(optimizedSize)} (redução de ${reduction.toFixed(1)}%)`
      );

      return {
        originalSize,
        optimizedSize,
        reduction: reduction.toFixed(1),
      };
    } catch (error) {
      console.error('Erro ao otimizar imagem:', error);
      throw new Error(`Falha ao otimizar imagem: ${error.message}`);
    }
  }

  /**
   * Obtém as dimensões de uma imagem
   * @param {string} imagePath - Caminho da imagem
   * @returns {Promise<Object>} - Dimensões da imagem
   */
  static async getImageDimensions(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        aspectRatio: metadata.height / metadata.width,
      };
    } catch (error) {
      console.error('Erro ao obter dimensões da imagem:', error);
      throw new Error(`Falha ao ler imagem: ${error.message}`);
    }
  }

  /**
   * Valida se a imagem atende aos requisitos mínimos do KDP
   * @param {string} imagePath - Caminho da imagem
   * @returns {Promise<Object>} - Resultado da validação
   */
  static async validateDimensions(imagePath) {
    const dimensions = await this.getImageDimensions(imagePath);
    const minWidth = 1000;
    const minHeight = 1500;

    const isValidWidth = dimensions.width >= minWidth;
    const isValidHeight = dimensions.height >= minHeight;
    const isValid = isValidWidth && isValidHeight;

    return {
      isValid,
      dimensions,
      requirements: {
        minWidth,
        minHeight,
        recommendedWidth: this.KDP_DIMENSIONS.width,
        recommendedHeight: this.KDP_DIMENSIONS.height,
      },
      messages: [
        isValidWidth ? '✓ Largura adequada' : `✗ Largura mínima: ${minWidth}px (atual: ${dimensions.width}px)`,
        isValidHeight ? '✓ Altura adequada' : `✗ Altura mínima: ${minHeight}px (atual: ${dimensions.height}px)`,
      ],
    };
  }

  /**
   * Converte bytes para formato legível
   * @param {number} bytes - Tamanho em bytes
   * @returns {string} - Tamanho formatado
   */
  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Adiciona texto sobreposto à imagem (título do livro)
   * @param {string} imagePath - Caminho da imagem base
   * @param {string} outputPath - Caminho da imagem de saída
   * @param {string} text - Texto a adicionar
   * @param {Object} options - Opções de texto
   * @returns {Promise<void>}
   */
  static async addTextOverlay(imagePath, outputPath, text, options = {}) {
    const {
      fontSize = 80,
      fontWeight = 'bold',
      color = 'white',
      position = 'top', // 'top', 'center', 'bottom'
    } = options;

    // Nota: Esta é uma implementação simplificada
    // Para adicionar texto com fontes personalizadas, seria necessário usar SVG
    // ou uma biblioteca adicional como node-canvas

    console.log('addTextOverlay: Funcionalidade planejada para versão futura');
    console.log(`Texto: ${text}, Posição: ${position}`);

    // Por enquanto, apenas copia a imagem
    await fs.copyFile(imagePath, outputPath);

    return {
      message: 'Funcionalidade de sobreposição de texto será implementada em versão futura',
      note: 'Recomenda-se adicionar texto usando ferramentas de design gráfico',
    };
  }
}

export default ImageProcessor;
