import { useState } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentTextIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useCardDetails } from "@/hooks/useCardDetails";
// Using simple pre tag for JSON display
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CardSchemaSectionProps {
  node: Node<NodeData>;
}

export const CardSchemaSection = ({ node }: CardSchemaSectionProps) => {
  const { schema } = useCardDetails(node.id);
  const [viewMode, setViewMode] = useState<"friendly" | "raw">("friendly");
  const [showDocs, setShowDocs] = useState(false);

  if (!schema) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No schema available</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">MCP Function Schema</h4>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setViewMode(viewMode === "friendly" ? "raw" : "friendly")}
            size="sm"
            variant="outline"
          >
            <DocumentTextIcon className="w-4 h-4 mr-1" />
            {viewMode === "friendly" ? "View Raw" : "View Friendly"}
          </Button>
          <Button
            onClick={() => setShowDocs(true)}
            size="sm"
            variant="outline"
            aria-label="Open documentation"
          >
            <BookOpenIcon className="w-4 h-4 mr-1" />
            Docs
          </Button>
        </div>
      </div>

      {viewMode === "friendly" ? (
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Function</h5>
            <p className="text-sm text-gray-600 font-mono">{schema.name}</p>
            <p className="text-sm text-gray-500 mt-1">{schema.description}</p>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Inputs</h5>
            <div className="space-y-2">
              {Object.entries(schema.inputs || {}).map(([key, field]: [string, any]) => (
                <div key={key} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{key}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                    {field.required !== false && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  {field.description && (
                    <p className="text-xs text-gray-600 mt-1">{field.description}</p>
                  )}
                  {field.default !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">Default: {String(field.default)}</p>
                  )}
                  {field.enum && (
                    <p className="text-xs text-gray-500 mt-1">
                      Options: {field.enum.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Outputs</h5>
            <div className="space-y-2">
              {Object.entries(schema.outputs || {}).map(([key, field]: [string, any]) => (
                <div key={key} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{key}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                  {field.description && (
                    <p className="text-xs text-gray-600 mt-1">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
            <div>
              <span className="text-xs text-gray-500">Idempotent:</span>
              <Badge variant={schema.idempotent ? "default" : "secondary"} className="ml-2">
                {schema.idempotent ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-gray-500">Rate Limit:</span>
              <span className="ml-2 text-xs font-medium">{schema.rateLimit}</span>
            </div>
          </div>

          {schema.authScopes && schema.authScopes.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Auth Scopes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {schema.authScopes.map((scope: string) => (
                  <Badge key={scope} variant="outline" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <pre className="text-green-400 p-4 text-xs overflow-auto m-0">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </div>
      )}

      {showDocs && (
        <Dialog open={showDocs} onOpenChange={setShowDocs}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Function Documentation</DialogTitle>
              <DialogDescription>{schema.name}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Description</h4>
                <p className="text-sm text-gray-600">{schema.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Usage</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs font-mono">
                  {`// Example usage
const result = await mcp.${schema.name}({
  // parameters
});`}
                </pre>
              </div>
              {schema.idempotent && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> This function is idempotent. Multiple calls with the same
                    parameters will produce the same result.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

