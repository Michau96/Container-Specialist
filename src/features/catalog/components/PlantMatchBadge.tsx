import React from 'react';

export interface PlantMatchBadgeProps {
  matchPercentage: number;
  className?: string;
  dataTestId?: string;
}

export const PlantMatchBadge: React.FC<PlantMatchBadgeProps> = ({
  matchPercentage,
  className = '',
  dataTestId,
}) => {
  if (matchPercentage < 70) {
    return (
      <span
        data-testid={dataTestId || 'plant-match-badge-attention'}
        className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 ${className}`}
      >
        Wymaga uwagi
      </span>
    );
  }

  return (
    <span
      data-testid={dataTestId || 'plant-match-badge'}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/80 ${className}`}
    >
      {`${matchPercentage}% dopasowania`}
    </span>
  );
};
