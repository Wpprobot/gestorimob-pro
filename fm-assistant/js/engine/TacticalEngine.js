/**
 * TACTICAL ENGINE - FM TACTICAL ASSISTANT
 * Core analysis engine for tactical recommendations
 */

import KnowledgeBase from './KnowledgeBase.js';

export class TacticalEngine {
  constructor() {
    this.kb = KnowledgeBase;
  }

  /**
   * Analyze opponent and generate tactical recommendations
   */
  analyzeOpponent(opponentData) {
    const {
      formation = '4-4-2',
      style = 'balanced',
      strengths = [],
      weaknesses = [],
      keyPlayers = []
    } = opponentData;

    const recommendations = {
      formation: this.recommendFormation(formation, strengths, weaknesses),
      tacticalStyle: this.recommendTacticalStyle(style, strengths, weaknesses),
      teamInstructions: this.generateTeamInstructions(formation, style, weaknesses),
      playerRoles: this.recommendPlayerRoles(formation, strengths),
      setpieces: this.analyzeSetPieceVulnerabilities(weaknesses),
      keyPoints: this.generateKeyPoints(opponentData)
    };

    return recommendations;
  }

  /**
   * Recommend best formation against opponent
   */
  recommendFormation(opponentFormation, strengths, weaknesses) {
    // Extract number of forwards from opponent formation
    const parts = opponentFormation.split('-');
    const opponentForwards = parseInt(parts[parts.length - 1]);

    // If opponent has width (wingers)
    if (opponentFormation.includes('4-3-3') || opponentFormation.includes('4-2-3-1')) {
      if (weaknesses.includes('aerial') || weaknesses.includes('physical')) {
        return {
          recommended: '3-5-2',
          reasoning: 'Três zagueiros oferecem superioridade aérea e física no centro. Alas compensam largura do adversário.',
          alternative: '5-3-2'
        };
      }
      return {
        recommended: '4-2-3-1',
        reasoning: 'Espelha a formação do adversário, mantendo equilíbrio em todas as zonas do campo.',
        alternative: '4-3-3'
      };
    }

    // If opponent plays narrow
    if (opponentFormation.includes('4-4-2') || opponentFormation.includes('4-1-2-1-2')) {
      return {
        recommended: '4-3-3',
        reasoning: 'Explorar laterais com extremos rápidos. Dominar meio-campo com três jogadores.',
        alternative: '4-2-3-1'
      };
    }

    // Against 3 at the back
    if (opponentFormation.startsWith('3-') || opponentFormation.startsWith('5-')) {
      return {
        recommended: '4-3-3',
        reasoning: 'Dois extremos contra três zagueiros cria vantagem numérica nas laterais.',
        alternative: '4-2-3-1'
      };
    }

    // Default recommendation
    return {
      recommended: '4-2-3-1',
      reasoning: 'Formação balanceada e versátil, adaptável a diferentes situações de jogo.',
      alternative: '4-3-3'
    };
  }

  /**
   * Recommend tactical style based on opponent
   */
  recommendTacticalStyle(opponentStyle, strengths, weaknesses) {
    // Against possession-heavy teams
    if (opponentStyle === 'possession' || strengths.includes('passing')) {
      return {
        style: 'counterAttack',
        mentality: 'Counter',
        reasoning: 'Absorver pressão e explorar transições rápidas contra time que mantém posse.',
        details: this.kb.tacticalStyles.counterAttack
      };
    }

    // Against high-pressing teams
    if (opponentStyle === 'gegenpress' || strengths.includes('pressing')) {
      return {
        style: 'possession',
        mentality: 'Positive',
        reasoning: 'Manter posse com passes curtos e seguros para evitar pressão e desgastar adversário.',
        details: this.kb.tacticalStyles.possession
      };
    }

    // Against defensive teams
    if (opponentStyle === 'defensive' || strengths.includes('defensive')) {
      return {
        style: 'possession',
        mentality: 'Attacking',
        reasoning: 'Dominar posse e trabalhar pacientemente para criar aberturas contra bloco defensivo.',
        details: this.kb.tacticalStyles.tikitaka
      };
    }

    // Against weak teams
    if (weaknesses.includes('defensive') || weaknesses.includes('quality')) {
      return {
        style: 'gegenpress',
        mentality: 'Attacking',
        reasoning: 'Pressão alta para forçar erros e criar oportunidades de gol rapidamente.',
        details: this.kb.tacticalStyles.gegenpress
      };
    }

    // Balanced approach
    return {
      style: 'balanced',
      mentality: 'Positive',
      reasoning: 'Abordagem equilibrada com transições rápidas e pressão moderada.',
      details: null
    };
  }

