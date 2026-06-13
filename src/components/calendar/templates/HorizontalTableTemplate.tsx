import type { DepartmentConfig, ServiceEvent } from '@types/calendar';
import { MONTH_NAMES, QUARTERS } from '@types/calendar';
import { groupEventsByMonth } from '@utils/dates';

interface HorizontalTableTemplateProps {
  config: DepartmentConfig;
  events: ServiceEvent[];
}

export default function HorizontalTableTemplate({
  config,
  events,
}: HorizontalTableTemplateProps) {
  const grouped = groupEventsByMonth(events);
  const quarter = QUARTERS.find((q) => q.id === config.quarterId);
  const sortedMonths = Array.from(grouped.keys()).sort((a, b) => a - b);

  // Encontrar el máximo número de filas necesarias
  const maxRows = Math.max(
    ...sortedMonths.map((m) => grouped.get(m)?.length ?? 0),
  );

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

      {/* Tabla horizontal */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {sortedMonths.map((month) => (
                <th
                  key={month}
                  className="border-b-2 border-slate-300 bg-slate-50 px-4 py-3 text-left text-xs font-bold tracking-widest text-slate-600 uppercase"
                >
                  {MONTH_NAMES[month]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }, (_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100">
                {sortedMonths.map((month) => {
                  const monthEvents = grouped.get(month) ?? [];
                  const event = monthEvents[rowIndex];
                  return (
                    <td
                      key={month}
                      className="px-4 py-2.5 align-top text-slate-700"
                    >
                      {event ? (
                        <div>
                          <span className="block text-xs font-semibold text-slate-500">
                            {event.date.getDate()}
                          </span>
                          <span className="text-sm text-slate-800">
                            {event.assignee || '—'}
                          </span>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
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
