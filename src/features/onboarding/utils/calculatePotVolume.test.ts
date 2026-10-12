import { describe, it, expect } from 'vitest';
import { calculatePotVolume, formatCalculatedPotVolume } from './calculatePotVolume';

describe('calculatePotVolume & formatCalculatedPotVolume', () => {
  it('converts rectangular dimensions (60, 20, 18) in cm to exactly 21.6 liters', () => {
    const volume = calculatePotVolume(60, 20, 18);
    expect(volume).toBe(21.6);
  });

  it('renders strictly the Polish UI label "Obliczona pojemność: 21.6 l" without hyphen or dash or tilde', () => {
    const volume = calculatePotVolume(60, 20, 18);
    const labelPl = formatCalculatedPotVolume(volume, 'pl');
    expect(labelPl).toBe('Obliczona pojemność: 21.6 l');
    expect(labelPl).not.toContain('-');
    expect(labelPl).not.toContain('~');
    expect(labelPl).not.toContain('–');
  });

  it('renders the English UI label without hyphen or dash prefix', () => {
    const volume = calculatePotVolume(60, 20, 18);
    const labelEn = formatCalculatedPotVolume(volume, 'en');
    expect(labelEn).toBe('Calculated volume: 21.6 L');
    expect(labelEn).not.toContain('-');
    expect(labelEn).not.toContain('~');
  });

  it('returns 0 if any dimension is <= 0', () => {
    expect(calculatePotVolume(0, 20, 18)).toBe(0);
    expect(calculatePotVolume(60, 0, 18)).toBe(0);
    expect(calculatePotVolume(60, 20, 0)).toBe(0);
    expect(calculatePotVolume(-10, 20, 18)).toBe(0);
    expect(calculatePotVolume(60, -5, 18)).toBe(0);
    expect(calculatePotVolume(60, 20, -1)).toBe(0);
  });

  it('correctly rounds to 1 decimal place using Number(volumeLiters.toFixed(1))', () => {
    // 33 * 22 * 15 = 10890 -> 10.89 -> 10.9
    expect(calculatePotVolume(33, 22, 15)).toBe(10.9);
    // 50 * 25 * 20 = 25000 -> 25.0 -> 25
    expect(calculatePotVolume(50, 25, 20)).toBe(25);
  });
});
