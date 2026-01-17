// Tipos para cartas contempladas de consórcios

export type TipoCarta = 'imovel' | 'veiculo' | 'pesado' | 'moto';

export interface CartaContemplada {
  id: string;
  tipo: TipoCarta;
  valorCarta: number;           // Valor do crédito em R$
  valorEntrada: number;         // Entrada/Ágio em R$
  numeroParcelas: number;       // Parcelas restantes
  valorParcela: number;         // Valor da parcela em R$
  taxaAdministracao?: number;   // % taxa de administração
  administradora: string;       // Ex: Bradesco, Itaú, Porto Seguro
  vendedor: string;             // Nome do site de origem
  urlOriginal: string;          // Link para o anúncio
  dataAtualizacao: string | Date;
  // Campos opcionais
  descricao?: string;
  grupo?: string;
  cota?: string;
}

export interface FiltrosBusca {
  tipo?: TipoCarta | 'todos';
  valorCartaMin?: number;
  valorCartaMax?: number;
  valorEntradaMax?: number;
  valorParcelaMax?: number;      // Valor máximo da parcela
  parcelasMax?: number;
  administradora?: string;
  vendedor?: string;             // ⭐ NOVO - Filtro por empresa vendedora
  toleranciaValor?: number;     // Default: 10000 (±10k)
  pagina?: number;
  limite?: number;
}

export interface ResultadoBusca {
  cartas: CartaContemplada[];
  total: number;
  pagina: number;
  totalPaginas: number;
  temMais: boolean;
}

export interface ScraperConfig {
  nome: string;
  urlBase: string;
  urlImoveis?: string;
  urlVeiculos?: string;
  urlPesados?: string;
  ativo: boolean;
}

// Configuração de todos os scrapers disponíveis
export const SCRAPERS_CONFIG: ScraperConfig[] = [
  {
    nome: 'Cotas Premium',
    urlBase: 'https://cotaspremium.com.br',
    urlImoveis: '/servicos/cartas-contempladas-de-imoveis02/',
    urlVeiculos: '/servicos/cartas-contempladas-de-automoveis/',
    ativo: true,
  },
  {
    nome: 'Bolsa do Consórcio',
    urlBase: 'https://www.bolsadoconsorcio.com.br',
    urlImoveis: '/categoria-cota/cotas-contempladas/imoveis/',
    urlVeiculos: '/categoria-cota/cotas-contempladas/autos/',
    urlPesados: '/categoria-cota/cotas-contempladas/pesados/',
    ativo: true,
  },
  {
    nome: 'Unicontemplados',
    urlBase: 'https://unicontemplados.com.br',
    urlImoveis: '/imobiliario',
    urlVeiculos: '/veiculos',
    ativo: true,
  },
  {
    nome: 'TOCO Consórcios',
    urlBase: 'https://tococonsorcios.com.br',
    urlImoveis: '/contempladas/',
    urlVeiculos: '/contempladas/',
    ativo: true,
  },
  {
    nome: 'Play Contempladas',
    urlBase: 'https://playcontempladas.com.br',
    ativo: true,
  },
  {
    nome: 'MyCotas',
    urlBase: 'https://mycotas.mycon.com.br',
    ativo: false, // Requer JS
  },
  {
    nome: 'Quero Contemplada',
    urlBase: 'https://querocontemplada.com.br',
    ativo: true,
  },
  {
    nome: 'DF Contemplados',
    urlBase: 'https://dfcontemplados.com.br',
    ativo: true,
  },
  {
    nome: 'Contemplados SP',
    urlBase: 'https://www.contempladosp.com.br',
    ativo: true,
  },
  {
    nome: 'Cotas Contempladas',
    urlBase: 'https://www.cotascontempladas.com.br',
    ativo: true,
  },
];

// Lista de administradoras conhecidas
export const ADMINISTRADORAS = [
  'Bradesco',
  'Itaú',
  'Caixa',
  'Santander',
  'Porto Seguro',
  'Rodobens',
  'Embracon',
  'Ademilar',
  'Volkswagen',
  'Honda',
  'Yamaha',
  'Randon',
  'Bancorbrás',
  'Sicredi',
  'Consórcio Nacional',
  'Mycon',
  'Outro',
] as const;

export type Administradora = typeof ADMINISTRADORAS[number];
