const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const logger = require('../services/logger');

/**
 * Advanced Security Middleware Suite.
 * Implements XSS protection, NoSQL injection prevention, and strict CSP.
 */
class SecurityMiddleware {
  /**
   * Applies all security middleware to the Express app.
   * @param {import('express').Application} app - The Express application.
   */
  static apply(app) {
    // 1. Strict Content Security Policy
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://maps.googleapis.com"],
          connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://maps.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
    }));

    // 2. Data Sanitization
    app.use(xss());
    app.use(mongoSanitize());

    // 3. Security Event Logging
    app.use((req, res, next) => {
      if (req.method === 'POST' || req.method === 'PUT') {
        logger.info(`Security Audit: ${req.method} request to ${req.url} from ${req.ip}`);
      }
      next();
    });

    logger.info('Security suite applied successfully.');
  }
}

module.exports = SecurityMiddleware;
