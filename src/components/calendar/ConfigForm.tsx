import { useState, useCallback } from 'react';
import type { DepartmentConfig, DayOfWeek, QuarterId } from '@types/calendar';
import { DAY_LABELS, QUARTERS } from '@types/calendar';

interface ConfigFormProps {
  onGenerate: (config: DepartmentConfig) => void;
  initialConfig?: DepartmentConfig | null;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 1 + i);

export default function ConfigForm({ onGenerate, initialConfig }: ConfigFormProps) {
  const [departmentName, setDepartmentName] = useState(initialConfig?.departmentName || '');
  const [year, setYear] = useState(initialConfig?.year || CURRENT_YEAR);
  const [quarterId, setQuarterId] = useState<QuarterId>(initialConfig?.quarterId || 'T3');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialConfig?.dayOfWeek || 6);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!departmentName.trim()) return;
      onGenerate({
        departmentName: departmentName.trim(),
        year,
        quarterId,
        dayOfWeek,
      });
    },
    [departmentName, year, quarterId, dayOfWeek, onGenerate],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre del Departamento */}
      <div className="space-y-2">
        <label
          htmlFor="department-name"
          className="block text-sm font-medium text-slate-700"
        >
          Nombre del Departamento
        </label>
        <input
          id="department-name"
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Ej. Megafonía, Diaconado, Escuela Sabática..."
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          required
        />
      </div>

      {/* Año y Trimestre en fila */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="year-select"
            className="block text-sm font-medium text-slate-700"
          >
            Año
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="quarter-select"
            className="block text-sm font-medium text-slate-700"
          >
            Trimestre
          </label>
          <select
            id="quarter-select"
            value={quarterId}
            onChange={(e) => setQuarterId(e.target.value as QuarterId)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          >
            {QUARTERS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Día de la semana */}
      <div className="space-y-2">
        <label
          htmlFor="day-select"
          className="block text-sm font-medium text-slate-700"
        >
          Día del Servicio
        </label>
        <select
          id="day-select"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value) as DayOfWeek)}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
        >
          {(Object.entries(DAY_LABELS) as [string, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Botón de Generar */}
      <button
        type="submit"
        id="generate-calendar-btn"
        className="w-full cursor-pointer rounded-lg bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-slate-700 hover:shadow-lg active:scale-[0.98]"
      >
        Generar Calendario
      </button>
    </form>
  );
}
