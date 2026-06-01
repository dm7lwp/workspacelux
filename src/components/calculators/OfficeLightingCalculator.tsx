import { useMemo, useState } from 'react';
import { calculateOfficeLighting } from '../../lib/calculators';
import { formatArea, formatKwh, formatLumens, formatLux, formatNumber } from '../../lib/formatters';
import {
  fixtureTypes,
  ledEfficiencyPresets,
  luxPresets,
  workspaceTypes,
} from '../../data/lightingPresets';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass = 'w-full h-11 px-3 rounded-lg border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';
const sectionClass = 'rounded-lg border border-border bg-white p-4';

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function OfficeLightingCalculator() {
  const [length, setLength] = useState('5');
  const [width, setWidth] = useState('5');
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [workspaceType, setWorkspaceType] = useState('general-office');
  const [targetLux, setTargetLux] = useState(500);
  const [fixtureType, setFixtureType] = useState('led-panel');
  const [fixtureLumens, setFixtureLumens] = useState(4000);
  const [ledEfficiency, setLedEfficiency] = useState(100);
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [costPerKwh, setCostPerKwh] = useState('0.18');
  const [ceilingHeight, setCeilingHeight] = useState('');

  const selectedWorkspace = workspaceTypes.find((w) => w.id === workspaceType) ?? workspaceTypes[0];
  const selectedFixture = fixtureTypes.find((f) => f.id === fixtureType) ?? fixtureTypes[0];
  const fixtureLabel = selectedFixture.label.toLowerCase();
  const fixtureCountLabel = fixtureType === 'mixed' ? 'mixed fixture groups' : `${fixtureLabel} fixtures`;

  const result = useMemo(
    () =>
      calculateOfficeLighting(
        {
          length: parseFloat(length),
          width: parseFloat(width),
          unit,
          targetLux,
          ledEfficiency,
          fixtureLumens,
          hoursPerDay: parseFloat(hoursPerDay),
          daysPerWeek: parseFloat(daysPerWeek),
          costPerKwh: parseFloat(costPerKwh),
        },
        selectedWorkspace.colorTemp,
        selectedWorkspace.cri,
      ),
    [
      length,
      width,
      unit,
      targetLux,
      ledEfficiency,
      fixtureLumens,
      hoursPerDay,
      daysPerWeek,
      costPerKwh,
      selectedWorkspace,
    ],
  );

  const handleWorkspaceChange = (id: string) => {
    setWorkspaceType(id);
    const workspace = workspaceTypes.find((w) => w.id === id);
    if (workspace) setTargetLux(workspace.defaultLux);
  };

  const handleFixtureChange = (id: string) => {
    setFixtureType(id);
    const fixture = fixtureTypes.find((f) => f.id === id);
    if (fixture) setFixtureLumens(fixture.defaultLumens);
  };

  return (
    <div className="grid xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6">
      <div className="card p-5 sm:p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-blue-700">Build your lighting plan</p>
          <h2 className="text-xl font-semibold text-main mt-1">Plan setup</h2>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">1</span>
            <h3 className="text-base font-semibold text-main">Measure space</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="room-length" className={labelClass}>Room length</label>
              <input id="room-length" type="number" min="0.1" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="room-width" className={labelClass}>Room width</label>
              <input id="room-width" type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="unit" className={labelClass}>Unit</label>
              <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value as 'meters' | 'feet')} className={inputClass}>
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
              </select>
            </div>
            <div>
              <label htmlFor="ceiling-height" className={labelClass}>Ceiling height</label>
              <input id="ceiling-height" type="text" placeholder="Optional, e.g. 2.7 m" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">2</span>
            <h3 className="text-base font-semibold text-main">Set brightness</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="workspace-type" className={labelClass}>Workspace type</label>
              <select id="workspace-type" value={workspaceType} onChange={(e) => handleWorkspaceChange(e.target.value)} className={inputClass}>
                {workspaceTypes.map((ws) => <option key={ws.id} value={ws.id}>{ws.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="target-lux" className={labelClass}>Target brightness</label>
              <select id="target-lux" value={targetLux} onChange={(e) => setTargetLux(Number(e.target.value))} className={inputClass}>
                {luxPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">3</span>
            <h3 className="text-base font-semibold text-main">Choose fixtures</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fixture-type" className={labelClass}>Main fixture type</label>
              <select id="fixture-type" value={fixtureType} onChange={(e) => handleFixtureChange(e.target.value)} className={inputClass}>
                {fixtureTypes.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="fixture-lumens" className={labelClass}>Lumens per fixture</label>
              <input id="fixture-lumens" type="number" min="100" step="100" value={fixtureLumens} onChange={(e) => setFixtureLumens(Number(e.target.value))} className={inputClass} />
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">{selectedFixture.description}</p>
        </div>

        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">4</span>
            <h3 className="text-base font-semibold text-main">Estimate energy</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="led-efficiency" className={labelClass}>LED efficiency</label>
              <select id="led-efficiency" value={ledEfficiency} onChange={(e) => setLedEfficiency(Number(e.target.value))} className={inputClass}>
                {ledEfficiencyPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="hours-per-day" className={labelClass}>Hours per day</label>
              <input id="hours-per-day" type="number" min="0.1" max="24" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="days-per-week" className={labelClass}>Days per week</label>
              <input id="days-per-week" type="number" min="1" max="7" step="1" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cost-per-kwh" className={labelClass}>Electricity price</label>
              <input id="cost-per-kwh" type="number" min="0.01" step="0.01" value={costPerKwh} onChange={(e) => setCostPerKwh(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6 bg-slate-50/80">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-blue-700">Generated plan</p>
            <h2 className="text-xl font-semibold text-main mt-1">Lighting plan preview</h2>
          </div>
          {result && (
            <div className="rounded-lg bg-white border border-border px-4 py-3">
              <p className="text-xs text-muted">WorkspaceLux score</p>
              <p className="text-2xl font-bold text-main">{result.lightingScore}<span className="text-sm font-semibold text-muted"> / 100</span></p>
            </div>
          )}
        </div>

        {result ? (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-3">
              <ResultMetric label="Room area" value={formatArea(result.areaM2)} />
              <ResultMetric label="Target lux" value={formatLux(result.targetLux)} />
              <ResultMetric label="Total lumens" value={formatLumens(result.totalLumens)} />
              <ResultMetric label="LED load" value={`${formatNumber(result.lowerWatts, 0)}-${formatNumber(result.upperWatts, 0)} W`} />
              <ResultMetric label="Fixture count" value={`${result.fixtureCount} ${fixtureCountLabel}`} />
              <ResultMetric label="Suggested layout" value={`${result.layoutRows} x ${result.layoutCols} grid`} />
            </div>

            <div className="rounded-lg bg-white border border-border p-4">
              <h3 className="text-base font-semibold text-main mb-2">Plan summary</h3>
              <p className="text-main leading-relaxed">
                For a {formatArea(result.areaM2)} {selectedWorkspace.label.toLowerCase()}, aim for about {formatLumens(result.totalLumens)} at {formatLux(result.targetLux)}.
                Use {result.fixtureCount} {fixtureCountLabel} at roughly {formatLumens(fixtureLumens)} each, then add task or accent lighting where the room needs more focus or visual depth.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-lg bg-white border border-border p-4">
                <h3 className="text-base font-semibold text-main mb-3">Lighting mix</h3>
                <MixBar label="Ambient" value={selectedWorkspace.lightingMix.ambient} tone="bg-blue-600" />
                <MixBar label="Task" value={selectedWorkspace.lightingMix.task} tone="bg-emerald-600" />
                <MixBar label="Accent" value={selectedWorkspace.lightingMix.accent} tone="bg-amber-500" />
                <p className="mt-3 text-sm text-muted">Ambient covers the room, task lighting supports desks, and accent lighting handles walls, reception details, or brand areas.</p>
              </div>

              <div className="rounded-lg bg-white border border-border p-4">
                <h3 className="text-base font-semibold text-main mb-3">Fixture layout</h3>
                <div
                  className="grid gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 aspect-[4/3]"
                  style={{ gridTemplateColumns: `repeat(${result.layoutCols}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: result.layoutRows * result.layoutCols }).map((_, index) => (
                    <div key={index} className="flex items-center justify-center">
                      {index < result.fixtureCount ? (
                        <span className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-100 shadow-sm" aria-label="Fixture" />
                      ) : (
                        <span className="h-8 w-8" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted">Distribute fixtures evenly across the ceiling and keep spacing consistent near walls and primary desks.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-lg bg-white border border-border p-4">
                <h3 className="text-base font-semibold text-main mb-3">Score details</h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label="Brightness fit" value={result.brightnessFit} />
                  <DetailRow label="Energy efficiency" value={result.energyEfficiency} />
                  <DetailRow label="Color temperature" value={result.colorTemp} />
                  <DetailRow label="Color quality" value={`CRI ${result.cri}`} />
                </div>
              </div>

              <div className="rounded-lg bg-white border border-border p-4">
                <h3 className="text-base font-semibold text-main mb-3">Energy cost</h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label="Estimated load" value={`${formatNumber(result.estimatedWatts, 0)} W`} />
                  <DetailRow label="Monthly energy" value={formatKwh(result.monthlyKwh)} />
                  <DetailRow label="Monthly cost" value={formatMoney(result.monthlyCost)} />
                  <DetailRow label="Annual cost" value={formatMoney(result.annualCost)} />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              This is a planning estimate. Final fixture choice should account for beam angle, ceiling height{ceilingHeight ? ` (${ceilingHeight})` : ''}, glare control, wall reflectance, furniture layout, and local standards.
            </p>
          </div>
        ) : (
          <p className="text-muted">Enter valid room dimensions, fixture output, and energy values to generate a lighting plan.</p>
        )}
      </div>
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white border border-border p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-main">{value}</p>
    </div>
  );
}

function MixBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-medium text-main">{label}</span>
        <span className="text-muted">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-main text-right">{value}</span>
    </div>
  );
}
