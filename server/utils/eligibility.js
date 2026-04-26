/**
 * Eligibility Checker Logic
 * @param {Object} userData - User information (age, citizenship, residency)
 * @returns {Object} - result { isEligible: boolean, reasons: string[] }
 */
const checkEligibility = (userData) => {
  const { age, isCitizen, residencyPeriod, hasVoterId } = userData;
  const reasons = [];

  if (age < 18) {
    reasons.push('You must be at least 18 years old to vote.');
  }

  if (!isCitizen) {
    reasons.push('You must be a citizen of the country to vote.');
  }

  // Simplified residency rule: e.g., must live in the constituency for at least 6 months
  if (residencyPeriod < 6) {
    reasons.push('You must have been a resident for at least 6 months.');
  }

  return {
    isEligible: reasons.length === 0,
    reasons: reasons.length > 0 ? reasons : ['You are eligible to vote! Make sure to register.'],
    nextSteps: reasons.length === 0 ? ['Find your polling booth', 'Check election dates'] : ['Register once eligible', 'Contact local election office for details']
  };
};

module.exports = { checkEligibility };
