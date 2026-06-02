import { useMemo, useState } from 'react';
import { calculateOfficeLighting } from '../../lib/calculators';
import { formatArea, formatKwh, formatLumens, formatLux, formatNumber } from '../../lib/formatters';
import {
  fixtureTypes,
  ledEfficiencyPresets,
  luxPresets,
  maintenanceFactorPresets,
  officeTaskTypes,
  utilizationFactorPresets,
  workspaceTypes,
} from '../../data/lightingPresets';

const labelClass = 'block text-sm font-medium text-main mb-1.5';
const inputClass =
  'w-full h-11 px-3 rounded-lg border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';
const sectionClass = 'rounded-lg border border-border bg-white p-4';

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getRecommendedLux(workspaceId: string, taskId: string): number {
  const workspace = workspaceTypes.find((w) => w.id === workspaceId) ?? workspaceTypes[0];
  const task = officeTaskTypes.find((t) => t.id === taskId) ?? officeTaskTypes[0];

  if (task.id === 'meetings') return Math.min(workspace.defaultLux, task.recommendedLux);
  if (task.recommendedLux >= 750) return Math.max(workspace.defaultLux, task.recommendedLux);
  if (workspace.id === 'reception') return Math.min(workspace.defaultLux, task.recommendedLux);

  return task.recommendedLux || workspace.defaultLux;
}

