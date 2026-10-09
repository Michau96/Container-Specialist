import { PotShape, LegacyPotMaterial } from '../types';
import { POT_CALCULATION_VERSION, PotCalculationResult } from '../lib/potCalculations';

export interface PotCalculationDimensions {
  lengthCm?: number;
  widthCm?: number;
  heightCm: number;
  diameterCm?: number;
  unit: 'cm';
}

export interface PotCalculationResultSummary {
  grossVolumeL: number;
  netUsableVolumeL: number;
  soilVolumeL: number;
  drainageVolumeL: number;
  bagCount50L: number;
  bagCount20L: number;
  totalWetMassKg: number;
  balconyLoadKgPerM2: number;
  calculationVersion: string;
}

export interface PotCalculationSubmitPayload {
  /** Unique idempotency key to prevent duplicate records upon repeated clicks or retries */
  idempotencyKey: string;
  plantId: string;
  plantName: string;
  shape: PotShape;
  material: LegacyPotMaterial;
  dimensions: PotCalculationDimensions;
  potCount: number;
  sowingMethod: 'nasiona' | 'sadzonka';
  formulaVersion: string;
  resultValues: PotCalculationResultSummary;
  fullResult?: PotCalculationResult;
  timestamp: string;
}

export interface PotCalculationSubmitResponse {
  success: boolean;
  idempotencyKey: string;
  savedAt: string;
  deduplicated?: boolean;
  calculation?: PotCalculationSubmitPayload;
  error?: string;
}

/**
 * Builds a deterministic idempotency key based on calculation configuration and formula version.
 * If identical inputs are submitted repeatedly or on network retries, the idempotency key remains identical.
 */
export function generatePotCalculationIdempotencyKey(params: {
  plantId: string;
  shape: PotShape;
  lengthCm?: number;
  widthCm?: number;
  heightCm: number;
  diameterCm?: number;
  material: LegacyPotMaterial;
  potCount: number;
  sowingMethod: 'nasiona' | 'sadzonka';
  formulaVersion?: string;
}): string {
  const version = params.formulaVersion || POT_CALCULATION_VERSION;
  const dimStr =
    params.shape === 'rectangular'
      ? `L${params.lengthCm || 0}W${params.widthCm || 0}H${params.heightCm || 0}`
      : `D${params.diameterCm || 0}H${params.heightCm || 0}`;

  return `pot_calc_v${version}_${params.plantId}_${params.shape}_${dimStr}_${params.material}_p${params.potCount}_${params.sowingMethod}`;
}
