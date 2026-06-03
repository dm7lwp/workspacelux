import { useMemo, useState } from 'react';
import { calculateLightingSavings } from '../../lib/calculators';
import { formatCurrency, formatKwh, formatNumber } from '../../lib/formatters';
import { NumberField, ResultStat } from './CalculatorPrimitives';

const oldPresets = [
  { label: 'Fluorescent troffer (2×4 T8)', watts: 72 },
  { label: 'Fluorescent troffer (2×4 T12)', watts: 96 },
  { label: 'Halogen downlight', watts: 50 },
  { label: 'Metal halide bay', watts: 400 },
];

const newPresets = [
  { label: 'LED panel (2×4 equivalent)', watts: 40 },
  { label: 'LED troffer retrofit', watts: 32 },
  { label: 'LED downlight', watts: 12 },
  { label: 'LED high-bay', watts: 150 },
];

export default function LightingSavingsCalculator() {
  const [fixtureCount, setFixtureCount] = useState('20');
  const [oldWatts, setOldWatts] = useState('72');
  const [newWatts, setNewWatts] = useState('40');
  const [hoursPerDay, setHoursPerDay] = useState('10');
  const [daysPerYear, setDaysPerYear] = useState('260');
  const [costPerKwh, setCostPerKwh] = useState('0.15');

  const result = useMemo(
    () =>
      calculateLightingSavings({
        fixtureCount: parseFloat(fixtureCount),
        oldWattsPerFixture: parseFloat(oldWatts),
        newWattsPerFixture: parseFloat(newWatts),
        hoursPerDay: parseFloat(hoursPerDay),
        daysPerYear: parseFloat(daysPerYear),
        costPerKwh: parseFloat(costPerKwh),
      }),
    [fixtureCount, oldWatts, newWatts, hoursPerDay, daysPerYear, costPerKwh],
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-xl font-semibold text-main">Calculator</h2>

        <NumberField id="fixture-count" label="Number of fixtures" min="1" value={fixtureCount} onChange={(e) => setFixtureCount(e.target.value)} />

        <div>
          <NumberField
            id="old-watts"
            label="Old wattage per fixture (W)"
            min="1"
            value={oldWatts}
            onChange={(e) => setOldWatts(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {oldPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setOldWatts(String(p.watts))}
                className="text-xs px-2 py-1 rounded-lg border border-border bg-white text-muted hover:border-primary hover:text-primary"
              >
                {p.label} ({p.watts} W)
              </button>
            ))}
          </div>
        </div>

        <div>
          <NumberField
            id="new-watts"
            label="New LED wattage per fixture (W)"
            min="1"
            value={newWatts}
            onChange={(e) => setNewWatts(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {newPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setNewWatts(String(p.watts))}
                className="text-xs px-2 py-1 rounded-lg border border-border bg-white text-muted hover:border-primary hover:text-primary"
              >
                {p.label} ({p.watts} W)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField id="hours-day" label="Hours per day" min="0.1" max="24" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} />
          <NumberField id="days-year" label="Days per year" min="1" max="365" value={daysPerYear} onChange={(e) => setDaysPerYear(e.target.value)} />
        </div>

        <NumberField id="cost-kwh" label="Electricity cost ($/kWh)" min="0.01" step="0.01" value={costPerKwh} onChange={(e) => setCostPerKwh(e.target.value)} />
      </div>

      <div className="card p-6 bg-slate-50/80">
        <h2 className="text-xl font-semibold text-main mb-4">Results</h2>

        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ResultStat label="Power reduction" value={`${formatNumber(result.percentSaved, 0)}% (${formatNumber(result.wattsSaved, 0)} W)`} />
              <ResultStat label="Annual energy saved" value={formatKwh(result.annualKwhSaved)} />
              <ResultStat label="Old annual cost" value={formatCurrency(result.annualCostOld)} valueClassName="text-base" />
              <ResultStat label="New annual cost" value={formatCurrency(result.annualCostNew)} valueClassName="text-base" />
            </div>

            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-sm text-muted mb-1">Estimated annual savings</p>
              <p className="text-3xl font-bold text-success">{formatCurrency(result.annualSavings)}</p>
              <p className="text-sm text-muted mt-2">
                Five-year savings: {formatCurrency(result.fiveYearSavings)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-main leading-relaxed text-sm">
                Replacing {fixtureCount} fixtures ({formatNumber(result.totalOldWatts, 0)} W total) with
                LED ({formatNumber(result.totalNewWatts, 0)} W total) saves about{' '}
                {formatKwh(result.annualKwhSaved)} and {formatCurrency(result.annualSavings)} per year at
                ${costPerKwh}/kWh, assuming {hoursPerDay} hours/day for {daysPerYear} days/year.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted">
            Enter valid values with new LED wattage lower than old wattage to see savings.
          </p>
        )}
      </div>
    </div>
  );
}
