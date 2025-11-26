import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Integration } from "@/data/mockIntegrations";
import { clsx } from "clsx";

interface ScopesViewerProps {
  integration: Integration;
  onRequestMoreScopes: () => void;
}

export const ScopesViewer = ({ integration, onRequestMoreScopes }: ScopesViewerProps) => {
  const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set());

  const toggleScope = (scopeName: string) => {
    const newExpanded = new Set(expandedScopes);
    if (newExpanded.has(scopeName)) {
      newExpanded.delete(scopeName);
    } else {
      newExpanded.add(scopeName);
    }
    setExpandedScopes(newExpanded);
  };

  const missingScopes = integration.scopes.filter((s) => !s.granted);
  const grantedScopes = integration.scopes.filter((s) => s.granted);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">OAuth Scopes</h3>
        {missingScopes.length > 0 && (
          <Button onClick={onRequestMoreScopes} size="sm" variant="outline">
            Request More Scopes
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {grantedScopes.map((scope) => (
          <div
            key={scope.name}
            className="p-3 bg-gray-50 rounded border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-sm">{scope.name}</span>
                  <Badge variant="outline" className="text-xs">Granted</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">{scope.description}</p>
                {scope.lastGrantedAt && (
                  <p className="text-xs text-gray-500">
                    Granted: {new Date(scope.lastGrantedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {scope.longDescription && (
                <button
                  onClick={() => toggleScope(scope.name)}
                  className="ml-2 p-1 hover:bg-gray-200 rounded"
                  aria-label="Toggle description"
                >
                  {expandedScopes.has(scope.name) ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            {expandedScopes.has(scope.name) && scope.longDescription && (
              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                {scope.longDescription}
              </div>
            )}
          </div>
        ))}

        {missingScopes.map((scope) => (
          <div
            key={scope.name}
            className="p-3 bg-yellow-50 rounded border border-yellow-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <XCircleIcon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span className="font-medium text-sm">{scope.name}</span>
                  <Badge variant="outline" className="text-xs bg-yellow-100">Missing</Badge>
                </div>
                <p className="text-xs text-gray-600">{scope.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {integration.scopes.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No scopes configured</p>
      )}
    </div>
  );
};

