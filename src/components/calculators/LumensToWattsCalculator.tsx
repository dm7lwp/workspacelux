import { useMemo, useState } from 'react';
import { calculateLumensToWatts } from '../../lib/calculators';
import { formatLumens, formatNumber } from '../../lib/formatters';
import { ledEfficiencyPresets } from '../../data/lightingPresets';
import { NumberField, ResultStat, SelectField } from './CalculatorPrimitives';

export default function LumensToWattsCalculator() {
  const [lumens, setLumens] = useState('10000');
  const [efficiency, setEfficiency] = useState(100);

  const result = useMemo(() => calculateLumensToWatts({
    lumens: parseFloat(lumens), efficiency,
  }), [lumens, efficiency]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <NumberField id="total-lumens" label="Total lumens" min="1" value={lumens} onChange={(e) => setLumens(e.target.value)} />
        <SelectField id="efficiency" label="LED efficiency" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))}>
          {ledEfficiencyPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </SelectField>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ResultStat label="Total lumens" value={formatLumens(result.lumens)} />
              <ResultStat label="LED efficiency" value={`${result.efficiency} lm/W`} />
              <ResultStat label="Estimated wattage" value={`${formatNumber(result.watts, 1)} W (${formatNumber(result.lowerWatts, 1)}–${formatNumber(result.upperWatts, 1)} W)`} valueClassName="text-2xl" wide />
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed">{formatLumens(result.lumens)} at {result.efficiency} lm/W requires about {formatNumber(result.watts, 0)} watts of LED lighting.</p>
            </div>
          </div>
        ) : <p className="text-muted">Enter valid values to see results.</p>}
      </div>
    </div>
  );
}
