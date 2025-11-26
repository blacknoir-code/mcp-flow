import { useState, useEffect } from "react";
import { useFlowStore } from "@/stores/flowStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

export const NodeEditorPanel = () => {
  const { nodes, selectedNodeId, updateNode, setSelectedNodeId } = useFlowStore();
  const [localParams, setLocalParams] = useState<Record<string, any>>({});
  const [showSchema, setShowSchema] = useState(false);

  const node = nodes.find((n) => n.id === selectedNodeId);

  useEffect(() => {
    if (node) {
      setLocalParams(node.data.params || {});
    }
  }, [node]);

  if (!node) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-500">Select a node to edit</p>
      </div>
    );
  }

  const handleSave = () => {
    updateNode(node.id, { params: localParams });
  };

  const handleCancel = () => {
    setLocalParams(node.data.params || {});
    setSelectedNodeId(null);
  };

  const handleParamChange = (key: string, value: any) => {
    setLocalParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Edit Node</h3>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <Label className="text-xs font-medium text-gray-700">Title</Label>
          <Input
            value={node.data.title}
            onChange={(e) => updateNode(node.id, { title: e.target.value })}
            className="mt-1"
            disabled
          />
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700">App</Label>
          <Input value={node.data.app} disabled className="mt-1 bg-gray-50" />
        </div>

        {node.data.functionName && (
          <div>
            <Label className="text-xs font-medium text-gray-700">Function</Label>
            <Input value={node.data.functionName} disabled className="mt-1 bg-gray-50" />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-medium text-gray-700">Parameters</Label>
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {showSchema ? "Hide" : "Show"} Schema
            </button>
          </div>

          {showSchema ? (
            <div className="bg-gray-50 rounded p-3">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(node.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(localParams).map(([key, value]) => (
                <div key={key}>
                  <Label className="text-xs font-medium text-gray-700">{key}</Label>
                  {typeof value === "boolean" ? (
                    <select
                      value={String(value)}
                      onChange={(e) =>
                        handleParamChange(key, e.target.value === "true")
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : typeof value === "number" ? (
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleParamChange(key, Number(e.target.value))
                      }
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={String(value)}
                      onChange={(e) => handleParamChange(key, e.target.value)}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex gap-2">
        <Button onClick={handleCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save
        </Button>
      </div>
    </div>
  );
};

