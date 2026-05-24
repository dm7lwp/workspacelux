import { useMemo, useState } from 'react';
import { calculateLumensToWatts } from '../../lib/calculators';
import { formatLumens, formatNumber } from '../../lib/formatters';
import { ledEfficiencyPresets } from '../../data/lightingPresets';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass = 'w-full h-11 px-4 rounded-xl border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

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
        <div><label htmlFor="total-lumens" className={labelClass}>Total lumens</label>
          <input id="total-lumens" type="number" min="1" value={lumens} onChange={(e) => setLumens(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="efficiency" className={labelClass}>LED efficiency</label>
          <select id="efficiency" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} className={inputClass}>
            {ledEfficiencyPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select></div>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted">Total lumens</p><p className="font-semibold text-main text-lg">{formatLumens(result.lumens)}</p></div>
              <div><p className="text-muted">LED efficiency</p><p className="font-semibold text-main text-lg">{result.efficiency} lm/W</p></div>
              <div className="col-span-2"><p className="text-muted">Estimated wattage</p><p className="font-semibold text-main text-2xl">{formatNumber(result.watts, 1)} W ({formatNumber(result.lowerWatts, 1)}–{formatNumber(result.upperWatts, 1)} W)</p></div>
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
