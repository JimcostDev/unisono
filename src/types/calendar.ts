/**
 * Tipos e interfaces para el generador de calendarios de servicio.
 * Todas las estructuras de datos del dominio están centralizadas aquí.
 */

/** Identificador de trimestre */
export type QuarterId = 'T1' | 'T2' | 'T3' | 'T4';

/** Días de la semana con valor numérico ISO (0=Domingo ... 6=Sábado) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Mapeo de nombre legible para cada día de la semana */
export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

/** Nombres de los meses en español */
export const MONTH_NAMES: readonly string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const;

/** Definición de un trimestre: meses que abarca (0‑indexed) */
export interface Quarter {
  id: QuarterId;
  label: string;
  months: readonly [number, number, number]; // 0-indexed (ej. T1 = [0, 1, 2])
}

/** Los cuatro trimestres del año */
export const QUARTERS: readonly Quarter[] = [
  { id: 'T1', label: 'Trimestre 1 — Ene · Feb · Mar', months: [0, 1, 2] },
  { id: 'T2', label: 'Trimestre 2 — Abr · May · Jun', months: [3, 4, 5] },
  { id: 'T3', label: 'Trimestre 3 — Jul · Ago · Sep', months: [6, 7, 8] },
  { id: 'T4', label: 'Trimestre 4 — Oct · Nov · Dic', months: [9, 10, 11] },
] as const;

/** Un evento de servicio individual (una fecha concreta + persona asignada) */
export interface ServiceEvent {
  /** Identificador único del evento */
  id: string;
  /** Fecha del servicio */
  date: Date;
  /** Nombre(s) de la(s) persona(s) asignada(s) */
  assignee: string;
  /** Indica si fue añadido manualmente como fecha especial */
  isCustom: boolean;
}

/** Configuración general del departamento/calendario */
export interface DepartmentConfig {
  /** Nombre del departamento (ej. "Megafonía", "Diaconado") */
  departmentName: string;
  /** Año del calendario */
  year: number;
  /** Trimestre seleccionado */
  quarterId: QuarterId;
  /** Día de la semana para los servicios (por defecto 6 = Sábado) */
  dayOfWeek: DayOfWeek;
}

/** Tipo de plantilla para la vista de impresión */
export type TemplateType = 'list' | 'table-horizontal' | 'table-vertical';

/** Estado completo de la aplicación del generador */
export interface CalendarState {
  config: DepartmentConfig;
  events: ServiceEvent[];
  selectedTemplate: TemplateType;
}

/** Eventos agrupados por mes (clave = índice del mes 0‑11) */
export type EventsByMonth = Map<number, ServiceEvent[]>;
