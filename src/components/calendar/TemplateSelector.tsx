import type { TemplateType } from '@types/calendar';

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

const TEMPLATES: { value: TemplateType; label: string; icon: string }[] = [
  { value: 'list', label: 'Lista', icon: '☰' },
  { value: 'table-horizontal', label: 'Tabla Horizontal', icon: '▤' },
  { value: 'table-vertical', label: 'Tabla Vertical', icon: '▥' },
];

export default function TemplateSelector({
  selected,
  onChange,
}: TemplateSelectorProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
      {TEMPLATES.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 ${
            selected === t.value
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="text-sm">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