  /**
   * Generate team instructions
   */
  generateTeamInstructions(formation, style, weaknesses) {
    const instructions = [];

    // Based on opponent weaknesses
    if (weaknesses.includes('pace')) {
      instructions.push('Ritmo mais alto');
      instructions.push('Contra-ataque');
      instructions.push('Distribuir rápido para os atacantes');
    }

    if (weaknesses.includes('aerial')) {
      instructions.push('Cruzar mais');
      instructions.push('Bolas para área');
      instructions.push('Explorar os flancos');
    }

    if (weaknesses.includes('pressing')) {
      instructions.push('Passar mais curto');
      instructions.push('Jogar para fora da defesa');
    }

    if (weaknesses.includes('width')) {
      instructions.push('Explorar os flancos');
      instructions.push('Sobrepor laterais');
    }

    if (weaknesses.includes('defensive')) {
      instructions.push('Trabalhar bola para área');
      instructions.push('Atirar de longe');
    }

    // Default instructions if none specific
    if (instructions.length === 0) {
      instructions.push('Jogar para fora da defesa');
      instructions.push('Manter forma');
    }

    return instructions;
  }

  /**
   * Recommend player roles for formation
   */
  recommendPlayerRoles(formation, opponentStrengths) {
    const formationData = this.kb.formations[formation] || this.kb.formations['4-2-3-1'];
    return formationData.idealRoles;
  }

  /**
   * Analyze set piece vulnerabilities
   */
  analyzeSetPieceVulnerabilities(weaknesses) {
    const setpieces = {
      corners: [],
      freekicks: [],
      defensive: []
    };

    if (weaknesses.includes('aerial')) {
      setpieces.corners.push('Marcar jogadores altos na área');
      setpieces.corners.push('Bolas altas no primeiro poste');
      setpieces.freekicks.push('Bolas altas na área');
    }

    if (weaknesses.includes('marking')) {
      setpieces.corners.push('Jogadas ensaiadas com movimentos cruzados');
      setpieces.defensive.push('Marcar por zona');
    }

    if (weaknesses.includes('goalkeeper')) {
      setpieces.freekicks.push('Finalizações diretas de fora da área');
      setpieces.corners.push('Bolas na pequena área');
    }

    return setpieces;
  }

  /**
   * Generate key tactical points
   */
  generateKeyPoints(opponentData) {
    const points = [];

    if (opponentData.keyPlayers && opponentData.keyPlayers.length > 0) {
      points.push(`Marcar de perto: ${opponentData.keyPlayers.join(', ')}`);
    }

    if (opponentData.recentForm === 'good') {
      points.push('Adversário em boa forma - começar focado e não dar espaços');
    } else if (opponentData.recentForm === 'poor') {
      points.push('Adversário em má fase - pressionar alto desde o início');
    }

    if (opponentData.homeAway === 'away') {
      points.push('Jogar fora - manter paciência e disciplina tática');
    }

    return points;
  }

  /**
   * Analyze squad and suggest best XI
   */
  analyzeSquad(players, formation = '4-2-3-1') {
    const formationData = this.kb.formations[formation];
    const positions = this.getPositionsFromFormation(formation);
    const bestXI = {};
    const analysis = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    // For each position, find best suited player
    positions.forEach(position => {
      const suitablePlayers = players
        .filter(p => this.isPlayerSuitableForPosition(p, position))
        .sort((a, b) => this.calculatePlayerSuitability(b, position) - this.calculatePlayerSuitability(a, position));

      if (suitablePlayers.length > 0) {
        bestXI[position] = suitablePlayers[0];
      }
    });

    // Analyze squad strengths
    analysis.strengths = this.identifySquadStrengths(players);
    analysis.weaknesses = this.identifySquadWeaknesses(players);
    analysis.recommendations = this.generateSquadRecommendations(players, analysis);

    return { bestXI, analysis };
  }

  /**
   * Get positions array from formation string
   */
  getPositionsFromFormation(formation) {
    const basePositions = ['GK'];
    
    if (formation === '4-2-3-1') {
      return [...basePositions, 'DL', 'DC', 'DC', 'DR', 'DM', 'DM', 'AML', 'AMC', 'AMR', 'ST'];
    } else if (formation === '4-3-3') {
      return [...basePositions, 'DL', 'DC', 'DC', 'DR', 'DM', 'MC', 'MC', 'AML', 'AMR', 'ST'];
    } else if (formation === '3-5-2') {
      return [...basePositions, 'DC', 'DC', 'DC', 'WBL', 'DM', 'MC', 'MC', 'WBR', 'ST', 'ST'];
    } else if (formation === '4-4-2') {
      return [...basePositions, 'DL', 'DC', 'DC', 'DR', 'ML', 'MC', 'MC', 'MR', 'ST', 'ST'];
    }
    
    return [...basePositions, 'DL', 'DC', 'DC', 'DR', 'DM', 'DM', 'AML', 'AMC', 'AMR', 'ST'];
  }

