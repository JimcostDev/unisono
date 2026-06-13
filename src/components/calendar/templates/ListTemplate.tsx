import type { DepartmentConfig, ServiceEvent } from '@types/calendar';
import { MONTH_NAMES, QUARTERS } from '@types/calendar';
import { formatDayLabel, groupEventsByMonth } from '@utils/dates';

interface ListTemplateProps {
  config: DepartmentConfig;
  events: ServiceEvent[];
}

export default function ListTemplate({ config, events }: ListTemplateProps) {
  const grouped = groupEventsByMonth(events);
  const quarter = QUARTERS.find((q) => q.id === config.quarterId);
  const sortedMonths = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* Encabezado del documento */}
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-wide text-slate-800 uppercase">
          {config.departmentName}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          {quarter?.label} — {config.year}
        </p>
        <div className="mx-auto mt-3 h-px w-16 bg-slate-300" />
      </header>

      {/* Contenido por meses */}
      <div className="space-y-6">
        {sortedMonths.map((month) => {
          const monthEvents = grouped.get(month) ?? [];
          return (
            <section key={month}>
              <h2 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold tracking-widest text-slate-600 uppercase">
                {MONTH_NAMES[month]}
              </h2>
              <ul className="space-y-1.5 pl-1">
                {monthEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-baseline gap-2 text-sm text-slate-700"
                  >
                    <span className="inline-block h-1 w-1 flex-shrink-0 translate-y-[-2px] rounded-full bg-slate-400" />
                    <span className="font-medium">
                      {formatDayLabel(event.date)}:
                    </span>
                    <span className="text-slate-600">
                      {event.assignee || '—'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Pie del documento */}
      <footer className="border-t border-slate-200 pt-4 text-center">
        <p className="text-xs text-slate-400">
          Iglesia Adventista  — {config.departmentName} — {config.year}
        </p>
      </footer>
    </div>
  );
}
