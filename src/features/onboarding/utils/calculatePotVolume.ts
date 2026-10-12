/**
 * Volume calculation utility for Step 3 onboarding component.
 * Converts container dimensions in centimeters to volume in liters.
 */

export const calculatePotVolume = (lengthCm: number, widthCm: number, heightCm: number): number => {
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) return 0;
  const volumeLiters = (lengthCm * widthCm * heightCm) / 1000;
  return Number(volumeLiters.toFixed(1));
};

/**
 * Formats the calculated pot volume into the standardized UI label.
 * Strictly renders Polish UI label "Obliczona pojemność: " followed by ${volumeLiters} l without any hyphen/dash/tilde prefix.
 */
export const formatCalculatedPotVolume = (volumeLiters: number, language: 'pl' | 'en' = 'pl'): string => {
  if (language === 'en') {
    return `Calculated volume: ${volumeLiters} L`;
  }
  return `Obliczona pojemność: ${volumeLiters} l`;
};