export default function OfficeLightingCalculator() {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  const [length, setLength] = useState('5');
  const [width, setWidth] = useState('4');
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [workspaceType, setWorkspaceType] = useState('general-office');
  const [taskType, setTaskType] = useState('general-office-work');
  const [targetLux, setTargetLux] = useState(500);
  const [fixtureType, setFixtureType] = useState('led-panel');
  const [fixtureLumens, setFixtureLumens] = useState(4000);
  const [ledEfficiency, setLedEfficiency] = useState(110);
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [costPerKwh, setCostPerKwh] = useState('0.18');
  const [ceilingHeight, setCeilingHeight] = useState('2.7');
  const [utilizationFactor, setUtilizationFactor] = useState(0.6);
  const [maintenanceFactor, setMaintenanceFactor] = useState(0.8);
  const [copied, setCopied] = useState(false);

  const selectedWorkspace = workspaceTypes.find((w) => w.id === workspaceType) ?? workspaceTypes[0];
  const selectedTask = officeTaskTypes.find((t) => t.id === taskType) ?? officeTaskTypes[0];
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
          utilizationFactor,
          maintenanceFactor,
          recommendedLuxMin: selectedWorkspace.luxRange[0],
          recommendedLuxMax: Math.max(selectedWorkspace.luxRange[1], selectedTask.luxMax),
          screenHeavy: selectedTask.id === 'computer-work' || selectedTask.id === 'video-calls',
        },
        selectedTask.colorTemp || selectedWorkspace.colorTemp,
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
      utilizationFactor,
      maintenanceFactor,
      selectedWorkspace,
      selectedTask,
    ],
  );

  const contractorNotes = result
    ? `Please design lighting for approximately ${formatLux(result.targetLux)} maintained illuminance over the work area. Estimated effective work-plane demand is ${formatLumens(result.effectiveLumens)}, with about ${formatLumens(result.requiredFixtureLumens)} total fixture output after utilization and maintenance assumptions. Use ${result.fixtureCount} ${fixtureCountLabel} at roughly ${formatLumens(fixtureLumens)} each, around ${result.colorTemp}, with good diffusion and glare control for ${selectedTask.label.toLowerCase()}.`
    : '';

  const handleWorkspaceChange = (id: string) => {
    setWorkspaceType(id);
    setTargetLux(getRecommendedLux(id, taskType));
  };

  const handleTaskChange = (id: string) => {
    setTaskType(id);
    setTargetLux(getRecommendedLux(workspaceType, id));
  };

  const handleFixtureChange = (id: string) => {
    setFixtureType(id);
    const fixture = fixtureTypes.find((f) => f.id === id);
    if (fixture) setFixtureLumens(fixture.defaultLumens);
  };

  const copyContractorNotes = async () => {
    if (!contractorNotes || !navigator.clipboard) return;
    await navigator.clipboard.writeText(contractorNotes);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Office Lighting Planner</p>
            <h2 className="text-xl font-semibold text-main mt-1">Create a contractor-ready lighting estimate</h2>
          </div>
          <div className="inline-flex h-11 rounded-lg border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => setMode('basic')}
              className={`rounded-md px-4 text-sm font-medium transition-colors ${
                mode === 'basic' ? 'bg-blue-600 text-white' : 'text-muted hover:text-main'
              }`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setMode('advanced')}
              className={`rounded-md px-4 text-sm font-medium transition-colors ${
                mode === 'advanced' ? 'bg-blue-600 text-white' : 'text-muted hover:text-main'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6">
        <div className="card min-w-0 p-5 sm:p-6 space-y-4">
          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">1</span>
              <h3 className="text-base font-semibold text-main">Space and task</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="workspace-type" className={labelClass}>Space type</label>
                <select id="workspace-type" value={workspaceType} onChange={(e) => handleWorkspaceChange(e.target.value)} className={inputClass}>
                  {workspaceTypes.map((ws) => <option key={ws.id} value={ws.id}>{ws.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="task-type" className={labelClass}>Main task</label>
                <select id="task-type" value={taskType} onChange={(e) => handleTaskChange(e.target.value)} className={inputClass}>
                  {officeTaskTypes.map((task) => <option key={task.id} value={task.id}>{task.label}</option>)}
                </select>
              </div>
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
                <input id="ceiling-height" type="number" min="1.8" step="0.1" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} className={inputClass} />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">
              Recommended target: {formatLux(getRecommendedLux(workspaceType, taskType))}. {selectedTask.warning ?? selectedFixture.description}
            </p>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">2</span>
              <h3 className="text-base font-semibold text-main">Fixtures and energy</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fixture-type" className={labelClass}>Fixture type</label>
                <select id="fixture-type" value={fixtureType} onChange={(e) => handleFixtureChange(e.target.value)} className={inputClass}>
                  {fixtureTypes.map((fixture) => <option key={fixture.id} value={fixture.id}>{fixture.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="hours-per-day" className={labelClass}>Usage hours/day</label>
                <input id="hours-per-day" type="number" min="0.1" max="24" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="days-per-week" className={labelClass}>Days/week</label>
                <input id="days-per-week" type="number" min="1" max="7" step="1" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="cost-per-kwh" className={labelClass}>Electricity price</label>
                <input id="cost-per-kwh" type="number" min="0.01" step="0.01" value={costPerKwh} onChange={(e) => setCostPerKwh(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {mode === 'advanced' && (
            <div className={sectionClass}>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">3</span>
                <h3 className="text-base font-semibold text-main">Advanced assumptions</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target-lux" className={labelClass}>Target lux</label>
                  <select id="target-lux" value={targetLux} onChange={(e) => setTargetLux(Number(e.target.value))} className={inputClass}>
                    {luxPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="fixture-lumens" className={labelClass}>Lumens per fixture</label>
                  <input id="fixture-lumens" type="number" min="100" step="100" value={fixtureLumens} onChange={(e) => setFixtureLumens(Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="led-efficiency" className={labelClass}>LED efficacy</label>
                  <select id="led-efficiency" value={ledEfficiency} onChange={(e) => setLedEfficiency(Number(e.target.value))} className={inputClass}>
                    {ledEfficiencyPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="utilization-factor" className={labelClass}>Utilization factor</label>
                  <select id="utilization-factor" value={utilizationFactor} onChange={(e) => setUtilizationFactor(Number(e.target.value))} className={inputClass}>
                    {utilizationFactorPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="maintenance-factor" className={labelClass}>Maintenance factor</label>
                  <select id="maintenance-factor" value={maintenanceFactor} onChange={(e) => setMaintenanceFactor(Number(e.target.value))} className={inputClass}>
                    {maintenanceFactorPresets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card min-w-0 p-5 sm:p-6 bg-slate-50/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
            <div>
              <p className="text-sm font-medium text-blue-700">Generated plan</p>
              <h2 className="text-xl font-semibold text-main mt-1">Recommended lighting plan</h2>
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
                <ResultMetric label="Target brightness" value={formatLux(result.targetLux)} />
                <ResultMetric label="Work-plane demand" value={formatLumens(result.effectiveLumens)} />
                <ResultMetric label="Fixture output needed" value={formatLumens(result.requiredFixtureLumens)} />
                <ResultMetric label="Suggested fixtures" value={`${result.fixtureCount} ${fixtureCountLabel}`} />
                <ResultMetric label="Estimated LED load" value={`${formatNumber(result.estimatedWatts, 0)} W`} />
              </div>

              <div className="rounded-lg bg-white border border-border p-4">
                <h3 className="text-base font-semibold text-main mb-2">Plan summary</h3>
                <p className="text-main leading-relaxed">
                  For a {formatArea(result.areaM2)} {selectedWorkspace.label.toLowerCase()}, target {formatLux(result.targetLux)} for {selectedTask.label.toLowerCase()}.
                  Plan for about {formatLumens(result.requiredFixtureLumens)} of fixture output after UF {result.utilizationFactor} and MF {result.maintenanceFactor}, using {result.fixtureCount} {fixtureCountLabel}.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white border border-border p-4">
                  <h3 className="text-base font-semibold text-main mb-3">Fixture options</h3>
                  <div className="space-y-3">
                    {result.fixtureOptions.map((option) => (
                      <div key={option.label} className="rounded-lg border border-border bg-slate-50 p-3">
                        <p className="font-medium text-main">{option.count} x {formatLumens(option.fixtureLumens)} {option.label}</p>
                        <p className="text-sm text-muted mt-1">Best for: {option.bestFor}</p>
                      </div>
                    ))}
                  </div>
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
                  <p className="mt-3 text-sm text-muted">Suggested layout: {result.layoutRows} x {result.layoutCols} grid. Keep fixtures evenly spaced and avoid direct glare on screens.</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white border border-border p-4">
                  <h3 className="text-base font-semibold text-main mb-3">Score details</h3>
                  <div className="space-y-2 text-sm">
                    <DetailRow label="Brightness fit" value={`${result.brightnessFit} (${result.scoreDetails.brightnessFit}/100)`} />
                    <DetailRow label="Energy efficiency" value={`${result.energyEfficiency} (${result.scoreDetails.energyEfficiency}/100)`} />
                    <DetailRow label="Fixture practicality" value={`${result.fixturePracticality} (${result.scoreDetails.fixturePracticality}/100)`} />
                    <DetailRow label="Comfort risk" value={`${result.comfortRisk} (${result.scoreDetails.comfortRisk}/100)`} />
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

              <div className="rounded-lg bg-white border border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-base font-semibold text-main">Contractor notes</h3>
                  <button type="button" onClick={copyContractorNotes} className="btn-secondary h-10 px-4 text-sm">
                    {copied ? 'Copied' : 'Copy notes'}
                  </button>
                </div>
                <p className="mt-3 text-sm text-main leading-relaxed">{contractorNotes}</p>
              </div>

              <div className="rounded-lg bg-white border border-border p-4 overflow-x-auto">
                <h3 className="text-base font-semibold text-main mb-3">Compare brightness levels</h3>
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted">
                      <th className="py-2 pr-4 font-medium">Target</th>
                      <th className="py-2 pr-4 font-medium">Fixture output</th>
                      <th className="py-2 pr-4 font-medium">Fixtures</th>
                      <th className="py-2 pr-4 font-medium">Load</th>
                      <th className="py-2 font-medium">Monthly cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.scenarioComparison.map((scenario) => (
                      <tr key={scenario.targetLux} className="border-b border-border last:border-0">
                        <td className="py-2 pr-4 text-main">{formatLux(scenario.targetLux)}</td>
                        <td className="py-2 pr-4 text-main">{formatLumens(scenario.requiredFixtureLumens)}</td>
                        <td className="py-2 pr-4 text-main">{scenario.fixtureCount}</td>
                        <td className="py-2 pr-4 text-main">{formatNumber(scenario.estimatedWatts, 0)} W</td>
                        <td className="py-2 text-main">{formatMoney(scenario.monthlyCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                Estimate confidence: {result.estimateConfidence}. This planning estimate uses room area, target lux, fixture output, efficacy, UF, and MF. Final performance depends on ceiling height{ceilingHeight ? ` (${ceilingHeight} m)` : ''}, beam angle, reflectance, furniture layout, glare control, and local standards.
              </p>
            </div>
          ) : (
            <p className="text-muted">Enter valid room dimensions, fixture output, and energy values to generate a lighting plan.</p>
          )}
        </div>
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-main text-right">{value}</span>
    </div>
  );
}
