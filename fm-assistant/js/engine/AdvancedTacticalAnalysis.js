/**
 * ADVANCED TACTICAL ANALYSIS ENGINE
 * Análise profunda de táticas usando conhecimento expandido
 */

import { ExpandedKnowledge } from './ExpandedKnowledge.js';
import { TacticalEngine } from './TacticalEngine.js';

export class AdvancedTacticalAnalysis extends TacticalEngine {
  constructor() {
    super();
    this.expandedKB = ExpandedKnowledge;
  }

  /**
   * Análise completa de uma tática customizada
   */
  analyzeCustomTactic(tacticData) {
    const {
      formation,
      mentality = 'balanced',
      instructions = [],
      playerRoles = {},
      name = 'Tática Customizada'
    } = tacticData;

    return {
      basicInfo: {
        name,
        formation,
        mentality
      },
      fourMomentsAnalysis: this.analyzeFourMoments(tacticData),
      superioritiesAnalysis: this.analyzeSuperiorities(tacticData),
      methodologyMatch: this.identifyMethodology(tacticData),
      strengthsWeaknesses: this.analyzeStrengthsWeaknesses(tacticData),
      recommendations: this.generateRecommendations(tacticData),
      rating: this.rateTactic(tacticData)
    };
  }

  /**
   * Analisa os 4 Momentos do Jogo na tática
   */
  analyzeFourMoments(tactic) {
    const { instructions = [], formation, playerRoles = {} } = tactic;
    
    const analysis = {
      moment1_offensiveOrg: {
        name: 'Organização Ofensiva',
        score: 0,
        description: '',
        characteristics: []
      },
      moment2_offensiveTransition: {
        name: 'Transição Def→Ataque',
        score: 0,
        description: '',
        characteristics: []
      },
      moment3_defensiveOrg: {
        name: 'Organização Defensiva',
        score: 0,
        description: '',
        characteristics: []
      },
      moment4_defensiveTransition: {
        name: 'Transição Atq→Defesa',
        score: 0,
        description: '',
        characteristics: []
      }
    };

    // Momento 1: Organização Ofensiva
    if (instructions.includes('manter posse') || instructions.includes('trabalhar bola para área')) {
      analysis.moment1_offensiveOrg.score += 30;
      analysis.moment1_offensiveOrg.characteristics.push('Posse de bola valorizada');
    }
    if (instructions.includes('passar mais curto')) {
      analysis.moment1_offensiveOrg.score += 20;
      analysis.moment1_offensiveOrg.characteristics.push('Circulação organizada');
    }
    if (instructions.includes('explorar flancos') || instructions.includes('cruzar mais')) {
      analysis.moment1_offensiveOrg.score += 15;
      analysis.moment1_offensiveOrg.characteristics.push('Uso de largura');
    }

    // Momento 2: Transição Ofensiva
    if (instructions.includes('contra-ataque') || instructions.includes('distribuir rápido')) {
      analysis.moment2_offensiveTransition.score += 40;
      analysis.moment2_offensiveTransition.characteristics.push('Contra-ataque rápido');
    }
    if (instructions.includes('passar mais direto')) {
      analysis.moment2_offensiveTransition.score += 25;
      analysis.moment2_offensiveTransition.characteristics.push('Jogo vertical');
    }
    if (instructions.includes('ritmo mais alto')) {
      analysis.moment2_offensiveTransition.score += 15;
      analysis.moment2_offensiveTransition.characteristics.push('Velocidade de transição');
    }

    // Momento 3: Organização Defensiva
    if (instructions.includes('manter forma') || instructions.includes('mais disciplinado')) {
      analysis.moment3_defensiveOrg.score += 30;
      analysis.moment3_defensiveOrg.characteristics.push('Disciplina defensiva');
    }
    if (instructions.includes('linha defensiva mais baixa') || instructions.includes('bloco baixo')) {
      analysis.moment3_defensiveOrg.score += 25;
      analysis.moment3_defensiveOrg.characteristics.push('Bloco defensivo compacto');
    }
    if (instructions.includes('marcar mais apertado')) {
      analysis.moment3_defensiveOrg.score += 20;
      analysis.moment3_defensiveOrg.characteristics.push('Marcação cerrada');
    }

    // Momento 4: Transição Defensiva
    if (instructions.includes('contra-pressionar') || instructions.includes('pressionar muito mais')) {
      analysis.moment4_defensiveTransition.score += 40;
      analysis.moment4_defensiveTransition.characteristics.push('Gegenpressing ativo');
    }
    if (instructions.includes('urgência maior')) {
      analysis.moment4_defensiveTransition.score += 25;
      analysis.moment4_defensiveTransition.characteristics.push('Recuperação rápida');
    }
    if (instructions.includes('linha defensiva mais alta')) {
      analysis.moment4_defensiveTransition.score += 15;
      analysis.moment4_defensiveTransition.characteristics.push('Pressão alta');
    }

    // Gerar descrições
    Object.keys(analysis).forEach(key => {
      const moment = analysis[key];
      if (moment.score > 60) {
        moment.description = `Muito forte - tática bem definida neste momento`;
      } else if (moment.score > 30) {
        moment.description = `Adequado - presença clara de princípios`;
      } else {
        moment.description = `Pode melhorar - princípios pouco definidos`;
      }
    });

    return analysis;
  }

