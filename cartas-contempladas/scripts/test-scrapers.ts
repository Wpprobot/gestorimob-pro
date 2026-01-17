import { getActiveScrapers } from '../lib/scrapers';
import * as fs from 'fs';
import * as path from 'path';

async function testAllScrapers() {
  const scrapers = getActiveScrapers();
  console.log(`\n🔍 Testando ${scrapers.length} scrapers...\n`);
  console.log('='.repeat(70));

  const results: {
    nome: string;
    url: string;
    status: 'sucesso' | 'erro' | 'vazio';
    cartas: number;
    erro?: string;
  }[] = [];

  for (const scraper of scrapers) {
    const nome = scraper.getNome();
    const url = scraper.getUrl();
    
    try {
      console.log(`\n[${nome}] Testando...`);
      const cartas = await scraper.scrape();
      
      if (cartas.length > 0) {
        console.log(`✅ [${nome}] ${cartas.length} cartas encontradas`);
        results.push({ nome, url, status: 'sucesso', cartas: cartas.length });
      } else {
        console.log(`⚠️  [${nome}] 0 cartas (scraper pode estar com problema)`);
        results.push({ nome, url, status: 'vazio', cartas: 0 });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log(`❌ [${nome}] Erro: ${errorMsg}`);
      results.push({ nome, url, status: 'erro', cartas: 0, erro: errorMsg });
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 RESUMO DOS TESTES\n');
  
  const sucesso = results.filter(r => r.status === 'sucesso');
  const vazio = results.filter(r => r.status === 'vazio');
  const erro = results.filter(r => r.status === 'erro');
  
  console.log(`✅ Sucesso (com cartas): ${sucesso.length}`);
  if (sucesso.length > 0) {
    sucesso.forEach(r => {
      console.log(`   - ${r.nome}: ${r.cartas} cartas`);
    });
  }
  
  console.log(`\n⚠️  Vazios (sem cartas): ${vazio.length}`);
  if (vazio.length > 0) {
    vazio.forEach(r => {
      console.log(`   - ${r.nome}: ${r.url}`);
    });
  }
  
  console.log(`\n❌ Com erro: ${erro.length}`);
  if (erro.length > 0) {
    erro.forEach(r => {
      console.log(`   - ${r.nome}: ${r.erro}`);
    });
  }
  
  const totalCartas = results.reduce((sum, r) => sum + r.cartas, 0);
  console.log(`\n📈 Total de cartas coletadas: ${totalCartas}`);
  console.log('='.repeat(70));
  
  // Salva resultados em arquivo JSON
  const resultadoPath = path.join(__dirname, 'test-scrapers-results.json');
  const resultadoData = {
    dataExecucao: new Date().toISOString(),
    totalScrapers: results.length,
    totalCartas,
    sucesso: sucesso.length,
    vazio: vazio.length,
    erro: erro.length,
    detalhes: results
  };
  
  fs.writeFileSync(resultadoPath, JSON.stringify(resultadoData, null, 2), 'utf-8');
  console.log(`\n💾 Resultados salvos em: ${resultadoPath}`);
}

testAllScrapers().catch(error => {
  console.error('Erro ao executar testes:', error);
  process.exit(1);
});
