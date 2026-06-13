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
    setEvents(generatedEvents);
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
    window.print();
  }, []);

  /** Reiniciar todo */
  const handleReset = useCallback(() => {
    setConfig(null);
    setEvents([]);
    setIsGenerated(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── HEADER ─── */}
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
              <h1 className="text-lg font-bold text-slate-800">Unísono</h1>
              <p className="text-xs text-slate-500">
                Generador de Calendarios de Servicio
              </p>
            </div>
          </div>

          {isGenerated && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
              >
                Nuevo
              </button>
              <button
                type="button"
                onClick={handlePrint}
                id="print-btn"
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Imprimir / PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ─── CONTENIDO PRINCIPAL ─── */}
      {!isGenerated ? (
        /* ─── VISTA FORMULARIO ─── */
        <main className="mx-auto max-w-lg px-6 py-16 print:hidden">
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
            <ConfigForm onGenerate={handleGenerate} />
          </div>
        </main>
      ) : (
        /* ─── VISTA EDITOR + PREVIEW ─── */
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Panel izquierdo: Editor */}
            <aside className="print:hidden lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                {/* Info del departamento */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">
                      {config?.departmentName}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {config?.year}
                    </span>
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
