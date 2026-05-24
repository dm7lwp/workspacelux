import { useMemo, useState } from 'react';
import { calculateDeskLighting } from '../../lib/calculators';
import { formatArea, formatLumens, formatLux, formatNumber } from '../../lib/formatters';
import { taskTypes } from '../../data/lightingPresets';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass = 'w-full h-11 px-4 rounded-xl border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

export default function DeskLightingCalculator() {
  const [width, setWidth] = useState('120');
  const [depth, setDepth] = useState('60');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');
  const [taskType, setTaskType] = useState('computer');
  const [ambientLux, setAmbientLux] = useState('200');

  const selectedTask = taskTypes.find((t) => t.id === taskType)!;

  const result = useMemo(() => calculateDeskLighting({
    width: parseFloat(width), depth: parseFloat(depth), unit,
    luxMin: selectedTask.luxMin, luxMax: selectedTask.luxMax,
  }), [width, depth, unit, selectedTask]);

  const unitLabel = unit === 'cm' ? 'cm' : 'in';

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label htmlFor="desk-width" className={labelClass}>Desk width ({unitLabel})</label>
            <input id="desk-width" type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="desk-depth" className={labelClass}>Desk depth ({unitLabel})</label>
            <input id="desk-depth" type="number" min="1" value={depth} onChange={(e) => setDepth(e.target.value)} className={inputClass} /></div>
        </div>
        <div><label htmlFor="desk-unit" className={labelClass}>Unit</label>
          <select id="desk-unit" value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'inches')} className={inputClass}>
            <option value="cm">Centimeters</option><option value="inches">Inches</option>
          </select></div>
        <div><label htmlFor="task-type" className={labelClass}>Task type</label>
          <select id="task-type" value={taskType} onChange={(e) => setTaskType(e.target.value)} className={inputClass}>
            {taskTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select></div>
        <div><label htmlFor="ambient-lux" className={labelClass}>Existing ambient light level (lux, optional)</label>
          <input id="ambient-lux" type="number" min="0" value={ambientLux} onChange={(e) => setAmbientLux(e.target.value)} className={inputClass} /></div>
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted">Desk area</p><p className="font-semibold text-main text-lg">{formatArea(result.areaM2)}</p></div>
              <div><p className="text-muted">Recommended illuminance</p><p className="font-semibold text-main text-lg">{result.luxMin === result.luxMax ? formatLux(result.luxMin) : `${formatLux(result.luxMin)}–${formatLux(result.luxMax)}`}</p></div>
              <div><p className="text-muted">Lumens on desk surface</p><p className="font-semibold text-main text-lg">{formatNumber(Math.round(result.lumensMin))}–{formatNumber(Math.round(result.lumensMax))} lm</p></div>
              <div><p className="text-muted">Suggested lamp lumens</p><p className="font-semibold text-main text-lg">{formatNumber(Math.round(result.lampLumensMin))}–{formatNumber(Math.round(result.lampLumensMax))} lm</p></div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed">For a {width} {unitLabel} × {depth} {unitLabel} desk used for {selectedTask.label.toLowerCase()}, aim for around {result.luxMin === result.luxMax ? formatLux(result.luxMin) : `${formatLux(result.luxMin)}–${formatLux(result.luxMax)}`} on the work surface. A dimmable LED desk lamp or monitor light bar around {formatNumber(Math.round(result.lampLumensMin))}–{formatNumber(Math.round(result.lampLumensMax))} lumens is usually practical.</p>
            </div>
            <div className="text-sm space-y-2">
              <p className="text-main"><span className="font-medium">Recommended color temperature:</span> {selectedTask.colorTemp}</p>
              <p className="text-main"><span className="font-medium">Suggested lamp type:</span> {selectedTask.lampType}</p>
              {parseFloat(ambientLux) > 0 && <p className="text-muted">Existing ambient light of about {ambientLux} lux may reduce how much additional task lighting you need.</p>}
            </div>
            <div className="p-4 rounded-xl border border-dashed border-border bg-white/50">
              <p className="text-sm font-medium text-main mb-1">Recommended lighting options for desk setups</p>
              <p className="text-xs text-muted">Affiliate recommendations coming soon: monitor light bars, adjustable LED desk lamps, dimmable task lamps, and clamp lamps.</p>
            </div>
          </div>
        ) : <p className="text-muted">Enter valid desk dimensions to see results.</p>}
      </div>
    </div>
  );
}
