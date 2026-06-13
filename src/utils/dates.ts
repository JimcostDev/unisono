/**
 * Funciones puras de cálculo de fechas para el generador de calendarios.
 * No depende de ningún framework — solo TypeScript nativo + Date API.
 */

import type { DayOfWeek, QuarterId, ServiceEvent } from '@types/calendar';
import { QUARTERS } from '@types/calendar';

/**
 * Genera un UUID v4 sencillo para identificar eventos.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Devuelve el último día de un mes dado (1‑indexed day).
 */
function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Calcula todas las fechas de un día específico de la semana
 * dentro de un rango [startDate, endDate] inclusive.
 */
function getDayOccurrencesInRange(
  start: Date,
  end: Date,
  dayOfWeek: DayOfWeek,
): Date[] {
  const dates: Date[] = [];

  // Encontrar la primera ocurrencia del día deseado a partir de `start`
  const current = new Date(start);
  const diff = (dayOfWeek - current.getDay() + 7) % 7;
  current.setDate(current.getDate() + diff);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return dates;
}

/**
 * Calcula todas las fechas de servicio para un trimestre, año y día de la semana dados.
 * Retorna un array de ServiceEvent con `assignee` vacío (pendiente de asignación).
 */
export function generateServiceDates(
  year: number,
  quarterId: QuarterId,
  dayOfWeek: DayOfWeek,
): ServiceEvent[] {
  const quarter = QUARTERS.find((q) => q.id === quarterId);
  if (!quarter) {
    throw new Error(`Trimestre inválido: ${quarterId}`);
  }

  const [firstMonth, , lastMonth] = quarter.months;
  const start = new Date(year, firstMonth, 1);
  const end = new Date(year, lastMonth, getLastDayOfMonth(year, lastMonth));

  const dates = getDayOccurrencesInRange(start, end, dayOfWeek);

  return dates.map((date) => ({
    id: generateId(),
    date,
    assignee: '',
    isCustom: false,
  }));
}

/**
 * Agrupa eventos por el índice de mes (0‑11).
 */
export function groupEventsByMonth(
  events: ServiceEvent[],
): Map<number, ServiceEvent[]> {
  const grouped = new Map<number, ServiceEvent[]>();

  for (const event of events) {
    const month = event.date.getMonth();
    const existing = grouped.get(month) ?? [];
    existing.push(event);
    grouped.set(month, existing);
  }

  // Ordenar cada grupo por fecha
  for (const [month, monthEvents] of grouped) {
    grouped.set(
      month,
      monthEvents.sort((a, b) => a.date.getTime() - b.date.getTime()),
    );
  }

  return grouped;
}

/**
 * Formatea una fecha al estilo "Sábado 5" o "Domingo 12".
 */
export function formatDayLabel(date: Date): string {
  const dayNames = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles',
    'Jueves', 'Viernes', 'Sábado',
  ];
  return `${dayNames[date.getDay()]} ${date.getDate()}`;
}

/**
 * Formatea una fecha como "05/07/2026".
 */
export function formatDateShort(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Calcula el número de semana dentro del mes (1‑based).
 */
export function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const firstDayOfWeek = firstDay.getDay();
  return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
}
