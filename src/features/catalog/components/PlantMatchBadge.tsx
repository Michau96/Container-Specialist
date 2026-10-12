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
        className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
      >
        Wymaga uwagi
      </span>
    );
  }

  return (
    <span
      data-testid={dataTestId || 'plant-match-badge'}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 ${className}`}
    >
      {`${matchPercentage}% dopasowania`}
    </span>
  );
};
