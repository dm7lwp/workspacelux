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
  fixtureLumens: number;
  hoursPerDay: number;
  daysPerWeek: number;
  costPerKwh: number;
  utilizationFactor?: number;
  maintenanceFactor?: number;
  recommendedLuxMin?: number;
  recommendedLuxMax?: number;
  screenHeavy?: boolean;
  ceilingHeight: number;
  isAdvancedMode?: boolean;
}

export interface FixtureOption {
  label: string;
  fixtureLumens: number;
  count: number;
  bestFor: string;
}

export interface ScenarioComparison {
  targetLux: number;
  effectiveLumens: number;
  requiredFixtureLumens: number;
  fixtureCount: number;
  estimatedWatts: number;
  monthlyCost: number;
}

export interface OfficeLightingResult {
  areaM2: number;
  targetLux: number;
  totalLumens: number;
  effectiveLumens: number;
  requiredFixtureLumens: number;
  utilizationFactor: number;
  maintenanceFactor: number;
  estimatedWatts: number;
  lowerWatts: number;
  upperWatts: number;
  fixtureCountLow: number;
  fixtureCountHigh: number;
  fixtureCount: number;
  layoutRows: number;
  layoutCols: number;
  monthlyKwh: number;
  monthlyCost: number;
  annualCost: number;
  lightingScore: number;
  scoreDetails: {
    brightnessFit: number;
    energyEfficiency: number;
    fixturePracticality: number;
    comfortRisk: number;
  };
  brightnessFit: 'Underlit' | 'Comfortable' | 'Bright' | 'Very bright';
  energyEfficiency: 'Basic' | 'Good' | 'Excellent';
  fixturePracticality: 'Practical' | 'Many fixtures' | 'Uneven risk';
  comfortRisk: 'Low' | 'Medium' | 'High';
  estimateConfidence: 'Medium' | 'High';
  fixtureOptions: FixtureOption[];
  scenarioComparison: ScenarioComparison[];
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
  const ceilingVal = validatePositive(input.ceilingHeight, 'Ceiling height');
  const luxVal = validateLux(input.targetLux);
  const effVal = validateEfficiency(input.ledEfficiency);
  const fixtureVal = validatePositive(input.fixtureLumens, 'Fixture lumens');
  const hoursVal = validatePositive(input.hoursPerDay, 'Hours per day');
  const daysVal = validatePositive(input.daysPerWeek, 'Days per week');
  const costVal = validatePositive(input.costPerKwh, 'Cost per kWh');

  // Estimate Utilization Factor dynamically in basic mode using RCR (Room Cavity Ratio)
  let utilizationFactor = input.utilizationFactor ?? 0.6;
  if (!input.isAdvancedMode) {
    const workplaneHeight = input.unit === 'meters' ? 0.75 : 2.5;
    const hCavity = Math.max(0.5, input.ceilingHeight - workplaneHeight);
    // RCR = 5 * hCavity * (L + W) / (L * W)
    const rcr = (5 * hCavity * (input.length + input.width)) / (input.length * input.width);
    // UF = 0.78 - 0.05 * RCR, clamped between 0.35 and 0.75
    utilizationFactor = Math.max(0.35, Math.min(0.75, 0.78 - 0.05 * rcr));
  }

  const maintenanceFactor = input.maintenanceFactor ?? 0.8;

  const utilizationVal = validatePositive(utilizationFactor, 'Utilization factor');
  const maintenanceVal = validatePositive(maintenanceFactor, 'Maintenance factor');

  if (
    !lengthVal.valid ||
    !widthVal.valid ||
    !ceilingVal.valid ||
    !luxVal.valid ||
    !effVal.valid ||
    !fixtureVal.valid ||
    !hoursVal.valid ||
    !daysVal.valid ||
    !costVal.valid ||
    !utilizationVal.valid ||
    !maintenanceVal.valid ||
    input.hoursPerDay > 24 ||
    input.daysPerWeek > 7 ||
    utilizationFactor > 1 ||
    maintenanceFactor > 1
  ) {
    return null;
  }

