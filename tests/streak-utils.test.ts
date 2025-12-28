import { calculateStreak, calculateLongestStreak } from '../lib/utils';

describe('Streak Utilities', () => {
  const makeAttempt = (dateStr: string) => ({ completedAt: new Date(dateStr) });

  it('returns 0 for no attempts', () => {
    expect(calculateStreak([])).toBe(0);
    expect(calculateLongestStreak([])).toBe(0);
  });

  it('returns correct streak for consecutive days including today', () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);
    const attempts = [
      makeAttempt(today.toISOString()),
      makeAttempt(yesterday.toISOString()),
      makeAttempt(twoDaysAgo.toISOString()),
    ];
    expect(calculateStreak(attempts)).toBe(3);
    expect(calculateLongestStreak(attempts)).toBe(3);
  });

  it('returns correct streak if last activity was yesterday', () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);
    const attempts = [
      makeAttempt(yesterday.toISOString()),
      makeAttempt(twoDaysAgo.toISOString()),
    ];
    expect(calculateStreak(attempts)).toBe(2);
    expect(calculateLongestStreak(attempts)).toBe(2);
  });

  it('resets streak if a day is missed', () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setUTCDate(today.getUTCDate() - 2);
    const attempts = [
      makeAttempt(today.toISOString()),
      makeAttempt(twoDaysAgo.toISOString()),
    ];
    expect(calculateStreak(attempts)).toBe(1);
    expect(calculateLongestStreak(attempts)).toBe(1);
  });

  it('finds the longest streak in a mixed history', () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const d1 = new Date(today);
    d1.setUTCDate(today.getUTCDate() - 6);
    const d2 = new Date(today);
    d2.setUTCDate(today.getUTCDate() - 5);
    const d3 = new Date(today);
    d3.setUTCDate(today.getUTCDate() - 4);
    const d4 = new Date(today);
    d4.setUTCDate(today.getUTCDate() - 2);
    const d5 = new Date(today);
    d5.setUTCDate(today.getUTCDate() - 1);
    const d6 = new Date(today);
    d6.setUTCDate(today.getUTCDate());
    const attempts = [
      makeAttempt(d1.toISOString()),
      makeAttempt(d2.toISOString()),
      makeAttempt(d3.toISOString()),
      makeAttempt(d4.toISOString()),
      makeAttempt(d5.toISOString()),
      makeAttempt(d6.toISOString()),
    ];
    expect(calculateLongestStreak(attempts)).toBe(3);
    expect(calculateStreak(attempts)).toBe(3);
  });
});