  /**
   * Analisa superioridades que a tática busca criar
   */
  analyzeSuperiorities(tactic) {
    const { formation, instructions = [], playerRoles = {} } = tactic;
    
    const superiorities = {
      numerical: [],
      positional: [],
      qualitative: []
    };

    // Detectar superioridade numérica
    if (formation.startsWith('3-') || formation.startsWith('5-')) {
      superiorities.numerical.push('3 zagueiros criam superioridade contra 1-2 atacantes');
    }
    if (instructions.includes('explorar flancos')) {
      superiorities.numerical.push('Overload nas laterais com laterais subindo');
    }

    // Detectar superioridade posicional
    if (instructions.includes('passar mais curto') && instructions.includes('manter posse')) {
      superiorities.positional.push('Triângulos de passe e circulação');
    }
    if (formation.includes('3-')) {
      superiorities.positional.push('Escalonamento de linhas');
    }

    // Detectar busca por superioridade qualitativa
    if (instructions.includes('explorar flancos') || instructions.includes('cruzar mais')) {
      superiorities.qualitative.push('Isolar extremos em 1v1');
    }

    return superiorities;
  }

  /**
   * Identifica qual metodologia de treinador a tática mais se assemelha
   */
  identifyMethodology(tactic) {
    const { instructions = [], formation } = tactic;
    const methodologies = this.expandedKB.coachingMethodologies;
    
    const scores = {};
    
    // Mourinho - Periodização Tática
    let mourinhoScore = 0;
    if (instructions.includes('organização') || instructions.includes('manter forma')) mourinhoScore += 20;
    if (instructions.includes('contra-ataque') || instructions.includes('contra-pressionar')) mourinhoScore += 25;
    if (instructions.includes('bloco baixo') || instructions.includes('linha defensiva mais baixa')) mourinhoScore += 15;
    scores.mourinho = mourinhoScore;

    // Guardiola - Posse e Pressing
    let guardiolaScore = 0;
    if (instructions.includes('manter posse')) guardiolaScore += 30;
    if (instructions.includes('passar mais curto')) guardiolaScore += 25;
    if (instructions.includes('contra-pressionar')) guardiolaScore += 20;
    if (instructions.includes('linha defensiva mais alta')) guardiolaScore += 15;
    scores.guardiola = guardiolaScore;

    // Klopp - Gegenpressing
    let kloppScore = 0;
    if (instructions.includes('contra-pressionar')) kloppScore += 35;
    if (instructions.includes('urgência maior') || instructions.includes('urgência muito maior')) kloppScore += 25;
    if (instructions.includes('distribuir rápido')) kloppScore += 20;
    scores.klopp = kloppScore;

    // Bielsa - Pressing Total
    let bielsaScore = 0;
    if (instructions.includes('pressionar muito mais') || instructions.includes('marcar mais apertado')) bielsaScore += 30;
    if (instructions.includes('urgência muito maior')) bielsaScore += 25;
    if (instructions.includes('linha defensiva mais alta')) bielsaScore += 20;
    scores.bielsa = bielsaScore;

    // Ancelotti - Flexível
    let ancelottiScore = 0;
    if (!instructions.includes('extremos') && instructions.length < 8) ancelottiScore += 20;
    scores.ancelotti = ancelottiScore;

    // Encontrar maior score
    const maxScore = Math.max(...Object.values(scores));
    const bestMatch = Object.keys(scores).find(key => scores[key] === maxScore);

    if (maxScore < 30) {
      return {
        match: 'Tática Única',
        similarity: maxScore,
        description: 'Esta tática não se alinha claramente com nenhuma metodologia específica',
        coach: null
      };
    }

    const coachData = methodologies[bestMatch];
    return {
      match: coachData.name,
      similarity: maxScore,
      description: `Tática similar à metodologia de ${coachData.name} - ${coachData.methodology}`,
      coach: coachData,
      principles: coachData.corePrinciples.slice(0, 3)
    };
  }

