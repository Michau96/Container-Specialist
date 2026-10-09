import { describe, it, expect } from 'vitest';
import {
  getCropUniquenessKey,
  findExistingCrop,
  isCropDuplicate,
  addCropIdempotent,
} from './cropUniqueness';
import { MyCropItem } from '../types';

describe('Crop Uniqueness & Idempotent Addition Suite', () => {
  const sampleCrop: MyCropItem = {
    id: 'pomidor-karlowy_123456789',
    plantId: 'pomidor-karlowy',
    containerId: 'pot_terracotta_10l',
    selectedVariety: 'Vilma',
    varietyBadge: 'Odmiana donicowa',
    potCount: 1,
    addedAt: '2026-05-15T10:00:00.000Z',
    stage: 'rosnie',
  };

  it('1. Generates deterministic, canonical uniqueness key from userId, plantId, and containerId', () => {
    const key1 = getCropUniquenessKey('user_123', 'pomidor-karlowy', 'pot_terracotta_10l');
    const key2 = getCropUniquenessKey(' user_123 ', 'POMIDOR-KARLOWY', ' POT_TERRACOTTA_10L ');
    expect(key1).toBe('user_123::pomidor-karlowy::pot_terracotta_10l');
    expect(key2).toBe('user_123::pomidor-karlowy::pot_terracotta_10l');

    // Default container handling
    const keyGuest = getCropUniquenessKey(null, 'bazylia-wlasciwa', undefined);
    expect(keyGuest).toBe('guest::bazylia-wlasciwa::default');
  });

  it('2. First add: creates a new crop with canonical uniqueness key when no duplicate exists', () => {
    const initialCrops: MyCropItem[] = [];
    const result = addCropIdempotent(
      initialCrops,
      sampleCrop,
      'user_123',
      'pot_terracotta_10l'
    );

    expect(result.added).toBe(true);
    expect(result.duplicate).toBe(false);
    expect(result.crops).toHaveLength(1);
    expect(result.crops[0].plantId).toBe('pomidor-karlowy');
    expect(result.crops[0].uniquenessKey).toBe('user_123::pomidor-karlowy::pot_terracotta_10l');
  });

  it('3. Repeated add: detects duplicate, leaves collection unchanged, and provides clear Polish message', () => {
    const existingList: MyCropItem[] = [
      {
        ...sampleCrop,
        uniquenessKey: 'user_123::pomidor-karlowy::pot_terracotta_10l',
      },
    ];

    const result = addCropIdempotent(
      existingList,
      sampleCrop,
      'user_123',
      'pot_terracotta_10l'
    );

    expect(result.added).toBe(false);
    expect(result.duplicate).toBe(true);
    expect(result.crops).toHaveLength(1);
    expect(result.message).toContain('znajduje się już w Twoich uprawach');
    expect(result.crop.id).toBe(sampleCrop.id);
  });

  it('4. Double-click simulation: sequential rapid triggers do not create duplicate records', () => {
    let currentCrops: MyCropItem[] = [];

    // Click 1
    const click1 = addCropIdempotent(currentCrops, sampleCrop, 'user_123', 'pot_terracotta_10l');
    if (click1.added) {
      currentCrops = click1.crops;
    }

    // Click 2 (rapid successive click before UI re-render)
    const click2 = addCropIdempotent(currentCrops, sampleCrop, 'user_123', 'pot_terracotta_10l');
    if (click2.added) {
      currentCrops = click2.crops;
    }

    expect(currentCrops).toHaveLength(1);
    expect(click1.added).toBe(true);
    expect(click2.added).toBe(false);
    expect(click2.duplicate).toBe(true);
  });

  it('5. Network retry simulation: resending the same payload yields idempotent identical state', () => {
    const existingCrops: MyCropItem[] = [
      {
        ...sampleCrop,
        uniquenessKey: 'user_123::pomidor-karlowy::pot_terracotta_10l',
      },
    ];

    // Simulate 3 network retries
    for (let retry = 1; retry <= 3; retry++) {
      const response = addCropIdempotent(
        existingCrops,
        sampleCrop,
        'user_123',
        'pot_terracotta_10l'
      );
      expect(response.added).toBe(false);
      expect(response.duplicate).toBe(true);
      expect(response.crops).toHaveLength(1);
    }
  });

  it('6. Two browser tabs simulation: simultaneous adds for same user and container resolve uniquely', () => {
    // Shared backend / persistent store simulation
    const sharedServerState: MyCropItem[] = [];

    function handleTabAdd(tabId: string, plantId: string, containerId: string) {
      const isDup = isCropDuplicate(sharedServerState, 'shared_user', plantId, containerId);
      if (isDup) {
        return { success: true, duplicate: true, created: false };
      }
      const newRecord: MyCropItem = {
        id: `${plantId}_${tabId}`,
        plantId,
        containerId,
        selectedVariety: 'Standard',
        varietyBadge: 'Donicowa',
        potCount: 1,
        addedAt: new Date().toISOString(),
        stage: 'rosnie',
        uniquenessKey: getCropUniquenessKey('shared_user', plantId, containerId),
      };
      sharedServerState.push(newRecord);
      return { success: true, duplicate: false, created: true, record: newRecord };
    }

    const tab1Result = handleTabAdd('tab_1', 'ogorek-konserwowy', 'skrzynia_balkonowa_1');
    const tab2Result = handleTabAdd('tab_2', 'ogorek-konserwowy', 'skrzynia_balkonowa_1');

    expect(tab1Result.created).toBe(true);
    expect(tab2Result.created).toBe(false);
    expect(tab2Result.duplicate).toBe(true);
    expect(sharedServerState).toHaveLength(1);
    expect(sharedServerState[0].id).toBe('ogorek-konserwowy_tab_1');
  });

  it('7. Different containers allow same plant without collision', () => {
    const initialList: MyCropItem[] = [
      {
        ...sampleCrop,
        containerId: 'balcony_box_1',
        uniquenessKey: 'user_123::pomidor-karlowy::balcony_box_1',
      },
    ];

    // Adding same plant to different container should succeed
    const result = addCropIdempotent(
      initialList,
      { ...sampleCrop, id: 'pomidor_box_2', containerId: 'balcony_box_2' },
      'user_123',
      'balcony_box_2'
    );

    expect(result.added).toBe(true);
    expect(result.crops).toHaveLength(2);
    expect(result.crops[1].containerId).toBe('balcony_box_2');
  });
});
