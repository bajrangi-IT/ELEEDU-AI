const axios = require('axios');
const logger = require('./logger');

/**
 * Service to handle all interactions with Google Gemini AI.
 * Implements retry logic, model fallback, and request optimization.
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
    this.models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
  }

  /**
   * Generates content using the best available model with conversation history.
   * @param {string} prompt - The current user prompt.
   * @param {Array} history - Previous conversation messages.
   * @returns {Promise<string>} - The AI generated text.
   */
  async generateResponse(prompt, history = []) {
    if (!this.apiKey || this.apiKey === 'MOCK_KEY') {
      return `[MOCK MODE] Prompt: ${prompt}`;
    }

    let lastError = null;
    const contents = [...history, { role: 'user', parts: [{ text: prompt }] }];

    for (const model of this.models) {
      try {
        const response = await axios.post(
          `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
          {
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              maxOutputTokens: 1024,
            }
          },
          { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000 
          }
        );

        const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          logger.info(`GeminiService: Successfully generated response using model [${model}]`);
          return content;
        }
      } catch (error) {
        lastError = error.response?.data?.error?.message || error.message;
        logger.warn(`GeminiService: Model [${model}] failure - ${lastError}`);
      }
    }

    logger.error(`GeminiService: All models failed. Last Error: ${lastError}`);
    throw new Error(`GeminiService failed after trying all models. Last Error: ${lastError}`);
  }
}

module.exports = new GeminiService();
