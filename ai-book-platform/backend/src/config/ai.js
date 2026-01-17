import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Google Gemini
let genAI = null;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

// OpenAI (opcional)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Retorna modelo Gemini configurado
 */
export function getGeminiModel(modelName = 'gemini-2.0-flash-exp') {
  if (!genAI) {
    throw new Error('Google API Key não configurada');
  }
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Retorna cliente OpenAI
 */
export function getOpenAI() {
  if (!openai) {
    throw new Error('OpenAI API Key não configurada');
  }
  return openai;
}

export { genAI, openai };
