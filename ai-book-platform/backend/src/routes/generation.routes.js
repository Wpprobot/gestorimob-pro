import express from 'express';
import prisma from '../config/database.js';
import { authMiddleware } from '../config/jwt.js';
import BookPlannerAgent from '../agents/BookPlannerAgent.js';
import BookWriterAgent from '../agents/BookWriterAgent.js';
import EditorAgent from '../agents/EditorAgent.js';
import CoverPrompterAgent from '../agents/CoverPrompterAgent.js';
import ImageGeneratorService from '../services/ImageGeneratorService.js';
import TranslatorAgent from '../agents/TranslatorAgent.js';

const router = express.Router();
router.use(authMiddleware);

/**
 * POST /api/generation/ideas/:projectId
 * Gerar ideias de livro
 */
router.post('/ideas/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Gerar ideias usando o agente
    const planner = new BookPlannerAgent();
    const ideas = await planner.generateIdeas({
      tema: project.tema,
      publicoAlvo: project.publicoAlvo,
      idioma: project.idioma,
      tamanho: project.tamanho,
      tomDeVoz: project.tomDeVoz,
      tipo: project.tipo,
    });

    // Atualizar status do projeto
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'ideias' },
    });

    res.json({
      message: 'Ideias geradas com sucesso',
      ideas,
    });
  } catch (error) {
    console.error('Erro ao gerar ideias:', error);
    res.status(500).json({ error: 'Erro ao gerar ideias', details: error.message });
  }
});

/**
 * POST /api/generation/select-idea/:projectId
 * Selecionar uma ideia e criar capítulos
 */
router.post('/select-idea/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { titulo, subtitulo, sinopse, capitulos } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Atualizar projeto com dados selecionados
    await prisma.project.update({
      where: { id: projectId },
      data: {
        titulo,
        subtitulo,
        sinopse,
        status: 'estruturado',
      },
    });

    // Criar capítulos
    for (let i = 0; i < capitulos.length; i++) {
      await prisma.chapter.create({
        data: {
          projectId,
          order: i + 1,
          titulo: capitulos[i].titulo,
          descricao: capitulos[i].descricao,
          status: 'pending',
        },
      });
    }

    res.json({
      message: 'Ideia selecionada e estrutura criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao selecionar ideia:', error);
    res.status(500).json({ error: 'Erro ao selecionar ideia' });
  }
});

/**
 * POST /api/generation/manuscript/:projectId
 * Gerar manuscrito completo (capítulo por capítulo)
 */
router.post('/manuscript/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: { chapters: { orderBy: { order: 'asc' } } },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (!project.chapters || project.chapters.length === 0) {
      return res.status(400).json({ error: 'Projeto não tem capítulos definidos' });
    }

    // Atualizar status do projeto
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'gerando' },
    });

    // Iniciar geração em background (você pode usar uma fila aqui)
    // Por enquanto, vamos retornar imediatamente
    res.json({
      message: 'Geração de manuscrito iniciada',
      totalChapters: project.chapters.length,
    });

    // Gerar capítulos assincronamente
    generateManuscriptAsync(project);
  } catch (error) {
    console.error('Erro ao iniciar geração:', error);
    res.status(500).json({ error: 'Erro ao iniciar geração' });
  }
});

/**
 * POST /api/generation/revise/:projectId
 * Revisar português do manuscrito
 */
router.post('/revise/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: { chapters: { orderBy: { order: 'asc' } } },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'revisando' },
    });

    res.json({ message: 'Revisão iniciada' });

    // Revisar assincronamente
    reviseManuscriptAsync(project);
  } catch (error) {
    console.error('Erro ao iniciar revisão:', error);
    res.status(500).json({ error: 'Erro ao iniciar revisão' });
  }
});

/**
 * POST /api/generation/cover-prompt/:projectId
 * Gerar prompt de capa
 */
router.post('/cover-prompt/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const prompter = new CoverPrompterAgent();
    const prompts = await prompter.generateCoverPrompt({
      titulo: project.titulo,
      subtitulo: project.subtitulo,
      sinopse: project.sinopse,
      genero: project.tipo,
      publicoAlvo: project.publicoAlvo,
      tom: project.tomDeVoz,
    });

    // Salvar no banco
    await prisma.coverImage.upsert({
      where: { projectId },
      create: {
        projectId,
        prompt: prompts.promptEN,
        status: 'pending',
      },
      update: {
        prompt: prompts.promptEN,
      },
    });

    res.json({
      message: 'Prompt de capa gerado',
      prompts,
    });
  } catch (error) {
    console.error('Erro ao gerar prompt de capa:', error);
    res.status(500).json({ error: 'Erro ao gerar prompt de capa' });
  }
});

/**
 * POST /api/generation/cover-image/:projectId
 * Gera imagem de capa usando DALL-E 3
 */
