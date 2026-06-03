import { useMemo, useState } from 'react';
import { calculateLumensToLux } from '../../lib/calculators';
import { formatArea, formatLumens, formatLux } from '../../lib/formatters';
import { NumberField, ResultStat, SelectField } from './CalculatorPrimitives';

export default function LumensToLuxCalculator() {
  const [lumens, setLumens] = useState('10000');
  const [area, setArea] = useState('20');
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm');

  const result = useMemo(
    () =>
      calculateLumensToLux({
        lumens: parseFloat(lumens),
        area: parseFloat(area),
        unit,
      }),
    [lumens, area, unit],
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <NumberField id="total-lumens" label="Total lumens" min="1" value={lumens} onChange={(e) => setLumens(e.target.value)} />
        <NumberField id="area" label="Area" min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} />
        <SelectField id="area-unit" label="Area unit" value={unit} onChange={(e) => setUnit(e.target.value as 'sqm' | 'sqft')}>
          <option value="sqm">Square meters (m²)</option>
          <option value="sqft">Square feet (ft²)</option>
        </SelectField>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ResultStat label="Total lumens" value={formatLumens(result.lumens)} />
              <ResultStat label="Area" value={formatArea(result.areaM2)} />
              <ResultStat label="Estimated lux" value={formatLux(result.lux)} valueClassName="text-2xl" wide />
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed">
                {formatLumens(result.lumens)} spread evenly over {formatArea(result.areaM2)} produces
                about {formatLux(result.lux)}.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted">Enter valid values to see results.</p>
        )}
      </div>
    </div>
  );
}