  /**
   * Analisa pontos fortes e fracos da tática
   */
  analyzeStrengthsWeaknesses(tactic) {
    const { formation, instructions = [] } = tactic;
    
    const strengths = [];
    const weaknesses = [];

    // Avaliar instruções
    const hasPosse = instructions.includes('manter posse');
    const hasPressingAlto = instructions.includes('linha defensiva mais alta') || instructions.includes('pressionar');
    const hasContraPressao = instructions.includes('contra-pressionar');
    const hasContraAtaque = instructions.includes('contra-ataque');

    // Pontos Fortes
    if (hasPosse && hasContraPressao) {
      strengths.push('Excelente controle do jogo com recuperação rápida');
    }
    if (hasContraAtaque && instructions.includes('distribuir rápido')) {
      strengths.push('Transições ofensivas muito rápidas e perigosas');
    }
    if (instructions.includes('manter forma')) {
      strengths.push('Organização defensiva sólida');
    }
    if (hasPressingAlto && hasContraPressao) {
      strengths.push('Pressing coordenado e eficaz');
    }

    // Pontos Fracos
    if (hasPressingAlto && !hasContraPressao) {
      weaknesses.push('Pressing alto sem contra-pressão pode deixar espaços');
    }
    if (hasPosse && hasContraAtaque) {
      weaknesses.push('Instruções contraditórias: posse vs contra-ataque');
    }
    if (!instructions.includes('explorar flancos') && !instructions.includes('cruzar')) {
      weaknesses.push('Pode faltar largura no ataque');
    }
    if (instructions.length > 12) {
      weaknesses.push('Muitas instruções podem confundir jogadores');
    }
    if (instructions.length < 3) {
      weaknesses.push('Poucas instruções - tática pode ser muito genérica');
    }

    return { strengths, weaknesses };
  }

  /**
   * Gera recomendações de melhoria
   */
  generateRecommendations(tactic) {
    const fourMoments = this.analyzeFourMoments(tactic);
    const methodology = this.identifyMethodology(tactic);
    const { strengths, weaknesses } = this.analyzeStrengthsWeaknesses(tactic);
    
    const recommendations = [];

    // Baseado nos 4 momentos
    if (fourMoments.moment4_defensiveTransition.score < 30) {
      recommendations.push({
        category: 'Transição Defensiva',
        suggestion: 'Adicionar "Contra-pressionar" para recuperar bola mais rápido',
        impact: 'Alto'
      });
    }

    if (fourMoments.moment1_offensiveOrg.score < 30) {
      recommendations.push({
        category: 'Organização Ofensiva',
        suggestion: 'Definir melhor como atacar: adicionar "Manter Posse" ou "Trabalhar bola para área"',
        impact: 'Médio'
      });
    }

    // Baseado na metodologia
    if (methodology.coach && methodology.similarity < 60) {
      const coach = methodology.coach;
      recommendations.push({
        category: 'Alinhamento Metodológico',
        suggestion: `Para aplicar melhor ${coach.name}: ${coach.fmRecommendations[0]}`,
        impact: 'Médio'
      });
    }

    // Baseado em fraquezas
    weaknesses.forEach(weakness => {
      if (weakness.includes('contraditórias')) {
        recommendations.push({
          category: 'Consistência',
          suggestion: 'Remover instruções contraditórias - escolher entre posse OU contra-ataque',
          impact: 'Alto'
        });
      }
    });

    return recommendations;
  }

  /**
   * Avalia a tática com um rating geral
   */
  rateTactic(tactic) {
    const fourMoments = this.analyzeFourMoments(tactic);
    const { strengths, weaknesses } = this.analyzeStrengthsWeaknesses(tactic);
    const methodology = this.identifyMethodology(tactic);

    // Calcular score dos 4 momentos
    const avgMoments = (
      fourMoments.moment1_offensiveOrg.score +
      fourMoments.moment2_offensiveTransition.score +
      fourMoments.moment3_defensiveOrg.score +
      fourMoments.moment4_defensiveTransition.score
    ) / 4;

    // Calcular score de consistência
    const consistencyScore = Math.max(0, 100 - (weaknesses.length * 15));

    // Calcular score de profundidade
    const depthScore = Math.min(100, strengths.length * 20);

    // Score total
    const totalScore = Math.round((avgMoments * 0.4) + (consistencyScore * 0.3) + (depthScore * 0.3));

    let rating = 'C';
    let description = 'Tática básica com espaço para melhorias';
    
    if (totalScore >= 85) {
      rating = 'S';
      description = 'Tática excepcional com princípios muito bem definidos';
    } else if (totalScore >= 70) {
      rating = 'A';
      description = 'Tática muito boa com conceitos sólidos';
    } else if (totalScore >= 55) {
      rating = 'B';
      description = 'Tática competente com alguns pontos a melhorar';
    } else if (totalScore >= 40) {
      rating = 'C';
      description = 'Tática funcional mas com várias melhorias possíveis';
    } else {
      rating = 'D';
      description = 'Tática precisa de revisão significativa';
    }

    return {
      overall: totalScore,
      rating,
      description,
      breakdown: {
        fourMoments: Math.round(avgMoments),
        consistency: consistencyScore,
        depth: depthScore
      }
    };
  }
}

export default AdvancedTacticalAnalysis;