  const lengthM =
    input.unit === 'meters' ? input.length : feetToMeters(input.length);
  const widthM = input.unit === 'meters' ? input.width : feetToMeters(input.width);
  const areaM2 = lengthM * widthM;
  const effectiveLumens = input.targetLux * areaM2;
  const lossFactor = utilizationFactor * maintenanceFactor;
  const requiredFixtureLumens = effectiveLumens / lossFactor;
  const estimatedWatts = requiredFixtureLumens / input.ledEfficiency;
  const fixtureCount = Math.max(1, Math.ceil(requiredFixtureLumens / input.fixtureLumens));
  const layoutCols = Math.ceil(Math.sqrt(fixtureCount));
  const layoutRows = Math.ceil(fixtureCount / layoutCols);
  const monthlyKwh = (estimatedWatts * input.hoursPerDay * input.daysPerWeek * 4.345) / 1000;
  const monthlyCost = monthlyKwh * input.costPerKwh;
  const annualCost = monthlyCost * 12;
  const brightnessFit =
    input.targetLux < 350 ? 'Underlit' : input.targetLux < 700 ? 'Comfortable' : input.targetLux < 1000 ? 'Bright' : 'Very bright';
  const energyEfficiency =
    input.ledEfficiency >= 130 ? 'Excellent' : input.ledEfficiency >= 100 ? 'Good' : 'Basic';
  const recommendedLuxMin = input.recommendedLuxMin ?? 300;
  const recommendedLuxMax = input.recommendedLuxMax ?? 750;
  const brightnessScore =
    input.targetLux >= recommendedLuxMin && input.targetLux <= recommendedLuxMax
      ? 95
      : Math.max(40, 95 - (Math.min(Math.abs(input.targetLux - recommendedLuxMin), Math.abs(input.targetLux - recommendedLuxMax)) / 10));
  const efficiencyScore =
    input.ledEfficiency >= 130 ? 95 : input.ledEfficiency >= 100 ? 82 : input.ledEfficiency >= 80 ? 65 : 45;
  const fixturePracticalityScore =
    fixtureCount >= 2 && fixtureCount <= 8 ? 92 : fixtureCount <= 15 ? 75 : fixtureCount === 1 && areaM2 > 16 ? 62 : 55;
  const comfortRiskScore =
    input.targetLux > 750 || input.screenHeavy ? (input.targetLux > 1000 ? 45 : 70) : 92;
  const score = Math.round(
    brightnessScore * 0.35 +
      efficiencyScore * 0.25 +
      fixturePracticalityScore * 0.2 +
      comfortRiskScore * 0.2,
  );
  const fixturePracticality =
    fixtureCount === 1 && areaM2 > 16 ? 'Uneven risk' : fixtureCount > 12 ? 'Many fixtures' : 'Practical';
  const comfortRisk = input.targetLux > 1000 ? 'High' : input.targetLux > 750 || input.screenHeavy ? 'Medium' : 'Low';
  const fixtureOptions = [
    { label: 'LED panels', fixtureLumens: 4000, bestFor: 'even ceiling lighting' },
    { label: 'Downlights', fixtureLumens: 3000, bestFor: 'flexible smaller-fixture layouts' },
    { label: 'Linear fixtures', fixtureLumens: 6000, bestFor: 'open offices or long rooms' },
  ].map((option) => ({
    ...option,
    count: Math.max(1, Math.ceil(requiredFixtureLumens / option.fixtureLumens)),
  }));
  const scenarioComparison = [300, 500, 750].map((targetLux) => {
    const scenarioEffectiveLumens = targetLux * areaM2;
    const scenarioFixtureLumens = scenarioEffectiveLumens / lossFactor;
    const scenarioWatts = scenarioFixtureLumens / input.ledEfficiency;

    return {
      targetLux,
      effectiveLumens: scenarioEffectiveLumens,
      requiredFixtureLumens: scenarioFixtureLumens,
      fixtureCount: Math.max(1, Math.ceil(scenarioFixtureLumens / input.fixtureLumens)),
      estimatedWatts: scenarioWatts,
      monthlyCost: ((scenarioWatts * input.hoursPerDay * input.daysPerWeek * 4.345) / 1000) * input.costPerKwh,
    };
  });

  return {
    areaM2,
    targetLux: input.targetLux,
    totalLumens: requiredFixtureLumens,
    effectiveLumens,
    requiredFixtureLumens,
    utilizationFactor,
    maintenanceFactor,
    estimatedWatts,
    lowerWatts: estimatedWatts * 0.85,
    upperWatts: estimatedWatts * 1.15,
    fixtureCountLow: Math.ceil(requiredFixtureLumens / 4000),
    fixtureCountHigh: Math.ceil(requiredFixtureLumens / 3000),
    fixtureCount,
    layoutRows,
    layoutCols,
    monthlyKwh,
    monthlyCost,
    annualCost,
    lightingScore: Math.max(45, Math.min(96, score)),
    scoreDetails: {
      brightnessFit: Math.round(brightnessScore),
      energyEfficiency: efficiencyScore,
      fixturePracticality: fixturePracticalityScore,
      comfortRisk: comfortRiskScore,
    },
    brightnessFit,
    energyEfficiency,
    fixturePracticality,
    comfortRisk,
    estimateConfidence: lossFactor < 1 ? 'High' : 'Medium',
    fixtureOptions,
    scenarioComparison,
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
  ambientLux?: number;
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

  const ambient = input.ambientLux || 0;
  const netLuxMin = Math.max(0, input.luxMin - ambient);
  const netLuxMax = Math.max(0, input.luxMax - ambient);

  const lumensMin = netLuxMin * areaM2;
  const lumensMax = netLuxMax * areaM2;

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
