const SQFT_TO_SQM = 0.092903;
const INCH_TO_CM = 2.54;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePositive(value: number, fieldName: string): ValidationResult {
  if (!Number.isFinite(value) || value <= 0) {
    return { valid: false, error: `${fieldName} must be a number greater than 0.` };
  }
  return { valid: true };
}

export function validateLux(value: number): ValidationResult {
  if (!Number.isFinite(value) || value < 50 || value > 2000) {
    return { valid: false, error: 'Target lux should be between 50 and 2000.' };
  }
  return { valid: true };
}

export function validateEfficiency(value: number): ValidationResult {
  if (!Number.isFinite(value) || value < 50 || value > 250) {
    return { valid: false, error: 'LED efficiency should be between 50 and 250 lm/W.' };
  }
  return { valid: true };
}

export function feetToMeters(value: number): number {
  return value * 0.3048;
}

export function sqftToSqm(value: number): number {
  return value * SQFT_TO_SQM;
}

export function inchesToCm(value: number): number {
  return value * INCH_TO_CM;
}

export function cmToMeters(value: number): number {
  return value / 100;
}

export function inchesToMeters(value: number): number {
  return (value * INCH_TO_CM) / 100;
}

export interface OfficeLightingInput {
  length: number;
  width: number;
  unit: 'meters' | 'feet';
  targetLux: number;
  ledEfficiency: number;
}

export interface OfficeLightingResult {
  areaM2: number;
  targetLux: number;
  totalLumens: number;
  estimatedWatts: number;
  lowerWatts: number;
  upperWatts: number;
  fixtureCountLow: number;
  fixtureCountHigh: number;
  colorTemp: string;
  cri: string;
}

export function calculateOfficeLighting(
  input: OfficeLightingInput,
  colorTemp = '4000K',
  cri = '80+',
): OfficeLightingResult | null {
  const lengthVal = validatePositive(input.length, 'Length');
  const widthVal = validatePositive(input.width, 'Width');
  const luxVal = validateLux(input.targetLux);
  const effVal = validateEfficiency(input.ledEfficiency);

  if (!lengthVal.valid || !widthVal.valid || !luxVal.valid || !effVal.valid) {
    return null;
  }

  const lengthM =
    input.unit === 'meters' ? input.length : feetToMeters(input.length);
  const widthM = input.unit === 'meters' ? input.width : feetToMeters(input.width);
  const areaM2 = lengthM * widthM;
  const totalLumens = input.targetLux * areaM2;
  const estimatedWatts = totalLumens / input.ledEfficiency;

  return {
    areaM2,
    targetLux: input.targetLux,
    totalLumens,
    estimatedWatts,
    lowerWatts: estimatedWatts * 0.85,
    upperWatts: estimatedWatts * 1.15,
    fixtureCountLow: Math.ceil(totalLumens / 4000),
    fixtureCountHigh: Math.ceil(totalLumens / 3000),
    colorTemp,
    cri,
  };
}

export interface DeskLightingInput {
  width: number;
  depth: number;
  unit: 'cm' | 'inches';
  luxMin: number;
  luxMax: number;
}

export interface DeskLightingResult {
  areaM2: number;
  luxMin: number;
  luxMax: number;
  lumensMin: number;
  lumensMax: number;
  lampLumensMin: number;
  lampLumensMax: number;
}

export function calculateDeskLighting(input: DeskLightingInput): DeskLightingResult | null {
  const widthVal = validatePositive(input.width, 'Desk width');
  const depthVal = validatePositive(input.depth, 'Desk depth');

  if (!widthVal.valid || !depthVal.valid) {
    return null;
  }

  const widthM =
    input.unit === 'cm' ? cmToMeters(input.width) : inchesToMeters(input.width);
  const depthM =
    input.unit === 'cm' ? cmToMeters(input.depth) : inchesToMeters(input.depth);
  const areaM2 = widthM * depthM;

  const lumensMin = input.luxMin * areaM2;
  const lumensMax = input.luxMax * areaM2;

  return {
    areaM2,
    luxMin: input.luxMin,
    luxMax: input.luxMax,
    lumensMin,
    lumensMax,
    lampLumensMin: lumensMin * 1.5,
    lampLumensMax: lumensMax * 1.5,
  };
}

export interface LuxToLumensInput {
  lux: number;
  area: number;
  unit: 'sqm' | 'sqft';
}

export interface LuxToLumensResult {
  areaM2: number;
  lux: number;
  lumens: number;
}

export interface LumensToLuxInput {
  lumens: number;
  area: number;
  unit: 'sqm' | 'sqft';
}

