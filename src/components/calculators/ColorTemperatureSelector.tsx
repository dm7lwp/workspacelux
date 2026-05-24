import { useState } from 'react';
import { colorTempSpaces, colorTempScale } from '../../data/lightingPresets';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass = 'w-full h-11 px-4 rounded-xl border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

export default function ColorTemperatureSelector() {
  const [spaceId, setSpaceId] = useState('corporate-office');
  const selected = colorTempSpaces.find((s) => s.id === spaceId)!;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Choose your space</h2>
        <div><label htmlFor="space-type" className={labelClass}>Space type</label>
          <select id="space-type" value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className={inputClass}>
            {colorTempSpaces.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select></div>
      </div>
      <div className="card p-6 bg-slate-50/80 space-y-4">
        <h2 className="text-xl font-semibold text-main">Recommendation</h2>
        <div className="p-4 rounded-xl bg-white border border-border">
          <p className="text-sm text-muted mb-1">Recommended color temperature</p>
          <p className="text-3xl font-bold text-primary">{selected.range}</p>
        </div>
        <div className="text-sm space-y-3">
          <p className="text-main"><span className="font-medium">Why it works:</span> {selected.why}</p>
          <p className="text-main"><span className="font-medium">What to avoid:</span> {selected.avoid}</p>
          <p className="text-main"><span className="font-medium">Best for:</span> {selected.useCase}</p>
        </div>
      </div>
      <div className="lg:col-span-2 card p-6">
        <h3 className="text-lg font-semibold text-main mb-4">Color temperature scale</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {colorTempScale.map((item) => (
            <div key={item.kelvin} className="p-4 rounded-xl border border-border bg-white text-center">
              <p className="font-bold text-main">{item.kelvin}</p>
              <p className="text-sm text-muted mt-1">{item.label}</p>
              <p className="text-xs text-muted mt-2">{item.feel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
