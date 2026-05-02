const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const SecurityMiddleware = require('./middleware/security');
const logger = require('./services/logger');
const validateEnv = require('./config/env');
const { initializeFirebase } = require('./config/firebase');
require('dotenv').config();

// Professional Orchestration
try {
  validateEnv();
  initializeFirebase();
} catch (err) {
  logger.error('Startup Error:', err.message);
}

const app = express();
app.use(compression()); 

// Apply Enterprise Security Suite
SecurityMiddleware.apply(app);

app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '50kb' }));

// Professional Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Election Assistant API is running' });
});

// Start Server
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
}

module.exports = app;
