import React from 'react';
import { LocationAutocomplete } from './LocationAutocomplete';
import { PolandRegionKey } from '../../../types';

export interface LocationSearchStepProps {
  regionSearch: string;
  onRegionSearchChange: (value: string) => void;
  filteredRegions: PolandRegionKey[];
  selectedRegion: PolandRegionKey | null;
  handleSelectRegion: (regKey: PolandRegionKey) => void;
  isEn?: boolean;
}

export const LocationSearchStep: React.FC<LocationSearchStepProps> = ({
  regionSearch,
  onRegionSearchChange,
  filteredRegions,
  selectedRegion,
  handleSelectRegion,
  isEn = false,
}) => {
  return (
    <LocationAutocomplete
      regionSearch={regionSearch}
      onRegionSearchChange={onRegionSearchChange}
      filteredRegions={filteredRegions}
      selectedRegion={selectedRegion}
      onSelectRegion={handleSelectRegion}
      isEn={isEn}
    />
  );
};

export default LocationSearchStep;
