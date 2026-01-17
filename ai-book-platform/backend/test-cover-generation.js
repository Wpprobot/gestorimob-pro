/**
 * Script de Teste de Geração de Capas
 * 
 * Este script testa o fluxo completo de geração de capas:
 * 1. Registra/faz login
 * 2. Cria um projeto
 * 3. Gera prompt de capa
 * 4. Gera imagem de capa com DALL-E 3
 * 5. Consulta o status da capa
 * 
 * Uso: node test-cover-generation.js
 */

import fetch from 'node-fetch';

// Configurações
const API_URL = 'http://localhost:3001/api';
const TEST_USER = {
  email: 'teste@exemplo.com',
  name: 'Usuário Teste',
  password: 'teste123',
};

let authToken = '';
let projectId = '';

// Função auxiliar para fazer requisições
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken && !options.skipAuth) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Erro HTTP ${response.status}`);
  }

  return data;
}

// 1. Login ou Registro
async function authenticate() {
  console.log('\n📝 Passo 1: Autenticação');
  console.log('─'.repeat(50));

  try {
    // Tentar fazer login
    const loginData = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
      skipAuth: true,
    });

    authToken = loginData.token;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Usuário: ${loginData.user.name}`);
  } catch (error) {
    // Se falhar, registrar novo usuário
    console.log('ℹ️  Usuário não encontrado. Criando novo usuário...');

    const registerData = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(TEST_USER),
      skipAuth: true,
    });

    authToken = registerData.token;
    console.log('✅ Usuário registrado com sucesso');
    console.log(`   Usuário: ${registerData.user.name}`);
  }

  console.log(`   Token: ${authToken.substring(0, 20)}...`);
}

// 2. Criar projeto de teste
async function createProject() {
  console.log('\n📚 Passo 2: Criar Projeto de Teste');
  console.log('─'.repeat(50));

  const projectData = {
    tema: 'Ficção Científica - Exploração Espacial',
    publicoAlvo: 'Adultos jovens interessados em sci-fi',
    idioma: 'pt-BR',
    tamanho: 'medio',
    tomDeVoz: 'Inspirador e aventureiro',
    tipo: 'ficcao',
  };

  const response = await request('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });

  projectId = response.project.id;
  console.log('✅ Projeto criado com sucesso');
  console.log(`   ID: ${projectId}`);
  console.log(`   Tema: ${projectData.tema}`);
  console.log(`   Tipo: ${projectData.tipo}`);
}

// 3. Adicionar informações do livro (simular seleção de ideia)
async function setupBookInfo() {
  console.log('\n📖 Passo 3: Configurar Informações do Livro');
  console.log('─'.repeat(50));

  const bookData = {
    titulo: 'A Última Fronteira',
    subtitulo: 'Uma Jornada Além das Estrelas',
    sinopse:
      'Em 2157, a humanidade envia sua primeira missão tripulada além do sistema solar. A tripulação da nave Odisseia deve enfrentar não apenas os perigos do espaço profundo, mas também os mistérios de uma civilização alienígena esquecida.',
    capitulos: [
      {
        titulo: 'O Chamado das Estrelas',
        descricao: 'A equipe é selecionada e a missão é anunciada ao mundo.',
      },
      {
        titulo: 'Partida',
        descricao: 'A nave Odisseia deixa a Terra rumo ao desconhecido.',
      },
      {
        titulo: 'O Encontro',
        descricao: 'A descoberta que mudará tudo.',
      },
    ],
  };

  await request(`/generation/select-idea/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

  console.log('✅ Informações do livro configuradas');
  console.log(`   Título: ${bookData.titulo}`);
  console.log(`   Subtítulo: ${bookData.subtitulo}`);
  console.log(`   Capítulos: ${bookData.capitulos.length}`);
}

// 4. Gerar prompt de capa
async function generateCoverPrompt() {
  console.log('\n🎨 Passo 4: Gerar Prompt de Capa');
  console.log('─'.repeat(50));

  const response = await request(`/generation/cover-prompt/${projectId}`, {
    method: 'POST',
  });

  console.log('✅ Prompt de capa gerado');
  console.log('\n📝 Prompt em Inglês (DALL-E):');
  console.log('   ' + response.prompts.promptEN);
  console.log('\n📝 Prompt em Português:');
  console.log('   ' + response.prompts.promptPT);
  console.log('\n💡 Notas de Estilo:');
  console.log('   ' + response.prompts.styleNotes);

  return response.prompts;
}

// 5. Gerar imagem de capa
async function generateCoverImage() {
  console.log('\n🖼️  Passo 5: Gerar Imagem de Capa com DALL-E 3');
  console.log('─'.repeat(50));

  try {
    const response = await request(`/generation/cover-image/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({
        quality: 'hd',
        size: '1024x1792',
      }),
    });

    console.log('✅ Imagem de capa gerada com sucesso');
    console.log(`   URL: ${response.cover.imageUrl}`);
    console.log(`   Caminho Local: ${response.cover.imagePath}`);
    console.log(`   Qualidade: ${response.cover.quality}`);
    console.log(`   Tamanho: ${response.cover.size}`);
    console.log('\n💡 Prompt Revisado pelo DALL-E:');
    console.log('   ' + response.cover.prompt);

    return response.cover;
  } catch (error) {
    console.error('❌ Erro ao gerar imagem:', error.message);
    console.log('\n⚠️  Possíveis causas:');
    console.log('   - Chave OpenAI não configurada no .env');
    console.log('   - Créditos insuficientes na conta OpenAI');
    console.log('   - Problemas de conectividade');
    throw error;
  }
}

// 6. Consultar status da capa
async function getCoverStatus() {
  console.log('\n📊 Passo 6: Consultar Status da Capa');
  console.log('─'.repeat(50));

  const response = await request(`/generation/cover-image/${projectId}`, {
    method: 'GET',
  });

  console.log('✅ Status da capa recuperado');
  console.log(`   Status: ${response.cover.status}`);
  console.log(`   Criado em: ${new Date(response.cover.createdAt).toLocaleString('pt-BR')}`);
  console.log(`   Atualizado em: ${new Date(response.cover.updatedAt).toLocaleString('pt-BR')}`);

  return response.cover;
}

// Função principal
async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  TESTE DE GERAÇÃO DE CAPAS COM IA (DALL-E 3)    ║');
  console.log('╚══════════════════════════════════════════════════╝');

  try {
    await authenticate();
    await createProject();
    await setupBookInfo();
    await generateCoverPrompt();
    await generateCoverImage();
    await getCoverStatus();

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║  ✅ TESTE CONCLUÍDO COM SUCESSO!                ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('\n📁 A imagem gerada está em: uploads/covers/' + projectId);
    console.log('🌐 Você pode acessar o projeto ID:', projectId);
  } catch (error) {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║  ❌ TESTE FALHOU                                ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.error('\n❌ Erro:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

// Executar
main();