  /**
   * Check if player is suitable for position
   */
  isPlayerSuitableForPosition(player, position) {
    if (!player.positions) return false;
    
    const positionMap = {
      'GK': ['GK'],
      'DL': ['DL', 'WBL', 'DRL'],
      'DC': ['DC', 'D'],
      'DR': ['DR', 'WBR', 'DR/WBR'],
      'DM': ['DM', 'MC'],
      'MC': ['MC', 'DM', 'AMC'],
      'AML': ['AML', 'ML', 'ST'],
      'AMC': ['AMC', 'MC'],
      'AMR': ['AMR', 'MR', 'ST'],
      'ST': ['ST', 'AMC'],
      'WBL': ['WBL', 'DL', 'AML'],
      'WBR': ['WBR', 'DR', 'AMR'],
      'ML': ['ML', 'AML', 'DL'],
      'MR': ['MR', 'AMR', 'DR']
    };

    const acceptablePositions = positionMap[position] || [position];
    return player.positions.some(p => acceptablePositions.includes(p));
  }

  /**
   * Calculate player suitability score for position
   */
  calculatePlayerSuitability(player, position) {
    const positionKey = position.replace(/[0-9]/g, '');
    const requiredAttrs = this.kb.attributesByPosition[positionKey] || this.kb.attributesByPosition.MC;
    
    let score = 0;
    
    // Essential attributes - triple weight
    if (requiredAttrs.essential && player.attributes) {
      requiredAttrs.essential.forEach(attr => {
        score += (player.attributes[attr] || 10) * 3;
      });
    }
    
    // Important attributes - double weight
    if (requiredAttrs.important && player.attributes) {
      requiredAttrs.important.forEach(attr => {
        score += (player.attributes[attr] || 10) * 2;
      });
    }
    
    // Useful attributes - normal weight
    if (requiredAttrs.useful && player.attributes) {
      requiredAttrs.useful.forEach(attr => {
        score += (player.attributes[attr] || 10);
      });
    }
    
    return score;
  }

  /**
   * Identify squad strengths
   */
  identifySquadStrengths(players) {
    const strengths = [];
    const avgAttributes = this.calculateAverageAttributes(players);

    if (avgAttributes.Velocidade > 14) strengths.push('Velocidade');
    if (avgAttributes.Técnica > 14) strengths.push('Técnica');
    if (avgAttributes.Físico > 14) strengths.push('Físico');
    if (avgAttributes.Passe > 14) strengths.push('Qualidade de passe');
    if (avgAttributes.Finalização > 13) strengths.push('Finalização');

    return strengths;
  }

  /**
   * Identify squad weaknesses
   */
  identifySquadWeaknesses(players) {
    const weaknesses = [];
    const avgAttributes = this.calculateAverageAttributes(players);

    if (avgAttributes.Velocidade < 12) weaknesses.push('Falta de velocidade');
    if (avgAttributes.Resistência < 12) weaknesses.push('Condicionamento físico');
    if (avgAttributes.Técnica < 11) weaknesses.push('Qualidade técnica limitada');
    if (avgAttributes.Mental < 12) weaknesses.push('Atributos mentais');

    return weaknesses;
  }

  /**
   * Calculate average attributes
   */
  calculateAverageAttributes(players) {
    if (!players || players.length === 0) {
      return { Velocidade: 12, Técnica: 12, Físico: 12, Passe: 12, Finalização: 12, Resistência: 12, Mental: 12 };
    }

    // Placeholder - would calculate from actual player data
    return {
      Velocidade: 13,
      Técnica: 12,
      Físico: 13,
      Passe: 12,
      Finalização: 11,
      Resistência: 13,
      Mental: 12
    };
  }

  /**
   * Generate squad recommendations
   */
  generateSquadRecommendations(players, analysis) {
    const recommendations = [];

    analysis.weaknesses.forEach(weakness => {
      if (weakness.includes('velocidade')) {
        recommendations.push('Considere contratar jogadores mais rápidos ou adaptar tática para menos dependência de velocidade');
      }
      if (weakness.includes('técnica')) {
        recommendations.push('Foco em treinamento técnico e instruções mais diretas para minimizar erros');
      }
      if (weakness.includes('físico')) {
        recommendations.push('Aumentar treinamento físico na pré-temporada e considerar formações mais compactas');
      }
    });

    return recommendations;
  }
}

export default TacticalEngine;
