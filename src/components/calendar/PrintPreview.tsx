import type { DepartmentConfig, ServiceEvent, TemplateType } from '@types/calendar';
import ListTemplate from './templates/ListTemplate';
import HorizontalTableTemplate from './templates/HorizontalTableTemplate';
import VerticalTableTemplate from './templates/VerticalTableTemplate';

interface PrintPreviewProps {
  config: DepartmentConfig;
  events: ServiceEvent[];
  template: TemplateType;
}

export default function PrintPreview({
  config,
  events,
  template,
}: PrintPreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'list':
        return <ListTemplate config={config} events={events} />;
      case 'table-horizontal':
        return (
          <HorizontalTableTemplate config={config} events={events} />
        );
      case 'table-vertical':
        return (
          <VerticalTableTemplate config={config} events={events} />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Vista previa con marco A4 */}
      <div
        id="print-area"
        className="mx-auto rounded-sm border border-slate-200 bg-white p-10 shadow-sm"
        style={{
          maxWidth: '210mm',
          minHeight: '297mm',
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}
