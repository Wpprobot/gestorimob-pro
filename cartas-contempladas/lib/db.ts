import Database from 'better-sqlite3';
import path from 'path';
import { CartaContemplada, FiltrosBusca } from './types';

// Caminho do banco de dados
const DB_PATH = path.join(process.cwd(), 'data', 'cartas.db');

let db: Database.Database | null = null;

/**
 * Inicializa o banco de dados SQLite
 */
export function getDatabase(): Database.Database {
  if (!db) {
    // Cria o diretório data se não existir
    const fs = require('fs');
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    
    // Cria a tabela se não existir
    db.exec(`
      CREATE TABLE IF NOT EXISTS cartas (
        id TEXT PRIMARY KEY,
        tipo TEXT NOT NULL,
        valor_carta REAL NOT NULL,
        valor_entrada REAL DEFAULT 0,
        numero_parcelas INTEGER DEFAULT 0,
        valor_parcela REAL DEFAULT 0,
        taxa_administracao REAL,
        administradora TEXT DEFAULT 'Outro',
        vendedor TEXT NOT NULL,
        url_original TEXT,
        descricao TEXT,
        grupo TEXT,
        cota TEXT,
        data_atualizacao TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_tipo ON cartas(tipo);
      CREATE INDEX IF NOT EXISTS idx_valor_carta ON cartas(valor_carta);
      CREATE INDEX IF NOT EXISTS idx_administradora ON cartas(administradora);
      CREATE INDEX IF NOT EXISTS idx_vendedor ON cartas(vendedor);
      
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  
  return db;
}

/**
 * Salva ou atualiza uma carta no banco
 */
export function saveCarta(carta: CartaContemplada): void {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO cartas (
      id, tipo, valor_carta, valor_entrada, numero_parcelas, valor_parcela,
      taxa_administracao, administradora, vendedor, url_original,
      descricao, grupo, cota, data_atualizacao
    ) VALUES (
      @id, @tipo, @valorCarta, @valorEntrada, @numeroParcelas, @valorParcela,
      @taxaAdministracao, @administradora, @vendedor, @urlOriginal,
      @descricao, @grupo, @cota, @dataAtualizacao
    )
  `);
  
  stmt.run({
    id: carta.id,
    tipo: carta.tipo,
    valorCarta: carta.valorCarta,
    valorEntrada: carta.valorEntrada,
    numeroParcelas: carta.numeroParcelas,
    valorParcela: carta.valorParcela,
    taxaAdministracao: carta.taxaAdministracao || null,
    administradora: carta.administradora,
    vendedor: carta.vendedor,
    urlOriginal: carta.urlOriginal,
    descricao: carta.descricao || null,
    grupo: carta.grupo || null,
    cota: carta.cota || null,
    dataAtualizacao: typeof carta.dataAtualizacao === 'string' ? carta.dataAtualizacao : carta.dataAtualizacao.toISOString(),
  });
}

/**
 * Salva múltiplas cartas em batch
 */
export function saveCartas(cartas: CartaContemplada[]): void {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO cartas (
      id, tipo, valor_carta, valor_entrada, numero_parcelas, valor_parcela,
      taxa_administracao, administradora, vendedor, url_original,
      descricao, grupo, cota, data_atualizacao
    ) VALUES (
      @id, @tipo, @valorCarta, @valorEntrada, @numeroParcelas, @valorParcela,
      @taxaAdministracao, @administradora, @vendedor, @urlOriginal,
      @descricao, @grupo, @cota, @dataAtualizacao
    )
  `);
  
  const insertMany = db.transaction((items: CartaContemplada[]) => {
    for (const carta of items) {
      stmt.run({
        id: carta.id,
        tipo: carta.tipo,
        valorCarta: carta.valorCarta,
        valorEntrada: carta.valorEntrada,
        numeroParcelas: carta.numeroParcelas,
        valorParcela: carta.valorParcela,
        taxaAdministracao: carta.taxaAdministracao || null,
        administradora: carta.administradora,
        vendedor: carta.vendedor,
        urlOriginal: carta.urlOriginal,
        descricao: carta.descricao || null,
        grupo: carta.grupo || null,
        cota: carta.cota || null,
        dataAtualizacao: typeof carta.dataAtualizacao === 'string' ? carta.dataAtualizacao : carta.dataAtualizacao.toISOString(),
      });
    }
  });
  
  insertMany(cartas);
}

/**
 * Busca cartas com filtros
 */
export function searchCartas(filtros: FiltrosBusca): { 
  cartas: CartaContemplada[]; 
  total: number;
  porTipo: Record<string, number>;
} {
  const db = getDatabase();
  
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};
  
  // Filtro por tipo
  if (filtros.tipo && filtros.tipo !== 'todos') {
    conditions.push('tipo = @tipo');
    params.tipo = filtros.tipo;
  }
  
  // Filtro por valor da carta (com tolerância)
  const tolerancia = filtros.toleranciaValor || 10000;
  
  // Se apenas valorCartaMin foi passado (usuário quer buscar por um valor específico com tolerância)
  if (filtros.valorCartaMin !== undefined && filtros.valorCartaMax === undefined) {
    conditions.push('valor_carta BETWEEN @valorMin AND @valorMax');
    params.valorMin = filtros.valorCartaMin - tolerancia;
    params.valorMax = filtros.valorCartaMin + tolerancia;
  } else {
    // Se foi passado min e/ou max como range
    if (filtros.valorCartaMin !== undefined) {
      conditions.push('valor_carta >= @valorCartaMin');
      params.valorCartaMin = filtros.valorCartaMin - tolerancia;
    }
    
    if (filtros.valorCartaMax !== undefined) {
      conditions.push('valor_carta <= @valorCartaMax');
      params.valorCartaMax = filtros.valorCartaMax + tolerancia;
    }
  }
  
  // Filtro por valor máximo da entrada
  if (filtros.valorEntradaMax !== undefined) {
    conditions.push('valor_entrada <= @valorEntradaMax');
    params.valorEntradaMax = filtros.valorEntradaMax;
  }
  
  // Filtro por valor máximo da parcela
  if (filtros.valorParcelaMax !== undefined) {
    conditions.push('valor_parcela <= @valorParcelaMax OR valor_parcela = 0');
    params.valorParcelaMax = filtros.valorParcelaMax;
  }
  
  // Filtro por número máximo de parcelas
  if (filtros.parcelasMax !== undefined) {
    conditions.push('numero_parcelas <= @parcelasMax OR numero_parcelas = 0');
    params.parcelasMax = filtros.parcelasMax;
  }
  
  // Filtro por administradora
  if (filtros.administradora) {
    conditions.push('administradora = @administradora');
    params.administradora = filtros.administradora;
  }
  
  // Filtro por vendedor
  if (filtros.vendedor && filtros.vendedor !== 'todos') {
    conditions.push('vendedor = @vendedor');
    params.vendedor = filtros.vendedor;
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Paginação
  const limite = filtros.limite || 20;
  const pagina = filtros.pagina || 1;
  const offset = (pagina - 1) * limite;
  
  params.limite = limite;
  params.offset = offset;
  
  // Query principal
  const query = `
    SELECT * FROM cartas
    ${whereClause}
    ORDER BY valor_carta ASC
    LIMIT @limite OFFSET @offset
  `;
  
  // Log apenas se filtro de vendedor ativo
  if (filtros.vendedor) {
    console.log(`\n🔍 [FILTRO VENDEDOR] "${filtros.vendedor}"`);
    console.log(`📋 [SQL] ${whereClause}`);
  }
  
  const cartas = db.prepare(query).all(params) as unknown[];
  
  // Log de resultados se filtro ativo
  if (filtros.vendedor && cartas.length > 0) {
    console.log(`✅ [RESULTADO] ${cartas.length} cartas encontradas`);
    console.log(`📊 [AMOSTRA] Primeiros vendedores: ${cartas.slice(0, 3).map(c => (c as any).vendedor).join(', ')}`);
  }
  
  // Query para contar total
  const countQuery = `
    SELECT COUNT(*) as total FROM cartas
    ${whereClause}
  `;
  
  const countResult = db.prepare(countQuery).get(
    Object.fromEntries(
      Object.entries(params).filter(([key]) => !['limite', 'offset'].includes(key))
    )
  ) as { total: number };
  
  // Query para contar por tipo nos resultados filtrados
  const tipoQuery = `
    SELECT tipo, COUNT(*) as count FROM cartas
    ${whereClause}
    GROUP BY tipo
  `;
  
  const tipoResults = db.prepare(tipoQuery).all(
    Object.fromEntries(
      Object.entries(params).filter(([key]) => !['limite', 'offset'].includes(key))
    )
  ) as { tipo: string; count: number }[];
  
  const porTipo = Object.fromEntries(tipoResults.map(r => [r.tipo, r.count]));
  
  return {
    cartas: cartas.map(rowToCarta),
    total: countResult.total,
    porTipo,
  };
}

/**
 * Retorna todas as cartas do banco
 */
export function getAllCartas(): CartaContemplada[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM cartas ORDER BY valor_carta ASC').all() as unknown[];
  return rows.map(rowToCarta);
}

/**
 * Retorna uma carta pelo ID
 */
export function getCartaById(id: string): CartaContemplada | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM cartas WHERE id = ?').get(id) as unknown;
  return row ? rowToCarta(row) : null;
}

/**
 * Encontra as cartas mais próximas acima e abaixo do valor solicitado
 * Retorna cartas completas para exibir como cards de sugestão
 */
export function getCartasProximas(
  valorAlvo: number,
  tipo?: string,
  valorEntradaMax?: number,
  limite: number = 3,
  vendedor?: string  // ⭐ NOVO PARÂMETRO
): { cartasAcima: CartaContemplada[]; cartasAbaixo: CartaContemplada[] } {
  const db = getDatabase();
  
  const conditions: string[] = [];
  const paramsAcima: unknown[] = [valorAlvo];
  const paramsAbaixo: unknown[] = [valorAlvo];
  
  // Filtro por tipo
  if (tipo && tipo !== 'todos') {
    conditions.push('tipo = ?');
    paramsAcima.push(tipo);
    paramsAbaixo.push(tipo);
  }
  
  // Filtro por entrada máxima
  if (valorEntradaMax !== undefined) {
    conditions.push('valor_entrada <= ?');
    paramsAcima.push(valorEntradaMax);
    paramsAbaixo.push(valorEntradaMax);
  }
  
  // ⭐ Filtro por vendedor
  if (vendedor && vendedor !== 'todos') {
    conditions.push('vendedor = ?');
    paramsAcima.push(vendedor);
    paramsAbaixo.push(vendedor);
  }
  
  const extraConditions = conditions.length > 0 ? 'AND ' + conditions.join(' AND ') : '';
  
  paramsAcima.push(limite);
  paramsAbaixo.push(limite);
  
  // Busca cartas mais próximas ACIMA do valor
  const queryAcima = `
    SELECT * FROM cartas 
    WHERE valor_carta > ? ${extraConditions}
    ORDER BY valor_carta ASC 
    LIMIT ?
  `;
  const rowsAcima = db.prepare(queryAcima).all(...paramsAcima) as unknown[];
  
  // Busca cartas mais próximas ABAIXO do valor
  const queryAbaixo = `
    SELECT * FROM cartas 
    WHERE valor_carta < ? ${extraConditions}
    ORDER BY valor_carta DESC 
    LIMIT ?
  `;
  const rowsAbaixo = db.prepare(queryAbaixo).all(...paramsAbaixo) as unknown[];
  
  return {
    cartasAcima: rowsAcima.map(rowToCarta),
    cartasAbaixo: rowsAbaixo.map(rowToCarta),
  };
}



/**
 * Limpa cartas antigas (mais de 24 horas)
 */
export function cleanOldCartas(): number {
  const db = getDatabase();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const result = db.prepare('DELETE FROM cartas WHERE data_atualizacao < ?').run(oneDayAgo);
  return result.changes;
}

/**
 * Retorna estatísticas do banco
 */
export function getStats(): {
  total: number;
  porTipo: Record<string, number>;
  porVendedor: Record<string, number>;
} {
  const db = getDatabase();
  
  const total = (db.prepare('SELECT COUNT(*) as count FROM cartas').get() as { count: number }).count;
  
  const tiposRows = db.prepare('SELECT tipo, COUNT(*) as count FROM cartas GROUP BY tipo').all() as { tipo: string; count: number }[];
  const porTipo = Object.fromEntries(tiposRows.map(r => [r.tipo, r.count]));
  
  const vendedoresRows = db.prepare('SELECT vendedor, COUNT(*) as count FROM cartas GROUP BY vendedor').all() as { vendedor: string; count: number }[];
  const porVendedor = Object.fromEntries(vendedoresRows.map(r => [r.vendedor, r.count]));
  
  return { total, porTipo, porVendedor };
}

/**
 * Remove cartas duplicadas do banco
 * Mantém apenas a versão mais recente de cada carta
 */
export function removeDuplicates(): number {
  const db = getDatabase();
  
  // Remove duplicatas mantendo a mais recente (maior rowid)
  const result = db.prepare(`
    DELETE FROM cartas 
    WHERE rowid NOT IN (
      SELECT MAX(rowid)
      FROM cartas
      GROUP BY valor_carta, administradora, vendedor
    )
  `).run();
  
  return result.changes;
}

/**
 * Salva timestamp da última atualização dos dados
 */
export function setLastUpdate(timestamp: Date = new Date()): void {
  const db = getDatabase();
  db.prepare(`
    INSERT OR REPLACE INTO metadata (key, value, updated_at)
    VALUES ('last_update', ?, ?)
  `).run(timestamp.toISOString(), timestamp.toISOString());
}

/**
 * Retorna lista de todos os vendedores únicos no banco
 */
export function getVendedores(): string[] {
  const db = getDatabase();
  
  const result = db.prepare(`
    SELECT DISTINCT vendedor 
    FROM cartas 
    WHERE vendedor IS NOT NULL 
    ORDER BY vendedor ASC
  `).all() as { vendedor: string }[];
  
  return result.map(r => r.vendedor);
}

/**
 * Recupera timestamp da última atualização
 */
export function getLastUpdate(): Date | null {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT value FROM metadata WHERE key = 'last_update'
  `).get() as { value: string } | undefined;
  
  return row ? new Date(row.value) : null;
}

// Helper para converter row do banco para CartaContemplada
function rowToCarta(row: unknown): CartaContemplada {
  const r = row as Record<string, unknown>;
  return {
    id: r.id as string,
    tipo: r.tipo as CartaContemplada['tipo'],
    valorCarta: r.valor_carta as number,
    valorEntrada: r.valor_entrada as number,
    numeroParcelas: r.numero_parcelas as number,
    valorParcela: r.valor_parcela as number,
    taxaAdministracao: r.taxa_administracao as number | undefined,
    administradora: r.administradora as string,
    vendedor: r.vendedor as string,
    urlOriginal: r.url_original as string,
    dataAtualizacao: new Date(r.data_atualizacao as string),
    descricao: r.descricao as string | undefined,
    grupo: r.grupo as string | undefined,
    cota: r.cota as string | undefined,
  };
}
