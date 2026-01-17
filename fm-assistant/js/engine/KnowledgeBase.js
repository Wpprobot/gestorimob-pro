/**
 * KNOWLEDGE BASE - FM TACTICAL ASSISTANT
 * Comprehensive football tactics and FM knowledge compiled from research
 */

export const KnowledgeBase = {
  /**
   * Modern Football Formations
   */
  formations: {
    '4-2-3-1': {
      name: '4-2-3-1',
      description: 'Formação versátil e balanceada, considerada uma das mais eficazes no futebol moderno',
      strengths: [
        'Excelente equilíbrio defensivo e ofensivo',
        'Dois volantes oferecem cobertura defensiva',
        'Três meio-campistas ofensivos criam superioridade',
        'Laterais livres para apoiar com cobertura dos volantes'
      ],
      weaknesses: [
        'Pode sofrer no meio-campo contra formações com 3 no meio',
        'Requer laterais com excelente condicionamento físico'
      ],
      keyAttributes: {
        defense: ['Marcação', 'Posicionamento', 'Antecipação'],
        midfield: ['Trabalho em Equipe', 'Passe', 'Decisões'],
        attack: ['Finalização', 'Movimentação Sem Bola', 'Primeiro Toque']
      },
      idealRoles: {
        GK: ['Goalkeeper (Defend)', 'Sweeper Keeper (Defend)'],
        DL: ['Full-back (Support)', 'Wing-back (Support)'],
        DC: ['Central Defender (Defend)', 'Ball Playing Defender (Defend)'],
        DR: ['Full-back (Support)', 'Wing-back (Support)'],
        DM: ['Defensive Midfielder (Defend)', 'Deep Lying Playmaker (Defend)'],
        AML: ['Inside Forward (Attack)', 'Winger (Support)'],
        AMC: ['Advanced Playmaker (Support)', 'Attacking Midfielder (Support)'],
        AMR: ['Inside Forward (Attack)', 'Winger (Support)'],
        ST: ['Complete Forward (Support)', 'Advanced Forward (Attack)']
      }
    },
    '4-3-3': {
      name: '4-3-3',
      description: 'Base do futebol moderno, oferece controle do meio-campo e largura',
      strengths: [
        'Dominação do meio-campo com três jogadores',
        'Largura natural pelos extremos',
        'Flexibilidade tática (posse ou contra-ataque)',
        'Pressão eficaz em bloco alto'
      ],
      weaknesses: [
        'Centroavante pode ficar isolado',
        'Vulnerável a contra-ataques pelos lados'
      ],
      keyAttributes: {
        defense: ['Velocidade', 'Posicionamento', 'Força'],
        midfield: ['Resistência', 'Passe', 'Visão'],
        attack: ['Velocidade', 'Drible', 'Finalização']
      },
      idealRoles: {
        GK: ['Sweeper Keeper (Support)'],
        DL: ['Full-back (Support)', 'Complete Wing-back (Attack)'],
        DC: ['Ball Playing Defender (Defend)', 'Central Defender (Defend)'],
        DR: ['Full-back (Support)', 'Complete Wing-back (Attack)'],
        DM: ['Deep Lying Playmaker (Defend)', 'Anchor (Defend)'],
        MC: ['Box to Box Midfielder (Support)', 'Mezzala (Support)'],
        AML: ['Inside Forward (Attack)', 'Winger (Attack)'],
        AMR: ['Inside Forward (Attack)', 'Winger (Attack)'],
        ST: ['Pressing Forward (Attack)', 'Complete Forward (Support)']
      }
    },
    '3-5-2': {
      name: '3-5-2',
      description: 'Formação sólida defensivamente com largura pelos alas',
      strengths: [
        'Solidez defensiva com três zagueiros',
        'Superioridade numérica no meio-campo',
        'Alas oferecem largura e profundidade',
        'Eficaz contra formações com um atacante'
      ],
      weaknesses: [
        'Vulnerável nas laterais contra formações com extremos',
        'Requer alas com condicionamento físico excepcional',
        'Zagueiros laterais precisam ser rápidos'
      ],
      keyAttributes: {
        defense: ['Antecipação', 'Posicionamento', 'Força'],
        midfield: ['Resistência', 'Trabalho em Equipe', 'Versatilidade'],
        attack: ['Movimentação Sem Bola', 'Finalização', 'Trabalho em Equipe']
      },
      idealRoles: {
        GK: ['Sweeper Keeper (Support)'],
        DC: ['Ball Playing Defender (Defend)', 'Central Defender (Defend)', 'Libero (Support)'],
        WBL: ['Complete Wing-back (Attack)', 'Wing-back (Support)'],
        DM: ['Deep Lying Playmaker (Defend)', 'Defensive Midfielder (Defend)'],
        MC: ['Box to Box Midfielder (Support)', 'Central Midfielder (Support)'],
        WBR: ['Complete Wing-back (Attack)', 'Wing-back (Support)'],
        ST: ['Complete Forward (Support)', 'Advanced Forward (Attack)', 'Target Man (Support)']
      }
    },
    '4-4-2': {
      name: '4-4-2',
      description: 'Formação clássica reinventada, sólida e trabalhadora',
      strengths: [
        'Estrutura clara e fácil comunicação',
        'Solidez defensiva em bloco',
        'Dupla de ataque cria múltiplas opções',
        'Eficaz em transições'
      ],
      weaknesses: [
        'Pode ser superado no meio-campo',
        'Menos opções criativas no terço final'
      ],
      keyAttributes: {
        defense: ['Marcação', 'Posicionamento', 'Força'],
        midfield: ['Trabalho em Equipe', 'Resistência', 'Disciplina Tática'],
        attack: ['Finalização', 'Movimentação Sem Bola', 'Trabalho em Equipe']
      },
      idealRoles: {
        GK: ['Goalkeeper (Defend)'],
        DL: ['Full-back (Support)', 'Full-back (Defend)'],
        DC: ['Central Defender (Defend)', 'Ball Playing Defender (Defend)'],
        DR: ['Full-back (Support)', 'Full-back (Defend)'],
        ML: ['Winger (Support)', 'Wide Midfielder (Support)'],
        MC: ['Central Midfielder (Support)', 'Box to Box Midfielder (Support)'],
        MR: ['Winger (Support)', 'Wide Midfielder (Support)'],
        ST: ['Complete Forward (Support)', 'Advanced Forward (Attack)', 'Target Man (Support)']
      }
    }
  },

  /**
   * Tactical Styles
   */
  tacticalStyles: {
    gegenpress: {
      name: 'Gegenpress',
      description: 'Pressão intensa imediatamente após perda de bola',
      mentality: 'Positive/Attacking',
      teamInstructions: [
        'Muito mais urgência',
        'Contra-pressionar',
        'Linha defensiva mais alta',
        'Linha de impedimento',
        'Passar mais curto',
        'Jogar para fora da defesa',
        'Ritmo mais alto'
      ],
      requiredAttributes: [
        'Trabalho em Equipe (15+)',
        'Resistência (15+)',
        'Decisões (14+)',
        'Antecipação (14+)',
        'Velocidade/Aceleração (13+)'
      ],
      bestFormations: ['4-3-3', '4-2-3-1'],
      strengths: ['Recuperação rápida da bola', 'Opções de gol com defesa desorganizada'],
      weaknesses: ['Fisicamente exigente', 'Vulnerável a contra-ataques']
    },
    tikitaka: {
      name: 'Tiki-Taka',
      description: 'Posse de bola com passes curtos e movimento constante',
      mentality: 'Positive/Control',
      teamInstructions: [
        'Passar mais curto',
        'Jogar para fora da defesa',
        'Manter posse',
        'Trabalhar bola para área',
        'Ritmo menor',
        'Linha defensiva alta'
      ],
      requiredAttributes: [
        'Passe (15+)',
        'Primeiro Toque (15+)',
        'Visão (14+)',
        'Trabalho em Equipe (15+)',
        'Técnica (14+)',
        'Decisões (14+)'
      ],
      bestFormations: ['4-3-3', '3-4-3'],
      strengths: ['Controle do jogo', 'Desgaste do adversário'],
      weaknesses: ['Pode ser previsível', 'Vulnerável a blocos baixos organizados']
    },
    counterAttack: {
      name: 'Contra-Ataque',
      description: 'Defesa sólida com transições rápidas para o ataque',
      mentality: 'Defensive/Counter',
      teamInstructions: [
        'Contra-ataque',
        'Passar mais direto',
        'Linha defensiva mais baixa',
        'Ritmo mais alto',
        'Distribuir rápido para os atacantes',
        'Blefes'
      ],
      requiredAttributes: [
        'Velocidade (16+)',
        'Aceleração (16+)',
        'Antecipação (14+)',
        'Movimentação Sem Bola (14+)',
        'Marcação (13+)',
        'Posicionamento (13+)'
      ],
      bestFormations: ['4-4-2', '5-3-2', '4-2-3-1'],
      strengths: ['Eficaz contra times que pressionam', 'Menos desgaste físico'],
      weaknesses: ['Menor posse de bola', 'Requer disciplina tática']
    },
    possession: {
      name: 'Posse de Bola',
      description: 'Domínio através da manutenção da posse',
      mentality: 'Control/Positive',
      teamInstructions: [
        'Manter posse',
        'Passar mais curto',
        'Jogar para fora da defesa',
        'Trabalhar bola para área',
        'Ritmo menor'
      ],
      requiredAttributes: [
        'Passe (14+)',
        'Primeiro Toque (14+)',
        'Técnica (13+)',
        'Compostura (14+)',
        'Trabalho em Equipe (14+)'
      ],
      bestFormations: ['4-3-3', '4-2-3-1'],
      strengths: ['Controle do jogo', 'Reduz chances do adversário'],
      weaknesses: ['Pode ser lento', 'Frustrante contra blocos baixos']
    }
  },

  /**
   * Player Attributes by Position
   */
  attributesByPosition: {
    GK: {
      essential: ['Reflexos', 'Colocação', 'Alcance de Salto', 'Manuseamento'],
      important: ['Comando da Área', 'Comunicação', 'Concentração', 'Um-Contra-Um'],
      useful: ['Chute', 'Passe', 'Primeiro Toque', 'Antecipação']
    },
    DC: {
      essential: ['Marcação', 'Desarme', 'Posicionamento', 'Antecipação'],
      important: ['Jogo Aéreo', 'Força', 'Coragem', 'Concentração', 'Compostura'],
      useful: ['Passe', 'Técnica', 'Velocidade', 'Aceleração']
    },
    FB: {
      essential: ['Marcação', 'Desarme', 'Posicionamento', 'Resistência'],
      important: ['Cruzamento', 'Técnica', 'Velocidade', 'Aceleração', 'Trabalho em Equipe'],
      useful: ['Passe', 'Drible', 'Primeiro Toque', 'Antecipação']
    },
    DM: {
      essential: ['Desarme', 'Posicionamento', 'Antecipação', 'Trabalho em Equipe'],
      important: ['Marcação', 'Compostura', 'Primeiro Toque', 'Passe', 'Decisões'],
      useful: ['Força', 'Resistência', 'Técnica', 'Concentração']
    },
    MC: {
      essential: ['Passe', 'Primeiro Toque', 'Decisões', 'Trabalho em Equipe'],
      important: ['Técnica', 'Resistência', 'Visão', 'Movimentação Sem Bola'],
      useful: ['Desarme', 'Finalização de Longe', 'Antecipação', 'Compostura']
    },
    AM: {
      essential: ['Visão', 'Primeiro Toque', 'Técnica', 'Criatividade'],
      important: ['Passe', 'Drible', 'Movimentação Sem Bola', 'Decisões'],
      useful: ['Finalização de Longe', 'Compostura', 'Agilidade', 'Antecipação']
    },
    W: {
      essential: ['Velocidade', 'Aceleração', 'Drible', 'Técnica'],
      important: ['Cruzamento', 'Primeiro Toque', 'Agilidade', 'Equilíbrio'],
      useful: ['Finalização', 'Movimentação Sem Bola', 'Passe', 'Criatividade']
    },
    ST: {
      essential: ['Finalização', 'Movimentação Sem Bola', 'Compostura', 'Primeiro Toque'],
      important: ['Antecipação', 'Técnica', 'Velocidade', 'Aceleração'],
      useful: ['Força', 'Jogo Aéreo', 'Determinação', 'Trabalho em Equipe']
    }
  },

  /**
   * Counter-tactics
   */
  counterTactics: {
    againstGegenpress: {
      formation: '4-3-3 ou 5-3-2',
      instructions: [
        'Passar mais direto',
        'Distribuir rápido para os atacantes',
        'Explorar os flancos',
        'Instruir jogadores a manter posição'
      ],
      playerRoles: ['Jogadores rápidos nos extremos', 'Volante com bom passe longo'],
      reasoning: 'Evitar a pressão com passes diretos e explorar espaços nas costas'
    },
    againstTikitaka: {
      formation: '4-4-2 ou 5-4-1',
      instructions: [
        'Bloco médio/baixo',
        'Fechar espaços no meio',
        'Contra-ataque',
        'Pressionar menos'
      ],
      playerRoles: ['Meio-campistas com boa marcação', 'Atacantes rápidos'],
      reasoning: 'Compactar o time e explorar transições rápidas'
    },
    againstCrosses: {
      formation: 'Três zagueiros ou zagueiros altos',
      instructions: [
        'Fechar cruzamentos',
        'Aproximar laterais',
        'Goleiro comandar área'
      ],
      playerRoles: ['Zagueiros altos e fortes', 'Laterais que voltam bem'],
      reasoning: 'Superioridade numérica e física na área'
    },
    againstCounterAttack: {
      formation: '4-3-3 com volante único',
      instructions: [
        'Manter posse',
        'Linha defensiva recuada',
        'Não arriscar passes',
        'Laterais não sobem juntos'
      ],
      playerRoles: ['Meio-campistas pacientes', 'Volante com boa cobertura'],
      reasoning: 'Evitar perder a bola em posições perigosas'
    }
  },

  /**
   * Training Focus Recommendations
   */
  trainingFocus: {
    preseason: ['Físico - Resistência', 'Físico - Força', 'Tático - Formação'],
    earlyseason: ['Tático - Instruções de equipe', 'Técnico - Controle/Passe', 'Bolas Paradas'],
    midseason: ['Tático - Instruções individuais', 'Manutenção física', 'Técnico específico por posição'],
    lateseason: ['Recuperação', 'Tático - Ajustes finos', 'Mental - Decisões/Concentração']
  },

  /**
   * Mental Attributes Importance
   */
  mentalAttributes: {
    leadership: {
      positions: ['GK', 'DC', 'MC', 'ST'],
      importance: 'Alto para capitães e jogadores experientes',
      impact: 'Influencia moral e performance do time em momentos críticos'
    },
    determination: {
      positions: ['Todas'],
      importance: 'Essencial',
      impact: 'Afeta consistência e desenvolvimento de jogadores jovens'
    },
    workRate: {
      positions: ['FB', 'WB', 'MC', 'W'],
      importance: 'Muito Alto',
      impact: 'Influencia distância percorrida e intensidade defensiva'
    },
    composure: {
      positions: ['GK', 'ST', 'AM'],
      importance: 'Crítico',
      impact: 'Performance em momentos de pressão e finalizações'
    }
  }
};

export default KnowledgeBase;
