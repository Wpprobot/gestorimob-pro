/**
 * Scheduler para atualização automática das cartas
 * Executa todos os dias às 12:00 PM (meio-dia)
 */
import cron from 'node-cron';
import { scrapeAll } from './lib/scrapers';
import { saveCartas, cleanOldCartas } from './lib/db';

// Configuração do horário (12:00 PM todo dia)
const CRON_SCHEDULE = '0 12 * * *'; // Minuto 0, Hora 12, Todo dia, Todo mês, Todo dia da semana

let isRunning = false;

async function executarAtualizacao() {
  if (isRunning) {
    console.log('[Cron] ⚠️ Atualização já em andamento, pulando...');
    return;
  }

  isRunning = true;
  const inicio = new Date();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[Cron] 🕛 Iniciando atualização automática - ${inicio.toLocaleString('pt-BR')}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // Limpa cartas antigas
    const removidas = cleanOldCartas();
    if (removidas > 0) {
      console.log(`[Cron] 🗑️ Removidas ${removidas} cartas antigas`);
    }

    // Executa scraping de todas as fontes
    const cartas = await scrapeAll();

    // Salva no banco
    if (cartas.length > 0) {
      saveCartas(cartas);
      console.log(`[Cron] ✅ ${cartas.length} cartas salvas com sucesso!`);
    } else {
      console.log('[Cron] ⚠️ Nenhuma carta encontrada');
    }

    const duracao = Math.round((Date.now() - inicio.getTime()) / 1000);
    console.log(`\n[Cron] ⏱️ Atualização concluída em ${duracao} segundos`);

  } catch (error) {
    console.error('[Cron] ❌ Erro na atualização:', error);
  } finally {
    isRunning = false;
  }
}

// Inicia o agendamento
export function iniciarScheduler() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[Cron] 📅 Scheduler iniciado!`);
  console.log(`[Cron] ⏰ Próxima atualização: Todo dia às 12:00 PM`);
  console.log(`${'='.repeat(60)}\n`);

  cron.schedule(CRON_SCHEDULE, () => {
    executarAtualizacao();
  }, {
    timezone: 'America/Sao_Paulo' // Horário de Brasília
  });
}

// Exporta função para executar manualmente se necessário
export { executarAtualizacao };

// Auto-inicia se executado diretamente
iniciarScheduler();
