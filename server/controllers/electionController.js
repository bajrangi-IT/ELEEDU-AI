const { GoogleGenerativeAI } = require('@google/generative-ai');
const { checkEligibility } = require('../utils/eligibility');
const { translateText } = require('../services/googleServices');
const NodeCache = require('node-cache');
require('dotenv').config();

// Initialize Caching (TTL 1 hour)
const chatCache = new NodeCache({ stdTTL: 3600 });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

const validateEligibility = (req, res) => {
  try {
    const userData = req.body;
    if (!userData || typeof userData !== 'object') {
      return res.status(400).json({ error: 'Invalid user data' });
    }
    const result = checkEligibility(userData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getElectionTypes = (req, res) => {
  const types = [
    { id: 'national', name: 'National Elections (Lok Sabha)', frequency: '5 Years' },
    { id: 'state', name: 'State Assembly (Vidhan Sabha)', frequency: '5 Years' },
    { id: 'local', name: 'Local Bodies (Panchayat/Municipal)', frequency: '5 Years' }
  ];
  res.json(types);
};

const handleChat = async (req, res) => {
  const { query, lang = 'en' } = req.body;
  
  if (!query || typeof query !== 'string' || query.length > 500) {
    return res.status(400).json({ error: 'Valid query (max 500 chars) is required' });
  }

  // Check Cache
  const cacheKey = `${lang}_${query.toLowerCase().trim()}`;
  const cachedResponse = chatCache.get(cacheKey);
  if (cachedResponse) {
    return res.json({ response: cachedResponse, cached: true });
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
    if (process.env.GEMINI_API_KEY && 
        process.env.GEMINI_API_KEY !== 'your_gemini_api_key' && 
        process.env.GEMINI_API_KEY !== 'MOCK_KEY' &&
        process.env.GEMINI_API_KEY.startsWith('AIza')) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      responseText = response.text();
    } else {
      responseText = `[MOCK AI MODE] I received your question: "${query}". Please check your GEMINI_API_KEY.`;
    }

    if (lang !== 'en') {
      responseText = await translateText(responseText, lang);
    }

    // Save to Cache
    chatCache.set(cacheKey, responseText);

    res.json({ response: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      details: error.message 
    });
  }
};

module.exports = { validateEligibility, getElectionTypes, handleChat };
