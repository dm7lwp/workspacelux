import { useMemo, useState } from 'react';
import { calculateDeskLighting } from '../../lib/calculators';
import { formatArea, formatLumens, formatLux, formatNumber } from '../../lib/formatters';
import { taskTypes } from '../../data/lightingPresets';
import { NumberField, ResultStat, SelectField } from './CalculatorPrimitives';

export default function DeskLightingCalculator() {
  const [width, setWidth] = useState('120');
  const [depth, setDepth] = useState('60');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');
  const [taskType, setTaskType] = useState('computer');
  const [ambientLux, setAmbientLux] = useState('200');

  const selectedTask = taskTypes.find((t) => t.id === taskType)!;

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    const widthNum = parseFloat(width);
    const depthNum = parseFloat(depth);
    const ambientNum = parseFloat(ambientLux);

    if (isNaN(widthNum) || widthNum <= 0) errs.width = 'Width must be greater than 0';
    if (isNaN(depthNum) || depthNum <= 0) errs.depth = 'Depth must be greater than 0';
    if (ambientLux && (isNaN(ambientNum) || ambientNum < 0)) errs.ambientLux = 'Ambient light must be 0 or greater';
    return errs;
  }, [width, depth, ambientLux]);

  const result = useMemo(() => calculateDeskLighting({
    width: parseFloat(width), depth: parseFloat(depth), unit,
    luxMin: selectedTask.luxMin, luxMax: selectedTask.luxMax,
    ambientLux: parseFloat(ambientLux) || 0,
  }), [width, depth, unit, selectedTask, ambientLux]);

  const unitLabel = unit === 'cm' ? 'cm' : 'in';

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>
        <div className="grid grid-cols-2 gap-4">
          <NumberField id="desk-width" label={`Desk width (${unitLabel})`} min="1" value={width} onChange={(e) => setWidth(e.target.value)} error={errors.width} />
          <NumberField id="desk-depth" label={`Desk depth (${unitLabel})`} min="1" value={depth} onChange={(e) => setDepth(e.target.value)} error={errors.depth} />
        </div>
        <SelectField id="desk-unit" label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'inches')}>
          <option value="cm">Centimeters</option><option value="inches">Inches</option>
        </SelectField>
        <SelectField id="task-type" label="Task type" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          {taskTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </SelectField>
        <NumberField id="ambient-lux" label="Existing ambient light level (lux, optional)" min="0" value={ambientLux} onChange={(e) => setAmbientLux(e.target.value)} error={errors.ambientLux} />
      </div>
      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ResultStat label="Desk area" value={formatArea(result.areaM2, unit)} />
              <ResultStat label="Recommended illuminance" value={result.luxMin === result.luxMax ? formatLux(result.luxMin) : `${formatLux(result.luxMin)}–${formatLux(result.luxMax)}`} />
              <ResultStat label="Lumens on desk surface" value={`${formatNumber(Math.round(result.lumensMin))}–${formatNumber(Math.round(result.lumensMax))} lm`} />
              <ResultStat label="Suggested lamp lumens" value={`${formatNumber(Math.round(result.lampLumensMin))}–${formatNumber(Math.round(result.lampLumensMax))} lm`} />
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
        ) : (
          <p className="text-muted">
            {Object.keys(errors).length > 0
              ? 'Please correct the input errors on the left to see results.'
              : 'Enter valid desk dimensions to see results.'}
          </p>
        )}
      </div>
    </div>
  );
}
