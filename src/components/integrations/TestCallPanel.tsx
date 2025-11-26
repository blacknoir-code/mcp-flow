import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayIcon, DocumentDuplicateIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Integration, availableEndpoints } from "@/data/mockIntegrations";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";

interface TestCallPanelProps {
  integration: Integration;
  onRunTestCall: (endpoint: string, params: Record<string, any>) => Promise<any>;
}

export const TestCallPanel = ({ integration, onRunTestCall }: TestCallPanelProps) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [params, setParams] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const endpoints = availableEndpoints[integration.provider] || [];
  const selectedEndpointDef = endpoints.find((e) => e.name === selectedEndpoint);

  const handleEndpointChange = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    const def = endpoints.find((e) => e.name === endpoint);
    if (def) {
      // Prefill with defaults
      const prefillParams: Record<string, any> = {};
      Object.entries(def.params).forEach(([key, value]) => {
        prefillParams[key] = integration.defaultParams[`default${key.charAt(0).toUpperCase() + key.slice(1)}`] || value;
      });
      setParams(prefillParams);
    }
    setResult(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const response = await onRunTestCall(selectedEndpoint, params);
      setResult(response);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyResponse = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result.response || result, null, 2));
    }
  };

  const handleSaveAsDefault = () => {
    // This would copy params to default params editor
    alert("Params saved as defaults (mock)");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-sm">Test API Call</h3>

      <div className="space-y-3">
        <div>
          <Label>Endpoint</Label>
          <Select value={selectedEndpoint} onValueChange={handleEndpointChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select endpoint..." />
            </SelectTrigger>
            <SelectContent>
              {endpoints.map((endpoint) => (
                <SelectItem key={endpoint.name} value={endpoint.name}>
                  {endpoint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEndpointDef && (
          <div className="space-y-2">
            <Label>Parameters</Label>
            {Object.keys(selectedEndpointDef.params).map((key) => (
              <div key={key}>
                <Label className="text-xs">{key}</Label>
                <Input
                  value={params[key] || ""}
                  onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                  className="mt-1"
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleRun}
          disabled={!selectedEndpoint || isRunning}
          className="w-full bg-gradient-to-r from-primary to-electric-glow"
        >
          <PlayIcon className={clsx("w-4 h-4 mr-2", isRunning && "animate-spin")} />
          {isRunning ? "Running..." : "Run Test Call"}
        </Button>

        {result && (
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={result.success ? "default" : "destructive"}
                  className="text-xs"
                >
                  {result.statusCode}
                </Badge>
                <span className="text-xs text-gray-500">
                  Latency: {result.latency}ms
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCopyResponse} size="sm" variant="outline">
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </Button>
                <Button onClick={handleSaveAsDefault} size="sm" variant="outline">
                  Save as Default
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1">Response</Label>
              <div className="bg-gray-900 rounded-lg p-3 overflow-auto max-h-64">
                <pre className="text-green-400 text-xs">
                  {JSON.stringify(result.response || result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

