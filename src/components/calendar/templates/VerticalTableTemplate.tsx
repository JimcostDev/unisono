import type { DepartmentConfig, ServiceEvent } from '@types/calendar';
import { MONTH_NAMES, QUARTERS } from '@types/calendar';
import {
  formatDateShort,
  getWeekOfMonth,
  groupEventsByMonth,
} from '@utils/dates';

interface VerticalTableTemplateProps {
  config: DepartmentConfig;
  events: ServiceEvent[];
}

export default function VerticalTableTemplate({
  config,
  events,
}: VerticalTableTemplateProps) {
  const quarter = QUARTERS.find((q) => q.id === config.quarterId);
  const grouped = groupEventsByMonth(events);
  const sortedMonths = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-wide text-slate-800 uppercase">
          {config.departmentName}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          {quarter?.label} — {config.year}
        </p>
        <div className="mx-auto mt-3 h-px w-16 bg-slate-300" />
      </header>

      {/* Tabla vertical */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b-2 border-slate-300 bg-slate-50 px-4 py-3 text-left text-xs font-bold tracking-widest text-slate-600 uppercase">
                Mes
              </th>
              <th className="border-b-2 border-slate-300 bg-slate-50 px-4 py-3 text-center text-xs font-bold tracking-widest text-slate-600 uppercase">
                #
              </th>
              <th className="border-b-2 border-slate-300 bg-slate-50 px-4 py-3 text-left text-xs font-bold tracking-widest text-slate-600 uppercase">
                Fecha
              </th>
              <th className="border-b-2 border-slate-300 bg-slate-50 px-4 py-3 text-left text-xs font-bold tracking-widest text-slate-600 uppercase">
                Persona Asignada
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMonths.map((month) => {
              const monthEvents = grouped.get(month) ?? [];
              return monthEvents.map((event, idx) => (
                <tr
                  key={event.id}
                  className={`border-b border-slate-100 ${
                    idx === 0 ? 'border-t border-slate-200' : ''
                  }`}
                >
                  {/* Mostrar nombre del mes solo en la primera fila */}
                  {idx === 0 ? (
                    <td
                      rowSpan={monthEvents.length}
                      className="border-r border-slate-100 px-4 py-2.5 align-top text-xs font-bold tracking-wider text-slate-500 uppercase"
                    >
                      {MONTH_NAMES[month]}
                    </td>
                  ) : null}
                  <td className="px-4 py-2.5 text-center text-xs font-medium text-slate-400">
                    {getWeekOfMonth(event.date)}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-slate-600">
                    {formatDateShort(event.date)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate-800">
                    {event.assignee || '—'}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Pie */}
      <footer className="border-t border-slate-200 pt-4 text-center">
        <p className="text-xs text-slate-400">
          Iglesia Adventista — {config.departmentName} — {config.year}
        </p>
      </footer>
    </div>
  );
}
