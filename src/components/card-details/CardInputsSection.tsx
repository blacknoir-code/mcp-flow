import { useState, useEffect } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon, ArrowPathIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useCardDetails } from "@/hooks/useCardDetails";
import { useFlowStore } from "@/stores/flowStore";
// Using simple pre tag for JSON display - can be enhanced with syntax highlighter later

interface CardInputsSectionProps {
  node: Node<NodeData>;
}

export const CardInputsSection = ({ node }: CardInputsSectionProps) => {
  const { schema, suggestDefaults } = useCardDetails(node.id);
  const { updateNode } = useFlowStore();
  const [params, setParams] = useState(node.data.params || {});
  const [showJson, setShowJson] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setParams(node.data.params || {});
    setHasChanges(false);
  }, [node.id, node.data.params]);

  const handleChange = (key: string, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateNode(node.id, { params });
    setHasChanges(false);
  };

  const handleReset = () => {
    setParams(node.data.params || {});
    setHasChanges(false);
  };

  const handleSuggestDefaults = () => {
    const defaults = suggestDefaults(node);
    setParams((prev) => ({ ...defaults, ...prev }));
    setHasChanges(true);
  };

  const renderField = (key: string, field: any) => {
    const value = params[key] ?? field.default ?? "";
    const isRequired = field.required !== false;
    const hasError = isRequired && !value;

    switch (field.type) {
      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className={hasError ? "text-red-600" : ""}>
              {key} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={(checked) => handleChange(key, checked)}
            />
          </div>
        );

      case "number":
        return (
          <div key={key}>
            <Label htmlFor={key} className={hasError ? "text-red-600" : ""}>
              {key} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              type="number"
              value={value}
              onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
              className={hasError ? "border-red-500" : ""}
            />
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        );

      case "string":
        if (field.enum) {
          return (
            <div key={key}>
              <Label htmlFor={key} className={hasError ? "text-red-600" : ""}>
                {key} {isRequired && <span className="text-red-500">*</span>}
              </Label>
              <Select value={value} onValueChange={(val) => handleChange(key, val)}>
                <SelectTrigger className={hasError ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.enum.map((opt: string) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.description && (
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              )}
            </div>
          );
        }
        return (
          <div key={key}>
            <Label htmlFor={key} className={hasError ? "text-red-600" : ""}>
              {key} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            {field.description?.includes("multi") || key.includes("message") ? (
              <Textarea
                id={key}
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className={hasError ? "border-red-500" : ""}
                rows={3}
              />
            ) : (
              <Input
                id={key}
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className={hasError ? "border-red-500" : ""}
              />
            )}
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={key}>
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        );
    }
  };

  if (showJson) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm">Input JSON</h4>
          <Button
            onClick={() => setShowJson(false)}
            size="sm"
            variant="ghost"
          >
            View Form
          </Button>
        </div>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
          {JSON.stringify(params, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm">Inputs</h4>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSuggestDefaults}
            size="sm"
            variant="outline"
            aria-label="Suggest defaults"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Suggest Defaults
          </Button>
          <Button
            onClick={() => setShowJson(true)}
            size="sm"
            variant="ghost"
            aria-label="View JSON"
          >
            <DocumentTextIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {schema?.inputs
          ? Object.entries(schema.inputs).map(([key, field]: [string, any]) =>
              renderField(key, field)
            )
          : Object.entries(params).map(([key, value]) => (
              <div key={key}>
                <Label>{key}</Label>
                <Input
                  value={String(value)}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
          <Button onClick={handleSave} size="sm" className="flex-1">
            <CheckIcon className="w-4 h-4 mr-1" />
            Save Changes
          </Button>
          <Button onClick={handleReset} size="sm" variant="outline">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

