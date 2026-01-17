/**
 * EXPANDED KNOWLEDGE BASE
 * Literatura de futebol, metodologias de treinadores de elite e princípios táticos avançados
 * Baseado em pesquisa de fontes reais: Inverting the Pyramid, Periodização Tática, comunidade FM
 */

export const ExpandedKnowledge = {
  /**
   * METODOLOGIAS DE TREINADORES DE ELITE
   */
  coachingMethodologies: {
    mourinho: {
      name: 'José Mourinho',
      methodology: 'Periodização Tática',
      creator: 'Vitor Frade',
      description: 'Integra todos aspectos do treinamento (técnico, físico, psicológico) sob um modelo de jogo tático único',
      corePrinciples: [
        'Tudo é tático - não existe treino físico separado',
        'Treino específico sempre reflete o modelo de jogo desejado',
        'Morfociclo semanal estruturado prepara para próximo jogo',
        'Intensidade varia ao longo da semana (pico mid-week)',
        'Jogos reduzidos simulamintensidade e pressão real'
      ],characteristics: [
        'Solidez defensiva como prioridade',
        'Transições rápidas defesa-ataque',
        'Organização coletiva rigorosa',
        'Adaptação tática específica por adversário',
        'Jogo mental e liderança',
        'Bloco baixo compacto quando necessário'
      ],
      fourMoments: {
        enabled: true,
        description: 'Break down do jogo em 4 momentos táticos específicos',
        moments: [
          'Organização Ofensiva - como atacar posicionalmente',
          'Transição Defesa→Ataque - contra-pressão e velocidade',
          'Organização Defensiva - bloco compacto e marcação',
          'Transição Ataque→Defesa - pressão imediata após perda'
        ]
      },
      trainingPrinciples: [
        'Segunda: Recuperação (baixa intensidade)',
        'Terça: Tensão (intensidade alta - foco tático)',
        'Quarta: Duração (volume médio - resistência tática)',
        'Quinta: Velocidade (alta intensidade curta)',
        'Sexta: Ativação (preparação final jogo)',
        'Sábado/Domingo: Jogo'
      ],
      applicableToFM: true,
      fmRecommendations: [
        'Use instruções individuais detalhadas',
        'Prepare tática específica para cada adversário',
        'Foco em transições rápidas',
        'Disciplina tática alta',
        'Treino: Tático + Trabalho de Equipe'
      ]
    },

    guardiola: {
      name: 'Pep Guardiola',
      methodology: 'Microciclo Estructurado / Jogo Posicional',
      influences: 'Johan Cruyff, Juego de Posición',
      description: 'Posse de bola como arma ofensiva e defensiva, com pressão imediata após perda',
      corePrinciples: [
        'Princípios de jogo antes de sistema/formação',
        'Posse como ferramenta para controlar o jogo',
        'Pressão alta imediata após perda de bola',
        'Rondos desenvolvem tomada de decisão',
        'Superioridade posicional constante'
      ],
      characteristics: [
        'Posse dominante (65%+ típico)',
        'Pressão alta coordenada',
        'Rotações posicionais constantes',
        'Laterais inversos (fullbacks internos)',
        'Meio-campistas com liberdade criativa',
        'Finalizações de alta qualidade vs quantidade'
      ],
      juegoDePosicion: {
        description: 'Jogo posicional - criar superioridades através de posicionamento',
        principles: [
          'Ocupar todos os espaços do campo',
          'Criar triângulos e losangos',
          'Atrair pressão para criar espaços',
          'Circulação de bola rápida',
          'Movimentação sem bola coordenada'
        ]
      },
      trainingMethods: [
        'Rondos (posse em espaço reduzido)',
        'Jogos posicionais (7v7, 8v8)',
        'Treino de padrões de jogo',
        'Exercícios de tomada de decisão sob pressão',
        'Simulações de situações de jogo'
      ],
      applicableToFM: true,
      fmRecommendations: [
        'Posse de bola como instrução principal',
        'Passar mais curto + Trabalhar bola para área',
        'Linha defensiva alta + Linha de impedimento',
        'Contra-pressionar ativo',
        'Laterais com papel de suporte/defesa',
        'Meio-campistas criativos com liberdade',
        'Treino: Posse + Tático'
      ]
    },

    klopp: {
      name: 'Jürgen Klopp',
      methodology: 'Gegenpressing',
      description: 'Pressão imediata e intensa para recuperar bola após perda, transformando defesa em ataque',
      corePrinciples: [
        'Contra-pressão como melhor forma de playmaking',
        'Recuperação de bola em zona perigosa',
        'Intensidade física extrema',
        'Mentalidade coletiva de pressing',
        'Jogo vertical e direto após recuperação'
      ],
      characteristics: [
        'Gegenpressing - pressão nos 6 segundos após perda',
        'Transições ataque-defesa extremamente rápidas',
        'Laterais extremamente ofensivos',
        'Pressing coordenado em gatilhos específicos',
        'Corridas em profundidade constantes',
        'Mentalidade metal warrior'
      ],
      pressingTriggers: [
        'Passe para trás do adversário',
        'Primeiro toque ruim do oponente',
        'Bola na lateral do campo',
        'Goleiro recebe bola pressionada'
      ],
      applicableToFM: true,
      fmRecommendations: [
        'Contra-pressionar obrigatório',
        'Urgência Muito Maior',
        'Distribuir rápido aos atacantes',
        'Laterais/Alas em ataque',
        'Meio-campistas box-to-box',
        'Linhas altas e compactas',
        'Treino: Resistência + Tático'
      ]
    },

    bielsa: {
      name: 'Marcelo Bielsa',
      methodology: 'El Loco - Intensidade Total',
      description: 'Pressing agressivo total, intensidade física extrema, e preparação meticulosa',
      corePrinciples: [
        'Pressing alto e agressivo sempre',
        'Homem-a-homem em todo campo',
        'Intensidade física absurda',
        'Preparação obsessiva do adversário',
        'Velocidade de transições'
      ],
      characteristics: [
        'Marcação homem-a-homem',
        'Pressing por 90 minutos',
        'Condicionamento físico extremo',
        'Análise detalhista de adversários',
        'Lealdade total aos princípios',
        '3-3-1-3 ou 4-1-4-1 típico'
      ],
      applicableToFM: true,
      fmRecommendations: [
        'Marcar mais apertado',
        'Pressão extremamente mais alta',
        'Urgência muito maior',
        'Requires jogadores com resistência 15+',
        'Rotação frequente necessária',
        'Treino: Resistência máxima'
      ]
    },

    ancelotti: {
      name: 'Carlo Ancelotti',
      methodology: 'Flexibilidade Tática e Gestão',
      description: 'Adaptação tática baseada em jogadores disponíveis, gestão de egos, flexibilidade',
      corePrinciples: [
        'Adaptação ao invés de imposição',
        'Maximizar forças dos melhores jogadores',
        'Flexibilidade tática constante',
        'Gestão de relacionamentos',
        'Equilíbrio entre fases'
      ],
      characteristics: [
        'Múltiplas formações conforme jogo',
        'Colocar estrelas em posições ideais',
        'Pragmatismo tático',
        'Estabilidade emocional do grupo',
        'Defensivamente sólido',
        '4-3-3, 4-4-2, 4-2-3-1 intercambiáveis'
      ],
      applicableToFM: true,
      fmRecommendations: [
        'Prepare múltiplas táticas',
        'Adapte formação aos melhores jogadores',
        'Mantenha grupo feliz',
        'Instruções individuais personalizadas',
        'Mudanças táticas durante jogo'
      ]
    }
  },

  /**
   * OS 4 MOMENTOS DO JOGO
   */
  fourMomentsOfPlay: {
    description: 'Framework fundamental da Periodização Tática - todo jogo dividido em 4 momentos',
    
    moment1_offensiveOrganization: {
      name: 'Organização Ofensiva',
      description: 'Como o time ataca quando possui a bola e adversário está organizado',
      keyAspects: [
        'Circulação de bola e criação de espaços',
        'Movimentação sem bola coordenada',
        'Ocupação de zonas estratégicas',
        'Paciência na construção',
        'Finalizações de qualidade'
      ],
      fmInstructions: [
        'Manter posse / Trabalhar bola para área',
        'Passar mais curto',
        'Movimentação sem bola',
        'Jogar mais largo ou mais estreito conforme tática'
      ]
    },

    moment2_offensiveTransition: {
      name: 'Transição Defensiva → Ofensiva',
      description: 'Contra-ataque - quando recupera bola e adversário está desorganizado',
      keyAspects: [
        'Velocidade de execução',
        'Aproveitamento de espaços',
        'Decisão rápida: vertical ou manter posse?',
        'Corridas em profundidade',
        'Exploração de superioridade numérica momentânea'
      ],
      fmInstructions: [
        'Contra-ataque',
        'Distribuir rápido aos atacantes',
        'Passar mais direto',
        'Ritmo mais alto'
      ]
},

    moment3_defensiveOrganization: {
      name: 'Organização Defensiva',
      description: 'Como o time defende quando adversário tem posse e está organizado',
      keyAspects: [
        'Compactação de linhas',
        'Fechar espaços entre linhas',
        'Marcação coordenada',
        'Bloco baixo ou meio',
        'Disciplina posicional'
      ],
      fmInstructions: [
        'Manter forma',
        'Linhas mais próximas',
        'Marcar mais apertado (opcional)',
        'Bloco médio ou baixo'
      ]
    },

    moment4_defensiveTransition: {
      name: 'Transição Ofensiva → Defensiva',
      description: 'Contra-pressão - recuperar bola imediatamente após perda',
      keyAspects: [
        'Gegenpressing nos primeiros 6 segundos',
        'Pressão imediata ao portador',
        'Fechar linhas de passe',
        'Prevenir contra-ataques',
        'Reorganização se pressão falhar'
      ],
      fmInstructions: [
        'Contra-pressionar',
        'Urgência maior',
        'Pressão mais alta',
        'Fechar mais'
      ]
    }
  },

  /**
   * SUPERIORIDADES NO FUTEBOL (Ray Power)
   */
  superiorities: {
    description: 'Framework para análise de vantagens táticas - cri ar superioridades para dominar',
    
    numerical: {
      name: 'Superioridade Numérica',
      description: 'Ter mais jogadores que o adversário em uma zona do campo',
      examples: [
        'Overload no meio-campo (3v2)',
        'Laterais subindo criando 2v1',
        'Volante descendo entre zagueiros (3 defensores vs 2 atacantes)',
        'Attacking midfielder + Striker vs 2 zagueiros'
      ],
      howToCreate: [
        'Movimentação de jogadores para zonas específicas',
        'Laterais avançados',
        'Meio-campistas infiltrando',
        'Forwards caindo nas laterais'
      ]
    },

    positional: {
      name: 'Superioridade Posicional',
      description: 'Posicionamento superior mesmo com números iguais',
      examples: [
        'Triângulos de passes',
        'Escalonamento (jogadores em linhas diferentes)',
        'Amplitude e profundidade',
        'Terceiro homem correndo'
      ],
      howToCreate: [
        'Instruções de posicionamento específicas',
        'Movimentação sem bola',
        'Rotações',
        'Ocupação de meio-espaços'
      ]
    },

    qualitative: {
      name: 'Superioridade Qualitativa',
      description: 'Vantagem de habilidade individual',
      examples: [
        'Seu melhor driblador 1v1 contra lateral ruim',
        'Atacante rápido vs zagueiro lento',
        'Meia criativo vs volante limitado',
        'Goleiro excelente com pés vs pressing alto'
      ],
      howToCreate: [
        'Identificar mismatches favoráveis',
        'Isolar melhores jogadores em 1v1',
        'Explorar fraquezas individuais adversárias',
        'Instruções individuais para estrelas'
      ]
    },

    socioaffective: {
      name: 'Superioridade Socioemocional',
      description: 'Vantagem moral, mental e emocional',
      examples: [
        'Jogar em casa com torcida apoiando',
        'Time confiante vs time em crise',
        'Liderança forte no vestiário',
        'Mentalidade vencedora'
      ],
      fmApplication: [
        'Gestão de moral e dinâmica de grupo',
        'Conversas motivacionais',
        'Escolha de capitão certo',
        'Gerenciar expectativas'
      ]
    }
  },

  /**
   * PRINCÍPIOS TÁTICOS UNIVERSAIS
   */
  universalPrinciples: {
    atacando: [
      'Amplitude - usar largura total do campo',
      'Profundidade - ameaça constante atrás da defesa',
      'Mobilidade - movimento sem bola',
      'Criatividade - imprevisibilidade',
      'Paciência - esperar momento certo',
      'Penetração - verticalidade quando possível',
      'Suporte - opções de passe sempre',
      'Temporização - ritmo variável'
    ],
    
    defendendo: [
      'Compactação - fechar espaços',
      'Equilíbrio - cobertura mútua',
      'Concentração - foco defensivo',
      'Controle/Contenção - não se comprometer',
      'Delay - atrasar ataque adversário',
      'Profundidade defensiva - escalonamento',
      'Disciplina - manter forma',
      'Pressão - quando aplicar'
    ],

    transicoes: [
      'Velocidade - executar rápido',
      'Apoio imediato - opções de passe',
      'Reconhecimento - ler situação',
      'Exploração de espaço - usar desorganização',
      'Reorganização rápida - se perder/recuperar bola'
    ]
  },

  /**
   * INSIGHTS DA COMUNIDADE FM
   */
  fmCommunityInsights: {
    metaTactics: [
      {
        formation: '4-3-2-1',
        style: 'Meta Tactic 2024',
        description: 'Formação meta FL24 - domínio de meio-campo com AMs livres',
        strengths: ['Controle total do meio', 'Criação abundante', 'Flexibilidade'],
        weaknesses: ['Pode ser isolado o ST', 'Requer AMs de elite'],
        popularity: 'Muito Alta',
        avgGoals: '5.5+ por jogo (comunidade)'
      },
      {
        formation: '4-2-2-2',
        style: 'Narrow Legendary',
        description: 'Estreita com dupla de atacantes e dupla de AMs',
        strengths: ['Overload central', 'Muitos gols', 'Sólido defensivamente'],
        weaknesses: ['Falta de largura', 'Vulnerável nas laterais'],
        popularity: 'Alta',
        avgGoals: '4+ por jogo'
      },
      {
        formation: '4-3-3',
        style: 'Guardiola Gegenpress',
        description: 'Posse + pressão alta à la Manchester City',
        strengths: ['Posse alta', 'Pressing efetivo', 'Controle de jogo'],
        weaknesses: ['Requer plantel técnico', 'Pode sofrer contra-ataques'],
        popularity: 'Média-Alta'
      }
    ],

    commonMistakes: [
      'Mudar tática drasticamente após 1-2 resultados ruins',
      'Não dar tempo para jogadores aprenderem sistema',
      'Instruções  conflitantes (ex: posse + distribuir rápido)',
      'Ignorar atributos mentais (Decisões, Trabalho em Equipe)',
      'Não adaptar tática a qualidade do plantel',
      'Negligenciar treinamento tático',
      'Não usar instruções individuais'
    ],

    successPrinciples: [
      'Consistência - manter tática por temporada inteira (mínimo)',
      'Familiaridade - dar tempo para jogadores dominarem',
      'Adequação - escolher sistema apropriado ao plantel',
      'Flexibilidade tática - ter plano B',
      'Instruções individuais - personalizar para estrelas',
      'Treinamento alinhado - treinar o que joga',
      'Paciência - nem sempre resultados vêm imediatamente'
    ]
  }
};

export default ExpandedKnowledge;
