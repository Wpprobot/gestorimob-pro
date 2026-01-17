import express from 'express';
import prisma from '../config/database.js';
import { authMiddleware } from '../config/jwt.js';

const router = express.Router();

// Todas as rotas de projetos requerem autenticação
router.use(authMiddleware);

/**
 * POST /api/projects
 * Criar novo projeto de livro
 */
router.post('/', async (req, res) => {
  try {
    const { tema, publicoAlvo, idioma, tamanho, tomDeVoz, tipo } = req.body;

    // Validações
    if (!tema || !publicoAlvo || !tamanho || !tomDeVoz || !tipo) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Calcular palavras alvo baseado no tamanho
    const wordTargets = {
      curto: 8000,
      medio: 15000,
      longo: 25000,
    };

    const project = await prisma.project.create({
      data: {
        userId: req.userId,
        tema,
        publicoAlvo,
        idioma: idioma || 'pt-BR',
        tamanho,
        tomDeVoz,
        tipo,
        targetWords: wordTargets[tamanho] || 15000,
        status: 'briefing',
      },
    });

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      project,
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
});

/**
 * GET /api/projects
 * Listar projetos do usuário
 */
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      include: {
        chapters: {
          select: {
            id: true,
            order: true,
            titulo: true,
            status: true,
          },
          orderBy: { order: 'asc' },
        },
        coverImage: {
          select: {
            id: true,
            imageUrl: true,
            status: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            files: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ projects });
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({ error: 'Erro ao listar projetos' });
  }
});

/**
 * GET /api/projects/:id
 * Obter detalhes de um projeto
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
        files: true,
        coverImage: true,
        languages: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
});

/**
 * PUT /api/projects/:id
 * Atualizar projeto
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar se projeto pertence ao usuário
    const existing = await prisma.project.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: 'Projeto atualizado com sucesso',
      project,
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});

/**
 * DELETE /api/projects/:id
 * Deletar projeto
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se projeto pertence ao usuário
    const existing = await prisma.project.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar projeto' });
  }
});

export default router;
