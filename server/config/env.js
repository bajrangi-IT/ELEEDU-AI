const { cleanEnv, str, port } = require('envalid');
const logger = require('../services/logger');

/**
 * Validates environment variables at startup.
 * Ensures that the application has all required configurations.
 */
const validateEnv = () => {
  try {
    cleanEnv(process.env, {
      NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'production' }),
      PORT: port({ default: 5000 }),
      GEMINI_API_KEY: str({ desc: 'Google Gemini API Key for AI Assistant' }),
      VITE_GOOGLE_MAPS_API_KEY: str({ desc: 'Google Maps API Key for Booth Locator' })
    });
    logger.info('Environment variables validated successfully.');
  } catch (error) {
    logger.error('Environment validation failed:', error.message);
    process.exit(1);
  }
};

module.exports = validateEnv;
