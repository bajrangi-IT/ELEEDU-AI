const { checkEligibility } = require('../utils/eligibility');

describe('Eligibility Checker Logic', () => {
  test('should return eligible for 18+ citizens with 6+ months residency', () => {
    const userData = { age: 20, isCitizen: true, residencyPeriod: 12 };
    const result = checkEligibility(userData);
    expect(result.isEligible).toBe(true);
    expect(result.reasons[0]).toBe('You are eligible to vote! Make sure to register.');
  });

  test('should return ineligible for under 18', () => {
    const userData = { age: 16, isCitizen: true, residencyPeriod: 12 };
    const result = checkEligibility(userData);
    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('You must be at least 18 years old to vote.');
  });

  test('should return ineligible for non-citizens', () => {
    const userData = { age: 25, isCitizen: false, residencyPeriod: 12 };
    const result = checkEligibility(userData);
    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('You must be a citizen of the country to vote.');
  });
});
