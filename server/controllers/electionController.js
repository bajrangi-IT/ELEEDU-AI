const geminiService = require('../services/geminiService');
const analyticsService = require('../services/analyticsService');
const { checkEligibility } = require('../utils/eligibility');
const { translateText } = require('../services/googleServices');
const NodeCache = require('node-cache');
require('dotenv').config();

// Initialize Caching (TTL 1 hour) for optimized performance and reduced API costs
const chatCache = new NodeCache({ stdTTL: 3600 });

/**
 * Validates voter eligibility based on user-provided demographic data.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
const validateEligibility = (req, res) => {
  try {
    const userData = req.body;
    if (!userData || typeof userData !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid request: User data is required and must be an object.' 
      });
    }
    const result = checkEligibility(userData);
    analyticsService.trackEvent('Eligibility', 'Check', { isEligible: result.isEligible });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Eligibility Controller Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during eligibility check.' });
  }
};

/**
 * Retrieves available election categories and their metadata.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
const getElectionTypes = (req, res) => {
  const types = [
    { id: 'national', name: 'National Elections (Lok Sabha)', frequency: '5 Years', icon: 'Globe' },
    { id: 'state', name: 'State Assembly (Vidhan Sabha)', frequency: '5 Years', icon: 'Map' },
    { id: 'local', name: 'Local Bodies (Panchayat/Municipal)', frequency: '5 Years', icon: 'Building' }
  ];
  res.status(200).json(types);
};

/**
 * Handles AI-driven conversational queries using Google Gemini via GeminiService.
 * @param {import('express').Request} req - Express request object containing query and lang.
 * @param {import('express').Response} res - Express response object.
 */
const handleChat = async (req, res) => {
  const { query, history = [], lang = 'en' } = req.body;
  
  // Validation for Security & Quality
  if (!query || typeof query !== 'string' || query.length > 500) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: Valid query (max 500 characters) is required.' 
    });
  }

  // Caching for Efficiency (Basic cache by query)
  const cacheKey = `${lang}_${query.toLowerCase().trim()}`;
  const cachedResponse = chatCache.get(cacheKey);
  if (cachedResponse && history.length === 0) {
    return res.status(200).json({ success: true, response: cachedResponse, cached: true });
  }

  try {
    const systemPrompt = `You are an expert Election Assistant. Provide accurate, neutral election guidance.
    RULES: Concise (3-4 sentences), use bullet points, bold key terms. 
    Stay on topic. Mobile-friendly structure. Current time: ${new Date().toISOString()}`;

    const prompt = `${systemPrompt}\n\nUser Question: ${query}`;
    
    // Call the dedicated Gemini service with history
    let responseText = await geminiService.generateResponse(prompt, history);
    analyticsService.trackEvent('Chat', 'Query', { lang, queryLength: query.length });

    // Multilingual support
    if (lang !== 'en') {
      responseText = await translateText(responseText, lang);
    }

    // Update cache
    chatCache.set(cacheKey, responseText);

    res.status(200).json({ success: true, response: responseText });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI Error: Failed to generate response.',
      details: error.message 
    });
  }
};

module.exports = { validateEligibility, getElectionTypes, handleChat };
