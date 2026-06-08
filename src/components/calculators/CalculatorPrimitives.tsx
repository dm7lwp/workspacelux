import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

export const calculatorInputClass =
  'w-full h-11 px-4 rounded-xl border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

export const compactCalculatorInputClass =
  'w-full h-11 px-3 rounded-lg border border-border bg-white text-main focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600';

const labelClass = 'block text-sm font-medium text-main mb-1.5';

interface FieldShellProps {
  children: ReactNode;
  htmlFor: string;
  label: string;
}

function FieldShell({ children, htmlFor, label }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface NumberFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function NumberField({ className = calculatorInputClass, id, label, type = 'number', error, ...props }: NumberFieldProps) {
  const errorClass = error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : '';
  return (
    <FieldShell htmlFor={id} label={label}>
      <input id={id} type={type} className={`${className} ${errorClass}`.trim()} {...props} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  id: string;
  label: string;
}

export function SelectField({ children, className = calculatorInputClass, id, label, ...props }: SelectFieldProps) {
  return (
    <FieldShell htmlFor={id} label={label}>
      <select id={id} className={className} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}

interface ResultStatProps {
  className?: string;
  label: string;
  value: ReactNode;
  valueClassName?: string;
  wide?: boolean;
}

export function ResultStat({ className = '', label, value, valueClassName = 'text-lg', wide = false }: ResultStatProps) {
  return (
    <div className={`${wide ? 'col-span-2' : ''} ${className}`.trim()}>
      <p className="text-muted">{label}</p>
      <p className={`font-semibold text-main ${valueClassName}`}>{value}</p>
    </div>
  );
}
