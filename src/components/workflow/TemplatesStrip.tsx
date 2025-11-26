import { useFlowStore } from "@/stores/flowStore";
import { sampleTemplates } from "@/data/sampleTemplates";
import { Button } from "@/components/ui/button";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export const TemplatesStrip = () => {
  const { templates, loadTemplate } = useFlowStore();
  const allTemplates = [...sampleTemplates, ...templates];

  if (allTemplates.length === 0) return null;

  return (
    <div className="h-32 border-b border-gray-200 bg-gray-50 p-4 overflow-x-auto">
      <div className="flex items-center gap-2 mb-2">
        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-500">TEMPLATES</span>
      </div>
      <div className="flex gap-2">
        {allTemplates.map((template) => (
          <div
            key={template.id}
            className="min-w-[200px] bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => loadTemplate(template.id)}
          >
            <h4 className="font-semibold text-sm text-gray-900 mb-1">{template.name}</h4>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{template.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{template.category}</span>
              <Button size="sm" variant="ghost" className="h-6 text-xs">
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

