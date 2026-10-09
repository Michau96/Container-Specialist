import { MyCropItem } from '../types';

/**
 * Generates a deterministic, canonical uniqueness key based on
 * userId (or 'guest'), plantId, and container/growing location ID.
 */
export function getCropUniquenessKey(
  userId: string | undefined | null,
  plantId: string,
  containerOrLocationId: string = 'default'
): string {
  const normUser = (userId && userId.trim()) ? userId.trim() : 'guest';
  const normPlant = plantId.trim().toLowerCase();
  const normContainer = (containerOrLocationId && containerOrLocationId.trim())
    ? containerOrLocationId.trim().toLowerCase()
    : 'default';

  return `${normUser}::${normPlant}::${normContainer}`;
}

/**
 * Checks if a crop already exists for the given user, plant, and container/location.
 */
export function findExistingCrop(
  existingCrops: MyCropItem[],
  userId: string | undefined | null,
  plantId: string,
  containerOrLocationId: string = 'default'
): MyCropItem | undefined {
  if (!Array.isArray(existingCrops)) return undefined;

  const targetKey = getCropUniquenessKey(userId, plantId, containerOrLocationId);

  return existingCrops.find((c) => {
    // 1. Direct uniquenessKey match
    if (c.uniquenessKey && c.uniquenessKey === targetKey) {
      return true;
    }
    // 2. Matching plantId and containerId
    const cContainer = c.containerId || 'default';
    if (c.plantId === plantId && cContainer === containerOrLocationId) {
      return true;
    }
    // 3. Match plantId directly if no explicit container specified
    if (c.plantId === plantId && containerOrLocationId === 'default' && (!c.containerId || c.containerId === 'default')) {
      return true;
    }
    return false;
  });
}

/**
 * Check if a crop is a duplicate
 */
export function isCropDuplicate(
  existingCrops: MyCropItem[],
  userId: string | undefined | null,
  plantId: string,
  containerOrLocationId: string = 'default'
): boolean {
  return findExistingCrop(existingCrops, userId, plantId, containerOrLocationId) !== undefined;
}

export interface AddCropIdempotentResult {
  crops: MyCropItem[];
  added: boolean;
  duplicate: boolean;
  crop: MyCropItem;
  message: string;
}

/**
 * Idempotently adds a crop to the collection.
 * If the crop already exists for this (userId, plantId, containerId),
 * it returns the unmodified collection and the existing crop item,
 * preventing silent duplicates.
 */
export function addCropIdempotent(
  existingCrops: MyCropItem[],
  newCrop: MyCropItem,
  userId: string | undefined | null,
  containerOrLocationId: string = 'default'
): AddCropIdempotentResult {
  const existing = findExistingCrop(existingCrops, userId, newCrop.plantId, containerOrLocationId);

  if (existing) {
    return {
      crops: existingCrops,
      added: false,
      duplicate: true,
      crop: existing,
      message: 'Ta roślina znajduje się już w Twoich uprawach w tym pojemniku / lokalizacji.',
    };
  }

  const key = getCropUniquenessKey(userId, newCrop.plantId, containerOrLocationId);
  const preparedCrop: MyCropItem = {
    ...newCrop,
    uniquenessKey: key,
    containerId: containerOrLocationId !== 'default' ? containerOrLocationId : (newCrop.containerId || 'default'),
  };

  return {
    crops: [...existingCrops, preparedCrop],
    added: true,
    duplicate: false,
    crop: preparedCrop,
    message: 'Pomyślnie dodano do Moich upraw!',
  };
}