export interface LumensToLuxResult {
  areaM2: number;
  lumens: number;
  lux: number;
}

export function calculateLumensToLux(input: LumensToLuxInput): LumensToLuxResult | null {
  const areaVal = validatePositive(input.area, 'Area');
  const lumensVal = validatePositive(input.lumens, 'Lumens');

  if (!areaVal.valid || !lumensVal.valid) {
    return null;
  }

  const areaM2 = input.unit === 'sqm' ? input.area : sqftToSqm(input.area);
  const lux = input.lumens / areaM2;

  return { areaM2, lumens: input.lumens, lux };
}

export function calculateLuxToLumens(input: LuxToLumensInput): LuxToLumensResult | null {
  const areaVal = validatePositive(input.area, 'Area');
  const luxVal = validateLux(input.lux);

  if (!areaVal.valid || !luxVal.valid) {
    return null;
  }

  const areaM2 = input.unit === 'sqm' ? input.area : sqftToSqm(input.area);
  const lumens = input.lux * areaM2;

  return { areaM2, lux: input.lux, lumens };
}

export interface LumensToWattsInput {
  lumens: number;
  efficiency: number;
}

export interface LumensToWattsResult {
  lumens: number;
  efficiency: number;
  watts: number;
  lowerWatts: number;
  upperWatts: number;
}

export function calculateLumensToWatts(
  input: LumensToWattsInput,
): LumensToWattsResult | null {
  const lumensVal = validatePositive(input.lumens, 'Lumens');
  const effVal = validateEfficiency(input.efficiency);

  if (!lumensVal.valid || !effVal.valid) {
    return null;
  }

  const watts = input.lumens / input.efficiency;

  return {
    lumens: input.lumens,
    efficiency: input.efficiency,
    watts,
    lowerWatts: watts * 0.9,
    upperWatts: watts * 1.1,
  };
}

export function luxLumensTableRows(): { area: number; lux300: number; lux500: number; lux750: number }[] {
  return [10, 20, 50].map((area) => ({
    area,
    lux300: area * 300,
    lux500: area * 500,
    lux750: area * 750,
  }));
}

export interface LightingSavingsInput {
  fixtureCount: number;
  oldWattsPerFixture: number;
  newWattsPerFixture: number;
  hoursPerDay: number;
  daysPerYear: number;
  costPerKwh: number;
}

export interface LightingSavingsResult {
  totalOldWatts: number;
  totalNewWatts: number;
  wattsSaved: number;
  percentSaved: number;
  annualKwhOld: number;
  annualKwhNew: number;
  annualKwhSaved: number;
  annualCostOld: number;
  annualCostNew: number;
  annualSavings: number;
  fiveYearSavings: number;
}

export function calculateLightingSavings(
  input: LightingSavingsInput,
): LightingSavingsResult | null {
  const fixtureVal = validatePositive(input.fixtureCount, 'Fixture count');
  const oldVal = validatePositive(input.oldWattsPerFixture, 'Old wattage');
  const newVal = validatePositive(input.newWattsPerFixture, 'New wattage');
  const hoursVal = validatePositive(input.hoursPerDay, 'Hours per day');
  const daysVal = validatePositive(input.daysPerYear, 'Days per year');
  const costVal = validatePositive(input.costPerKwh, 'Cost per kWh');

  if (!fixtureVal.valid || !oldVal.valid || !newVal.valid || !hoursVal.valid || !daysVal.valid || !costVal.valid) {
    return null;
  }

  if (input.hoursPerDay > 24) return null;

  const totalOldWatts = input.fixtureCount * input.oldWattsPerFixture;
  const totalNewWatts = input.fixtureCount * input.newWattsPerFixture;
  const wattsSaved = totalOldWatts - totalNewWatts;

  if (wattsSaved <= 0) return null;

  const annualKwhOld = (totalOldWatts * input.hoursPerDay * input.daysPerYear) / 1000;
  const annualKwhNew = (totalNewWatts * input.hoursPerDay * input.daysPerYear) / 1000;
  const annualKwhSaved = annualKwhOld - annualKwhNew;
  const percentSaved = (wattsSaved / totalOldWatts) * 100;

  const annualCostOld = annualKwhOld * input.costPerKwh;
  const annualCostNew = annualKwhNew * input.costPerKwh;
  const annualSavings = annualCostOld - annualCostNew;

  return {
    totalOldWatts,
    totalNewWatts,
    wattsSaved,
    percentSaved,
    annualKwhOld,
    annualKwhNew,
    annualKwhSaved,
    annualCostOld,
    annualCostNew,
    annualSavings,
    fiveYearSavings: annualSavings * 5,
  };
}
