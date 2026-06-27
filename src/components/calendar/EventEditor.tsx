import { useCallback } from 'react';
import type { ServiceEvent } from '@types/calendar';
import { MONTH_NAMES } from '@types/calendar';
import { formatDayLabel, groupEventsByMonth, generateId } from '@utils/dates';

interface EventEditorProps {
  events: ServiceEvent[];
  onUpdateEvent: (id: string, assignee: string) => void;
  onRemoveEvent: (id: string) => void;
  onAddCustomEvent: (date: Date) => void;
  onUpdateEventDate: (id: string, date: Date) => void;
}

export default function EventEditor({
  events,
  onUpdateEvent,
  onRemoveEvent,
  onAddCustomEvent,
  onUpdateEventDate,
}: EventEditorProps) {
  const grouped = groupEventsByMonth(events);
  const sortedMonths = Array.from(grouped.keys()).sort((a, b) => a - b);

  const handleAddCustom = useCallback(
    (month: number) => {
      const year = events[0]?.date.getFullYear() ?? new Date().getFullYear();
      // Añade en el día 15 del mes como placeholder — el usuario puede editar la fecha en la misma lista
      const date = new Date(year, month, 15);
      onAddCustomEvent(date);
    },
    [events, onAddCustomEvent],
  );

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Asignación de Personal
        </h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {events.length} fecha{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {sortedMonths.map((month) => {
        const monthEvents = grouped.get(month) ?? [];
        return (
          <div key={month} className="space-y-3">
            <h4 className="border-b border-slate-100 pb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              {MONTH_NAMES[month]}
            </h4>

            <div className="space-y-2">
              {monthEvents.map((event) => (
                <div
                  key={event.id}
                  className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200 ${
                    event.isCustom
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  {/* Indicador visual del día */}
                  <div className="flex w-24 shrink-0 items-center gap-2 sm:min-w-[120px]">
                    {event.isCustom && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    )}
                    <span className="truncate text-sm font-medium text-slate-600">
                      {formatDayLabel(event.date)}
                    </span>
                  </div>

                  {/* Input de asignación */}
                  <input
                    type="text"
                    value={event.assignee}
                    onChange={(e) => onUpdateEvent(event.id, e.target.value)}
                    placeholder="Nombre..."
                    className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm text-slate-900 placeholder-slate-300 focus:ring-0 focus:outline-none"
                  />

                  {/* Controles (solo custom) */}
                  {event.isCustom && (
                    <div className="flex shrink-0 items-center gap-1 transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100">
                      {/* Botón cambiar fecha */}
                      <div className="relative flex cursor-pointer items-center justify-center rounded p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600">
                        <input
                          type="date"
                          title="Cambiar fecha"
                          value={`${event.date.getFullYear()}-${String(event.date.getMonth() + 1).padStart(2, '0')}-${String(event.date.getDate()).padStart(2, '0')}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const [y, m, d] = val.split('-');
                              onUpdateEventDate(
                                event.id,
                                new Date(Number(y), Number(m) - 1, Number(d)),
                              );
                            }
                          }}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => onRemoveEvent(event.id)}
                        className="cursor-pointer rounded p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
                        aria-label="Eliminar fecha"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Añadir fecha extra */}
            <button
              type="button"
              onClick={() => handleAddCustom(month)}
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Añadir fecha especial
            </button>
          </div>
        );
      })}
    </div>
  );
}
