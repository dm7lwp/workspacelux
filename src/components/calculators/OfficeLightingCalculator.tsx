import { useMemo, useState } from 'react';
import { calculateOfficeLighting } from '../../lib/calculators';
import { formatArea, formatLumens, formatLux, formatNumber } from '../../lib/formatters';
import { workspaceTypes, luxPresets, ledEfficiencyPresets } from '../../data/lightingPresets';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass = 'w-full h-11 px-4 rounded-xl border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

export default function OfficeLightingCalculator() {
  const [length, setLength] = useState('5');
  const [width, setWidth] = useState('5');
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [workspaceType, setWorkspaceType] = useState('general-office');
  const [targetLux, setTargetLux] = useState(500);
  const [ledEfficiency, setLedEfficiency] = useState(100);
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [lightLoss, setLightLoss] = useState('');

  const selectedWorkspace = workspaceTypes.find((w) => w.id === workspaceType)!;

  const result = useMemo(() => calculateOfficeLighting({
    length: parseFloat(length), width: parseFloat(width), unit, targetLux, ledEfficiency,
  }, selectedWorkspace.colorTemp, selectedWorkspace.cri), [length, width, unit, targetLux, ledEfficiency, selectedWorkspace]);

  const handleWorkspaceChange = (id: string) => {
    setWorkspaceType(id);
    const ws = workspaceTypes.find((w) => w.id === id);
    if (ws) setTargetLux(ws.defaultLux);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label htmlFor="room-length" className={labelClass}>Room length</label>
            <input id="room-length" type="number" min="0.1" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="room-width" className={labelClass}>Room width</label>
            <input id="room-width" type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className={inputClass} /></div>
        </div>
        <div><label htmlFor="unit" className={labelClass}>Unit</label>
          <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value as 'meters' | 'feet')} className={inputClass}>
            <option value="meters">Meters</option><option value="feet">Feet</option>
          </select></div>
        <div><label htmlFor="workspace-type" className={labelClass}>Workspace type</label>
          <select id="workspace-type" value={workspaceType} onChange={(e) => handleWorkspaceChange(e.target.value)} className={inputClass}>
            {workspaceTypes.map((ws) => <option key={ws.id} value={ws.id}>{ws.label}</option>)}
          </select></div>
        <div><label htmlFor="target-lux" className={labelClass}>Target brightness</label>
          <select id="target-lux" value={targetLux} onChange={(e) => setTargetLux(Number(e.target.value))} className={inputClass}>
            {luxPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select></div>
        <div><label htmlFor="led-efficiency" className={labelClass}>LED efficiency</label>
          <select id="led-efficiency" value={ledEfficiency} onChange={(e) => setLedEfficiency(Number(e.target.value))} className={inputClass}>
            {ledEfficiencyPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label htmlFor="ceiling-height" className={labelClass}>Ceiling height (optional)</label>
            <input id="ceiling-height" type="text" placeholder="e.g. 2.7 m" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="light-loss" className={labelClass}>Light loss factor (optional)</label>
            <input id="light-loss" type="text" placeholder="e.g. 0.8" value={lightLoss} onChange={(e) => setLightLoss(e.target.value)} className={inputClass} /></div>
        </div>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted">Room area</p><p className="font-semibold text-main text-lg">{formatArea(result.areaM2)}</p></div>
              <div><p className="text-muted">Recommended lux</p><p className="font-semibold text-main text-lg">{formatLux(result.targetLux)}</p></div>
              <div><p className="text-muted">Total lumens needed</p><p className="font-semibold text-main text-lg">{formatLumens(result.totalLumens)}</p></div>
              <div><p className="text-muted">Estimated LED wattage</p><p className="font-semibold text-main text-lg">{formatNumber(result.lowerWatts, 0)}–{formatNumber(result.upperWatts, 0)} W</p></div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed">For a {formatArea(result.areaM2)} {selectedWorkspace.label.toLowerCase()} at {formatLux(result.targetLux)}, you need about {formatLumens(result.totalLumens)}. With standard {ledEfficiency} lm/W LED fixtures, this equals approximately {formatNumber(result.estimatedWatts, 0)} watts of LED lighting ({formatNumber(result.lowerWatts, 0)}–{formatNumber(result.upperWatts, 0)} W range).</p>
            </div>
            <div className="text-sm space-y-2">
              <p className="text-main"><span className="font-medium">Suggested setup:</span> about {result.fixtureCountLow}–{result.fixtureCountHigh} LED panels or linear fixtures.</p>
              <p className="text-main"><span className="font-medium">Recommended color temperature:</span> {result.colorTemp}</p>
              <p className="text-main"><span className="font-medium">Recommended CRI:</span> {result.cri}</p>
            </div>
            <p className="text-xs text-muted leading-relaxed">This is a simplified estimate. Final lighting design may vary based on fixture beam angle, ceiling height, wall reflectance, layout, and local standards.</p>
          </div>
        ) : <p className="text-muted">Enter valid room dimensions to see results.</p>}
      </div>
    </div>
  );
}
