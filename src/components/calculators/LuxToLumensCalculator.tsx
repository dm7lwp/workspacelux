import { useMemo, useState } from 'react';
import { calculateLuxToLumens } from '../../lib/calculators';
import { formatArea, formatLumens, formatLux } from '../../lib/formatters';
import { NumberField, ResultStat, SelectField } from './CalculatorPrimitives';

export default function LuxToLumensCalculator() {
  const [lux, setLux] = useState('500');
  const [area, setArea] = useState('20');
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm');

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    const luxNum = parseFloat(lux);
    const areaNum = parseFloat(area);

    if (isNaN(luxNum) || luxNum < 50 || luxNum > 2000) errs.lux = 'Target lux must be between 50 and 2000';
    if (isNaN(areaNum) || areaNum <= 0) errs.area = 'Area must be greater than 0';
    return errs;
  }, [lux, area]);

  const result = useMemo(() => calculateLuxToLumens({
    lux: parseFloat(lux), area: parseFloat(area), unit,
  }), [lux, area, unit]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <NumberField id="target-lux" label="Target lux" min="50" max="2000" value={lux} onChange={(e) => setLux(e.target.value)} error={errors.lux} />
        <NumberField id="area" label="Area" min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} error={errors.area} />
        <SelectField id="area-unit" label="Area unit" value={unit} onChange={(e) => setUnit(e.target.value as 'sqm' | 'sqft')}>
          <option value="sqm">Square meters (m²)</option><option value="sqft">Square feet (ft²)</option>
        </SelectField>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ResultStat label="Area" value={formatArea(result.areaM2, unit)} />
              <ResultStat label="Target lux" value={formatLux(result.lux)} />
              <ResultStat label="Total lumens required" value={formatLumens(result.lumens)} valueClassName="text-2xl" wide />
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed">{formatLux(result.lux)} over {formatArea(result.areaM2, unit)} requires about {formatLumens(result.lumens)}.</p>
            </div>
          </div>
        ) : (
          <p className="text-muted">
            {Object.keys(errors).length > 0
              ? 'Please correct the input errors on the left to see results.'
              : 'Enter valid values to see results.'}
          </p>
        )}
      </div>
    </div>
  );
}
