import { MCPFunction } from "@/data/mockMcpServers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FunctionSchemaViewerProps {
  function: MCPFunction | null;
  onClose: () => void;
}

export const FunctionSchemaViewer = ({
  function: func,
  onClose,
}: FunctionSchemaViewerProps) => {
  if (!func) return null;

  return (
    <Dialog open={!!func} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono">{func.name}</DialogTitle>
          <DialogDescription>Function schema and examples</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-2">
            {func.idempotent && (
              <Badge variant="outline">Idempotent</Badge>
            )}
            <Badge variant={func.cost === "cheap" ? "default" : "secondary"}>
              {func.cost}
            </Badge>
            {func.appType && (
              <Badge variant="outline">{func.appType}</Badge>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Auth Scopes</h4>
            <div className="flex flex-wrap gap-2">
              {func.authScopes.map((scope) => (
                <Badge key={scope} variant="secondary" className="text-xs">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Input Schema</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-green-400 text-xs">
                {JSON.stringify(func.inputsSchema, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Output Schema</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-green-400 text-xs">
                {JSON.stringify(func.outputsSchema, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Example Request</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-blue-400 text-xs">
                {JSON.stringify(func.examples.request, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Example Response</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-green-400 text-xs">
                {JSON.stringify(func.examples.response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

