export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatArea(value: number, unit: 'meters' | 'feet' | 'cm' | 'inches' | 'sqm' | 'sqft' = 'meters'): string {
  if (unit === 'feet' || unit === 'sqft') {
    const sqft = value * 10.76391;
    return `${formatNumber(sqft, 1)} sq ft`;
  }
  if (unit === 'inches') {
    const sqin = value * 1550.0031;
    return `${formatNumber(sqin, 0)} sq in`;
  }
  if (unit === 'cm') {
    const sqcm = value * 10000;
    return `${formatNumber(sqcm, 0)} cm²`;
  }
  return `${formatNumber(value, 1)} m²`;
}

export function formatLumens(value: number): string {
  return `${formatNumber(Math.round(value))} lm`;
}

export function formatWatts(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} W`;
}

export function formatLux(value: number): string {
  return `${formatNumber(value)} lux`;
}

export function formatRange(min: number, max: number, formatter: (v: number) => string): string {
  return `${formatter(min)}–${formatter(max)}`;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatKwh(value: number): string {
  return `${formatNumber(value, 0)} kWh`;
}
