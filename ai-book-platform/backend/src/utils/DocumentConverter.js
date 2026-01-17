import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Conversor de Documentos usando Pandoc
 * Converte Markdown para DOCX, EPUB e PDF
 */
class DocumentConverter {
  constructor() {
    this.pandocPath = 'pandoc'; // Assume que pandoc está no PATH
  }

  /**
   * Verifica se Pandoc está instalado
   */
  async checkPandoc() {
    try {
      await execAsync(`${this.pandocPath} --version`);
      return true;
    } catch (error) {
      throw new Error('Pandoc não está instalado. Instale com: https://pandoc.org/installing.html');
    }
  }

  /**
   * Converte Markdown para DOCX
   */
  async markdownToDocx(markdown, outputPath) {
    await this.checkPandoc();

    // Criar arquivo temporário
    const tempFile = path.join(path.dirname(outputPath), `temp_${Date.now()}.md`);
    await fs.writeFile(tempFile, markdown, 'utf-8');

    try {
      const command = `${this.pandocPath} "${tempFile}" -o "${outputPath}" --from markdown --to docx`;
      await execAsync(command);
      
      // Remover arquivo temporário
      await fs.unlink(tempFile);
      
      return outputPath;
    } catch (error) {
      await fs.unlink(tempFile).catch(() => {});
      throw new Error(`Erro ao converter para DOCX: ${error.message}`);
    }
  }

  /**
   * Converte Markdown para EPUB
   */
  async markdownToEpub(markdown, metadata, outputPath) {
    await this.checkPandoc();

    const tempFile = path.join(path.dirname(outputPath), `temp_${Date.now()}.md`);
    
    // Adicionar metadados ao markdown
    let fullMarkdown = `---
title: ${metadata.title}
author: ${metadata.author}
language: ${metadata.language}
---

${markdown}`;

    await fs.writeFile(tempFile, fullMarkdown, 'utf-8');

    try {
      let command = `${this.pandocPath} "${tempFile}" -o "${outputPath}" --from markdown --to epub`;
      
      // Adicionar capa se fornecida
      if (metadata.coverImage) {
        command += ` --epub-cover-image="${metadata.coverImage}"`;
      }

      await execAsync(command);
      await fs.unlink(tempFile);
      
      return outputPath;
    } catch (error) {
      await fs.unlink(tempFile).catch(() => {});
      throw new Error(`Erro ao converter para EPUB: ${error.message}`);
    }
  }

  /**
   * Converte Markdown para PDF
   */
  async markdownToPdf(markdown, outputPath) {
    await this.checkPandoc();

    const tempFile = path.join(path.dirname(outputPath), `temp_${Date.now()}.md`);
    await fs.writeFile(tempFile, markdown, 'utf-8');

    try {
      // Usando pdflatex como engine (requer LaTeX instalado)
      // Alternativa: usar wkhtmltopdf ou weasyprint
      const command = `${this.pandocPath} "${tempFile}" -o "${outputPath}" --from markdown --to pdf --pdf-engine=pdflatex`;
      await execAsync(command);
      
      await fs.unlink(tempFile);
      
      return outputPath;
    } catch (error) {
      await fs.unlink(tempFile).catch(() => {});
      
      // Se falhar com pdflatex, tentar com HTML+CSS
      console.warn('PDF com LaTeX falhou, tentando via HTML...');
      return await this.markdownToPdfViaHtml(markdown, outputPath);
    }
  }

  /**
   * Converte Markdown para PDF via HTML (fallback)
   */
  async markdownToPdfViaHtml(markdown, outputPath) {
    const tempFile = path.join(path.dirname(outputPath), `temp_${Date.now()}.md`);
    await fs.writeFile(tempFile, markdown, 'utf-8');

    try {
      const command = `${this.pandocPath} "${tempFile}" -o "${outputPath}" --from markdown --to html5 --standalone --self-contained`;
      await execAsync(command);
      
      await fs.unlink(tempFile);
      
      return outputPath;
    } catch (error) {
      await fs.unlink(tempFile).catch(() => {});
      throw new Error(`Erro ao converter para PDF: ${error.message}`);
    }
  }
}

export default DocumentConverter;
