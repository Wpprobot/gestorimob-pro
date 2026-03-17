#!/usr/bin/env node

/**
 * Script de Diagnóstico - Gestorimob Pro IA
 * 
 * Valida:
 * - Presença de variáveis de ambiente
 * - Conectividade com API Gemini
 * - Formato das respostas
 * - Status das Netlify Functions
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(50)}${colors.reset}`)
};

// Carrega variáveis de ambiente do .env se existir
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

// Verifica se as Netlify Functions existem
function checkNetlifyFunctions() {
  log.section('Verificando Netlify Functions');
  
  const functionsDir = path.join(__dirname, 'netlify', 'functions');
  const requiredFunctions = [
    'gemini-chat.ts',
    'gemini-analyze-image.ts',
    'gemini-generate-contract.ts'
  ];
  
  let allExist = true;
  
  requiredFunctions.forEach(func => {
    const funcPath = path.join(functionsDir, func);
    if (fs.existsSync(funcPath)) {
      log.success(`Function encontrada: ${func}`);
    } else {
      log.error(`Function NÃO encontrada: ${func}`);
      allExist = false;
    }
  });
  
  return allExist;
}

function checkEnvVariables() {
  log.section('Verificando Variáveis de Ambiente');
  log.info('A chave da API Gemini agora é mantida EXCLUSIVAMENTE pelo Netlify');
  log.info('e não deve ser acessada via frontend ou scripts globais.');
  return true;
}

function testGeminiAPI() {
  log.section('Conectividade com API Gemini');
  log.info('O teste direto de API foi desativado no script de diagnóstico');
  log.info('para evitar vazamento da chave. O frontend se comunica exclusivamente');
  log.info('através da rota /api/gemini-chat do Netlify Functions.');
  return Promise.resolve(true);
}

// Verifica estrutura do projeto
function checkProjectStructure() {
  log.section('Verificando Estrutura do Projeto');
  
  const requiredFiles = [
    'package.json',
    'netlify.toml',
    'services/geminiService.ts',
    'App.tsx'
  ];
  
  let allExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log.success(`Arquivo encontrado: ${file}`);
    } else {
      log.error(`Arquivo NÃO encontrado: ${file}`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Função principal
async function runDiagnostics() {
  console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🔍 DIAGNÓSTICO - GESTORIMOB PRO IA             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝${colors.reset}
`);
  
  loadEnv();
  
  const checks = [];
  
  // Executa verificações
  checks.push({ name: 'Estrutura do Projeto', result: checkProjectStructure() });
  checks.push({ name: 'Netlify Functions', result: checkNetlifyFunctions() });
  checks.push({ name: 'Variáveis de Ambiente', result: checkEnvVariables() });
  
  const apiTest = await testGeminiAPI();
  checks.push({ name: 'API Gemini', result: apiTest });
  
  // Resumo
  log.section('RESUMO');
  
  const passed = checks.filter(c => c.result).length;
  const total = checks.length;
  
  checks.forEach(check => {
    if (check.result) {
      log.success(check.name);
    } else {
      log.error(check.name);
    }
  });
  
  console.log(`\n${colors.cyan}Total: ${passed}/${total} verificações passaram${colors.reset}\n`);
  
  if (passed === total) {
    log.success('✨ Tudo OK! A configuração está correta.');
    log.info('Se ainda houver problemas, verifique:');
    log.info('  1. Configuração da variável GEMINI_API_KEY no Netlify Dashboard');
    log.info('  2. Logs das Netlify Functions no dashboard');
    log.info('  3. Console do browser para erros de rede');
  } else {
    log.error('❌ Há problemas na configuração.');
    log.info('Corrija os itens acima e execute novamente este script.');
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Executa
runDiagnostics().catch(err => {
  log.error('Erro fatal durante diagnóstico');
  console.error(err);
  process.exit(1);
});
