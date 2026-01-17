import express from 'express';
import prisma from '../config/database.js';
import { authMiddleware } from '../config/jwt.js';
import DocumentConverter from '../utils/DocumentConverter.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
router.use(authMiddleware);

/**
 * POST /api/export/docx/:projectId
 * Exportar para DOCX
 */
router.post('/docx/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: {
        chapters: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Montar markdown completo
    const markdown = buildCompleteMarkdown(project);

    // Converter para DOCX
    const converter = new DocumentConverter();
    const fileName = `${sanitizeFileName(project.titulo)}.docx`;
    const outputPath = path.join(__dirname, '../../exports', fileName);

    await converter.markdownToDocx(markdown, outputPath);

    // Salvar registro no banco
    const fileSize = fs.statSync(outputPath).size;
    const generatedFile = await prisma.generatedFile.create({
      data: {
        projectId,
        fileName,
        fileType: 'docx',
        filePath: outputPath,
        fileSize,
        languageCode: project.idioma,
      },
    });

    res.json({
      message: 'DOCX gerado com sucesso',
      file: generatedFile,
      downloadUrl: `/exports/${fileName}`,
    });
  } catch (error) {
    console.error('Erro ao exportar DOCX:', error);
    res.status(500).json({ error: 'Erro ao exportar DOCX', details: error.message });
  }
});

/**
 * POST /api/export/epub/:projectId
 * Exportar para EPUB
 */
router.post('/epub/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: {
        chapters: { orderBy: { order: 'asc' } },
        user: true,
        coverImage: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const markdown = buildCompleteMarkdown(project);

    const metadata = {
      title: project.titulo,
      author: project.user.name,
      language: project.idioma,
      coverImage: project.coverImage?.imagePath,
    };

    const converter = new DocumentConverter();
    const fileName = `${sanitizeFileName(project.titulo)}.epub`;
    const outputPath = path.join(__dirname, '../../exports', fileName);

    await converter.markdownToEpub(markdown, metadata, outputPath);

    const fileSize = fs.statSync(outputPath).size;
    const generatedFile = await prisma.generatedFile.create({
      data: {
        projectId,
        fileName,
        fileType: 'epub',
        filePath: outputPath,
        fileSize,
        languageCode: project.idioma,
      },
    });

    res.json({
      message: 'EPUB gerado com sucesso',
      file: generatedFile,
      downloadUrl: `/exports/${fileName}`,
    });
  } catch (error) {
    console.error('Erro ao exportar EPUB:', error);
    res.status(500).json({ error: 'Erro ao exportar EPUB', details: error.message });
  }
});

/**
 * POST /api/export/pdf/:projectId
 * Exportar para PDF
 */
router.post('/pdf/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: {
        chapters: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const markdown = buildCompleteMarkdown(project);

    const converter = new DocumentConverter();
    const fileName = `${sanitizeFileName(project.titulo)}.pdf`;
    const outputPath = path.join(__dirname, '../../exports', fileName);

    await converter.markdownToPdf(markdown, outputPath);

    const fileSize = fs.statSync(outputPath).size;
    const generatedFile = await prisma.generatedFile.create({
      data: {
        projectId,
        fileName,
        fileType: 'pdf',
        filePath: outputPath,
        fileSize,
        languageCode: project.idioma,
      },
    });

    res.json({
      message: 'PDF gerado com sucesso',
      file: generatedFile,
      downloadUrl: `/exports/${fileName}`,
    });
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({ error: 'Erro ao exportar PDF', details: error.message });
  }
});

/**
 * GET /api/export/files/:projectId
 * Listar arquivos gerados
 */
router.get('/files/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const files = await prisma.generatedFile.findMany({
      where: {
        projectId,
        project: { userId: req.userId },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ files });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
});

// Funções auxiliares

function buildCompleteMarkdown(project) {
  let markdown = `# ${project.titulo}\n\n`;
  
  if (project.subtitulo) {
    markdown += `## ${project.subtitulo}\n\n`;
  }

  markdown += `---\n\n`;

  for (const chapter of project.chapters) {
    if (!chapter.conteudo) continue;
    markdown += `## ${chapter.titulo}\n\n`;
    markdown += `${chapter.conteudo}\n\n`;
    markdown += `---\n\n`;
  }

  return markdown;
}

function sanitizeFileName(name) {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

export default router;
