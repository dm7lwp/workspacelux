import { useMemo, useState } from 'react';
import { calculateLuxToLumens } from '../../lib/calculators';
import { formatArea, formatLumens, formatLux } from '../../lib/formatters';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass = 'w-full h-11 px-4 rounded-xl border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

export default function LuxToLumensCalculator() {
  const [lux, setLux] = useState('500');
  const [area, setArea] = useState('20');
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm');

  const result = useMemo(() => calculateLuxToLumens({
    lux: parseFloat(lux), area: parseFloat(area), unit,
  }), [lux, area, unit]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <div><label htmlFor="target-lux" className={labelClass}>Target lux</label>
          <input id="target-lux" type="number" min="50" max="2000" value={lux} onChange={(e) => setLux(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="area" className={labelClass}>Area</label>
          <input id="area" type="number" min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="area-unit" className={labelClass}>Area unit</label>
          <select id="area-unit" value={unit} onChange={(e) => setUnit(e.target.value as 'sqm' | 'sqft')} className={inputClass}>
            <option value="sqm">Square meters (m²)</option><option value="sqft">Square feet (ft²)</option>
          </select></div>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted">Area</p><p className="font-semibold text-main text-lg">{formatArea(result.areaM2)}</p></div>
              <div><p className="text-muted">Target lux</p><p className="font-semibold text-main text-lg">{formatLux(result.lux)}</p></div>
              <div className="col-span-2"><p className="text-muted">Total lumens required</p><p className="font-semibold text-main text-2xl">{formatLumens(result.lumens)}</p></div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed">{formatLux(result.lux)} over {formatArea(result.areaM2)} requires about {formatLumens(result.lumens)}.</p>
            </div>
          </div>
        ) : <p className="text-muted">Enter valid values to see results.</p>}
      </div>
    </div>
  );
}
