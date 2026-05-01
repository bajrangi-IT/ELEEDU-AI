/**
 * Election Assistant Controller
 * Handles user interactions, eligibility checks, and AI-driven chat responses.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { checkEligibility } = require('../utils/eligibility');
const { translateText } = require('../services/googleServices');
const NodeCache = require('node-cache');
require('dotenv').config();

// Initialize Caching (TTL 1 hour) for optimized performance and reduced API costs
const chatCache = new NodeCache({ stdTTL: 3600 });

// Initialize Google Gemini Generative AI (apiVersion set in getGenerativeModel)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

/**
 * Validates voter eligibility based on user-provided demographic data.
 * @param {import('express').Request} req - Express request object containing userData.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
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
 * @returns {void}
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
 * Handles AI-driven conversational queries using Google Gemini.
 * Implements response caching and multi-language translation support.
 * @param {import('express').Request} req - Express request object containing query and lang.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const handleChat = async (req, res) => {
  const { query, lang = 'en' } = req.body;
  
  // Input Validation (Security & Quality)
  if (!query || typeof query !== 'string' || query.length > 500) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: Valid query (max 500 characters) is required.' 
    });
  }

  // Cache Lookup for Performance Efficiency
  const cacheKey = `${lang}_${query.toLowerCase().trim()}`;
  const cachedResponse = chatCache.get(cacheKey);
  if (cachedResponse) {
    return res.status(200).json({ 
      success: true,
      response: cachedResponse, 
      cached: true 
    });
  }

  try {
    const systemPrompt = `You are an expert Election Assistant. 
    Your goal is to provide accurate, neutral, and helpful information about elections.
    
    ORGANIZATION RULES:
    1. Be CONCISE. Use maximum 3-4 sentences per point.
    2. Use BULLET POINTS for lists.
    3. Use BOLD text for key terms.
    4. Structure your answer: Start with a direct answer, followed by brief supporting details or steps.
    5. If a query is not related to elections, politely guide the user back.
    
    Avoid large blocks of text. Make it easy to read on a mobile screen.`;

    const prompt = `${systemPrompt}\n\nUser Question: ${query}`;
    
    let responseText;
    
    // Check for valid API configuration
    if (process.env.GEMINI_API_KEY && 
        process.env.GEMINI_API_KEY !== 'your_gemini_api_key' && 
        process.env.GEMINI_API_KEY !== 'MOCK_KEY' &&
        process.env.GEMINI_API_KEY.startsWith('AIza')) {
      
      const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash"];
      let lastError;
      const axios = require('axios');

      for (const modelName of modelsToTry) {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 1024,
              }
            },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (response.data?.candidates?.[0]?.content) {
            responseText = response.data.candidates[0].content.parts[0].text;
            break;
          }
        } catch (err) {
          lastError = err.response?.data?.error?.message || err.message;
        }
      }

      if (!responseText) {
        throw new Error(`AI Assistant Error: Unable to reach AI brain. Details: ${lastError}`);
      }
    } else {
      // Fallback/Mock mode for local development or missing configuration
      responseText = `[MOCK AI MODE] I received your question: "${query}". Please check your GEMINI_API_KEY configuration on the platform.`;
    }

    // Language Translation Support via Google Cloud Services
    if (lang !== 'en') {
      responseText = await translateText(responseText, lang);
    }

    // Persist response to cache
    chatCache.set(cacheKey, responseText);

    res.status(200).json({ success: true, response: responseText });
  } catch (error) {
    console.error('Gemini API Integration Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI Error: Failed to generate response.',
      details: error.message 
    });
  }
};

module.exports = { validateEligibility, getElectionTypes, handleChat };
