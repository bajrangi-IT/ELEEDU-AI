import { describe, it, expect } from 'vitest';
import { checkEligibility } from '../utils/eligibility';

describe('Voter Eligibility Utility', () => {
  it('should grant eligibility for 18+ citizens with 6+ months residency', () => {
    const data = { age: 18, isCitizen: true, residencyPeriod: 6 };
    expect(checkEligibility(data).isEligible).toBe(true);
  });

  it('should deny eligibility if under 18', () => {
    const data = { age: 17, isCitizen: true, residencyPeriod: 12 };
    expect(checkEligibility(data).isEligible).toBe(false);
    expect(checkEligibility(data).reason).toContain('age');
  });

  it('should deny eligibility if not a citizen', () => {
    const data = { age: 25, isCitizen: false, residencyPeriod: 24 };
    expect(checkEligibility(data).isEligible).toBe(false);
    expect(checkEligibility(data).reason).toContain('citizenship');
  });

  it('should deny eligibility for short residency', () => {
    const data = { age: 21, isCitizen: true, residencyPeriod: 5 };
    expect(checkEligibility(data).isEligible).toBe(false);
    expect(checkEligibility(data).reason).toContain('residency');
  });

  it('should handle boundary values (18 years exactly)', () => {
    const data = { age: 18, isCitizen: true, residencyPeriod: 6 };
    const result = checkEligibility(data);
    expect(result.isEligible).toBe(true);
  });
});
