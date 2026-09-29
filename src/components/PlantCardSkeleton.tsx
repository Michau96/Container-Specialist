import React from 'react';

interface Props {
  count?: number;
}

export const PlantCardSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="plant-card-skeleton"
      className="flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden min-h-[460px] animate-pulse"
    >
      <span className="sr-only">Ładowanie karty uprawy...</span>

      {/* Visual top slot: preserves exactly the same h-60 sm:h-64 aspect ratio container as PlantCard */}
      <div className="relative h-60 sm:h-64 w-full bg-stone-200 dark:bg-stone-800 shrink-0">
        {/* Placeholder badge */}
        <div className="absolute top-3.5 left-3.5 w-36 h-6 rounded-full bg-stone-300 dark:bg-stone-700" />
      </div>

      {/* Content slot: identical padding and flex layout to PlantCard */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-4 bg-white dark:bg-stone-900">
        <div className="space-y-3">
          <div className="space-y-1.5">
            {/* Title placeholder */}
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-lg w-3/4" />
            {/* Subtitle / Latin name placeholder */}
            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
          </div>

          {/* Tags row */}
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-20 rounded-md bg-stone-200 dark:bg-stone-800" />
            <div className="h-5 w-16 rounded-md bg-stone-200 dark:bg-stone-800" />
          </div>

          {/* Description lines */}
          <div className="space-y-2 pt-1">
            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-full" />
            <div className="h-3.5 bg-stone-200 dark:bg-stone-800 rounded w-4/5" />
          </div>
        </div>

        {/* Action button placeholder */}
        <div className="pt-2">
          <div className="h-11 rounded-xl bg-stone-200 dark:bg-stone-800 w-full" />
        </div>
      </div>
    </div>
  );
};

export const CatalogSkeletonGrid: React.FC<{ count?: number; message?: string }> = ({
  count = 6,
  message = 'Ładowanie bazy upraw dla Twojego balkonu...',
}) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Ładowanie bazy roślin"
      data-testid="catalog-loading-skeletons"
      className="space-y-4"
    >
      <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/60 px-4 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-xs">
        <div className="w-4 h-4 rounded-full border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent animate-spin shrink-0" />
        <span data-testid="catalog-loading-status-text">{message}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <PlantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
