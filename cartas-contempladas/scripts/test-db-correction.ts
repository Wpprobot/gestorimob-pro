import { scrapeAll } from '../lib/scrapers';
import { saveCartas, getStats } from '../lib/db';

async function testCorrection() {
  console.log('🔧 Testando correção do banco de dados...\n');
  
  try {
    console.log('📊 Executando scraping de todos os sources...');
    const cartas = await scrapeAll();
    console.log(`\n✅ Total coletado: ${cartas.length} cartas\n`);
    
    console.log('💾 Salvando no banco de dados...');
    saveCartas(cartas);
    console.log('✅ Cartas salvas com sucesso!\n');
    
    console.log('📈 Estatísticas do banco:');
    const stats = getStats();
    console.log(`   Total no banco: ${stats.total} cartas`);
    console.log(`\n   Por vendedor:`);
    Object.entries(stats.porVendedor)
      .sort((a, b) => b[1] - a[1])
      .forEach(([vendedor, count]) => {
        console.log(`      - ${vendedor}: ${count} cartas`);
      });
    
    console.log(`\n   Por tipo:`);
    Object.entries(stats.porTipo).forEach(([tipo, count]) => {
      console.log(`      - ${tipo}: ${count} cartas`);
    });
    
    // Verifica se a correção funcionou
    if (stats.total >= cartas.length * 0.95) {
      console.log('\n✅ SUCESSO! Todas as cartas foram salvas corretamente!');
      console.log(`   Esperado: ${cartas.length} | Salvo: ${stats.total}`);
    } else {
      console.log('\n⚠️  ATENÇÃO! Algumas cartas podem não ter sido salvas.');
      console.log(`   Esperado: ${cartas.length} | Salvo: ${stats.total}`);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }
}

testCorrection();