router.post('/cover-image/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { quality, size, customPrompt } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: { coverImage: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Verificar se existe um prompt
    let prompt = customPrompt;
    if (!prompt) {
      if (!project.coverImage || !project.coverImage.prompt) {
        return res.status(400).json({
          error: 'Nenhum prompt de capa encontrado. Gere um prompt primeiro usando /cover-prompt',
        });
      }
      prompt = project.coverImage.prompt;
    }

    // Atualizar status para generating
    await prisma.coverImage.upsert({
      where: { projectId },
      create: {
        projectId,
        prompt,
        status: 'generating',
      },
      update: {
        status: 'generating',
        prompt,
      },
    });

    // Gerar imagem
    const imageService = new ImageGeneratorService();
    const result = await imageService.generateCover(prompt, {
      projectId,
      quality: quality || process.env.DEFAULT_COVER_QUALITY || 'hd',
      size: size || process.env.DEFAULT_COVER_SIZE || '1024x1792',
    });

    // Atualizar banco de dados
    await prisma.coverImage.update({
      where: { projectId },
      data: {
        imageUrl: result.imageUrl,
        imagePath: result.imagePath,
        status: 'completed',
        prompt: result.revisedPrompt || prompt,
      },
    });

    res.json({
      message: 'Imagem de capa gerada com sucesso',
      cover: {
        imageUrl: result.imageUrl,
        imagePath: result.imagePath,
        prompt: result.revisedPrompt,
        quality: result.quality,
        size: result.size,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar imagem de capa:', error);

    // Atualizar status para failed
    try {
      await prisma.coverImage.update({
        where: { projectId: req.params.projectId },
        data: { status: 'failed' },
      });
    } catch (dbError) {
      console.error('Erro ao atualizar status:', dbError);
    }

    res.status(500).json({
      error: 'Erro ao gerar imagem de capa',
      details: error.message,
    });
  }
});

/**
 * GET /api/generation/cover-image/:projectId
 * Obter informações da capa gerada
 */
router.get('/cover-image/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: { coverImage: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (!project.coverImage) {
      return res.status(404).json({ error: 'Nenhuma capa encontrada para este projeto' });
    }

    res.json({
      cover: {
        id: project.coverImage.id,
        prompt: project.coverImage.prompt,
        imageUrl: project.coverImage.imageUrl,
        imagePath: project.coverImage.imagePath,
        status: project.coverImage.status,
        createdAt: project.coverImage.createdAt,
        updatedAt: project.coverImage.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erro ao obter informações da capa:', error);
    res.status(500).json({ error: 'Erro ao obter informações da capa' });
  }
});

/**
 * DELETE /api/generation/cover-image/:projectId
 * Remove a imagem de capa para permitir regeneração
 */
router.delete('/cover-image/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: { coverImage: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (!project.coverImage) {
      return res.status(404).json({ error: 'Nenhuma capa encontrada para este projeto' });
    }

    // Remover arquivo físico
    const imageService = new ImageGeneratorService();
    await imageService.deleteCover(projectId);

    // Resetar no banco de dados (mantém o prompt)
    await prisma.coverImage.update({
      where: { projectId },
      data: {
        imageUrl: null,
        imagePath: null,
        status: 'pending',
      },
    });

    res.json({
      message: 'Imagem de capa removida com sucesso. Você pode gerar uma nova imagem.',
    });
  } catch (error) {
    console.error('Erro ao remover imagem de capa:', error);
    res.status(500).json({ error: 'Erro ao remover imagem de capa' });
  }
});

/**
 * GET /api/generation/status/:projectId
 * Verificar status da geração
 */
router.get('/status/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
      include: {
        chapters: {
          select: {
            id: true,
            order: true,
            titulo: true,
            status: true,
            wordCount: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const completedChapters = project.chapters.filter(c => c.status === 'completed').length;
    const totalChapters = project.chapters.length;
    const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    res.json({
      status: project.status,
      progress: Math.round(progress),
      completedChapters,
      totalChapters,
      chapters: project.chapters,
      totalWords: project.totalWords,
      targetWords: project.targetWords,
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

// Função auxiliar para gerar manuscrito assincronamente
async function generateManuscriptAsync(project) {
  const writer = new BookWriterAgent();
  
  for (let i = 0; i < project.chapters.length; i++) {
    const chapter = project.chapters[i];
    
    try {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { status: 'generating' },
      });

      // Buscar capítulos anteriores para contexto
      const previousChapters = project.chapters
        .slice(Math.max(0, i - 2), i)
        .filter(c => c.conteudo)
        .map(c => c.conteudo);

      const wordsPerChapter = Math.floor(project.targetWords / project.chapters.length);

      const content = await writer.generateChapter({
        projectId: project.id,
        chapterIndex: i,
        chapterTitle: chapter.titulo,
        chapterDescription: chapter.descricao,
        targetWords: wordsPerChapter,
        context: {
          bookTitle: project.titulo,
          bookSummary: project.sinopse,
          tone: project.tomDeVoz,
          previousChapters,
        },
      });

      const wordCount = content.split(/\s+/).length;

      await prisma.chapter.update({
        where: { id: chapter.id },
        data: {
          conteudo: content,
          wordCount,
          status: 'completed',
        },
      });

      // Atualizar total de palavras do projeto
      await prisma.project.update({
        where: { id: project.id },
        data: {
          totalWords: {
            increment: wordCount,
          },
        },
      });
    } catch (error) {
      console.error(`Erro ao gerar capítulo ${i + 1}:`, error);
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { status: 'error' },
      });
    }
  }

  // Atualizar status final
  await prisma.project.update({
    where: { id: project.id },
    data: { status: 'concluido' },
  });
}

// Função auxiliar para revisar manuscrito assincronamente
async function reviseManuscriptAsync(project) {
  const editor = new EditorAgent();

  for (const chapter of project.chapters) {
    if (!chapter.conteudo) continue;

    try {
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { status: 'reviewing' },
      });

      const revisedContent = await editor.revise({
        text: chapter.conteudo,
        language: project.idioma,
      });

      await prisma.chapter.update({
        where: { id: chapter.id },
        data: {
          conteudo: revisedContent,
          status: 'revised',
        },
      });
    } catch (error) {
      console.error(`Erro ao revisar capítulo ${chapter.order}:`, error);
    }
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { status: 'revisado' },
  });
}

export default router;
