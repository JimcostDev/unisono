import { useState, useCallback } from 'react';
import type {
  DepartmentConfig,
  ServiceEvent,
  TemplateType,
} from '@types/calendar';
import { generateServiceDates, generateId } from '@utils/dates';
import ConfigForm from './ConfigForm';
import EventEditor from './EventEditor';
import TemplateSelector from './TemplateSelector';
import PrintPreview from './PrintPreview';

/**
 * Componente orquestador principal de la aplicación.
 * Maneja todo el estado del generador de calendarios.
 */
export default function CalendarGenerator() {
  const [config, setConfig] = useState<DepartmentConfig | null>(null);
  const [events, setEvents] = useState<ServiceEvent[]>([]);
  const [template, setTemplate] = useState<TemplateType>('list');
  const [isGenerated, setIsGenerated] = useState(false);

  /** Genera las fechas del trimestre al enviar el formulario */
  const handleGenerate = useCallback((newConfig: DepartmentConfig) => {
    const generatedEvents = generateServiceDates(
      newConfig.year,
      newConfig.quarterId,
      newConfig.dayOfWeek,
    );
    setConfig(newConfig);
    setEvents((prevEvents) => {
      if (!prevEvents || prevEvents.length === 0) return generatedEvents;

      return generatedEvents.map((newEvent, index) => {
        let oldEvent = prevEvents.find((e) => e.date.getTime() === newEvent.date.getTime());
        if (!oldEvent) {
          oldEvent = prevEvents[index];
        }
        return {
          ...newEvent,
          assignee: oldEvent?.assignee || '',
        };
      });
    });
    setIsGenerated(true);
  }, []);

  /** Actualiza el nombre asignado a un evento */
  const handleUpdateEvent = useCallback(
    (id: string, assignee: string) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, assignee } : e)),
      );
    },
    [],
  );

  /** Elimina un evento custom */
  const handleRemoveEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  /** Actualiza la fecha de un evento (útil para fechas especiales) */
  const handleUpdateEventDate = useCallback((id: string, date: Date) => {
    setEvents((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, date } : e))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    );
  }, []);

  /** Añade una fecha especial/custom */
  const handleAddCustomEvent = useCallback((date: Date) => {
    const newEvent: ServiceEvent = {
      id: generateId(),
      date,
      assignee: '',
      isCustom: true,
    };
    setEvents((prev) =>
      [...prev, newEvent].sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      ),
    );
  }, []);

  /** Dispara la impresión del navegador */
  const handlePrint = useCallback(() => {
    if (config) {
      const originalTitle = document.title;
      const sanitizedDept = config.departmentName
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
        .replace(/[^A-Z0-9]/g, '_')     // Reemplazar espacios y otros por _
        .replace(/_+/g, '_');           // Evitar múltiples guiones bajos

      const trimesterStr = config.quarterId.replace('T', '') + 'TR';

      document.title = `CALENDARIO_${trimesterStr}_${sanitizedDept}`;
      window.print();
      document.title = originalTitle;
    } else {
      window.print();
    }
  }, [config]);

  /** Reiniciar todo */
  const handleReset = useCallback(() => {
    setConfig(null);
    setEvents([]);
    setIsGenerated(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md print:hidden sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 shadow-sm sm:h-9 sm:w-9">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">Unísono</h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Generador Dinámico de Calendarios
              </p>
            </div>
          </div>

          {isGenerated && (
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
              >
                Nuevo
              </button>
              <button
                type="button"
                onClick={handlePrint}
                id="print-btn"
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-700 hover:shadow active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Imprimir / PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ─── CONTENIDO PRINCIPAL ─── */}
      {!isGenerated ? (
        /* ─── VISTA FORMULARIO ─── */
        <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-16 print:hidden">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-slate-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Configurar Calendario
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Define el departamento, trimestre y día de servicio para generar
              automáticamente las fechas del calendario.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ConfigForm onGenerate={handleGenerate} initialConfig={config} />
          </div>
        </main>
      ) : (
        /* ─── VISTA EDITOR + PREVIEW ─── */
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Panel izquierdo: Editor */}
            <aside className="print:hidden lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                {/* Info del departamento */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {config?.departmentName}
                      </h2>
                      <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {config?.year} — Trimestre {config?.quarterId?.replace('T', '')}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsGenerated(false)}
                      className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-slate-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Editar
                    </button>
                  </div>
                  <EventEditor
                    events={events}
                    onUpdateEvent={handleUpdateEvent}
                    onRemoveEvent={handleRemoveEvent}
                    onAddCustomEvent={handleAddCustomEvent}
                    onUpdateEventDate={handleUpdateEventDate}
                  />
                </div>
              </div>
            </aside>

            {/* Panel derecho: Preview */}
            <section className="lg:col-span-8">
              {/* Controles de plantilla */}
              <div className="mb-6 flex items-center justify-between print:hidden">
                <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                  Vista Previa
                </h3>
                <TemplateSelector
                  selected={template}
                  onChange={setTemplate}
                />
              </div>

              {/* Vista previa del PDF */}
              {config && (
                <PrintPreview
                  config={config}
                  events={events}
                  template={template}
                />
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
