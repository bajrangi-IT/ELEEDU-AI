const express = require('express');
const router = express.Router();
const { validateEligibility, getElectionTypes, handleChat } = require('../controllers/electionController');

// Eligibility Routes
router.post('/check-eligibility', validateEligibility);

// Election Info Routes
router.get('/types', getElectionTypes);

// AI Assistant Route
router.post('/chat', handleChat);

module.exports = router;
