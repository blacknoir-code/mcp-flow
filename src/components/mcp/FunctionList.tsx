import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/outline";
import { MCPFunction } from "@/data/mockMcpServers";
import { clsx } from "clsx";

interface FunctionListProps {
  functions: MCPFunction[];
  onViewSchema: (func: MCPFunction) => void;
  onTestFunction: (func: MCPFunction) => void;
}

export const FunctionList = ({
  functions,
  onViewSchema,
  onTestFunction,
}: FunctionListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appFilter, setAppFilter] = useState<string>("all");
  const [idempotencyFilter, setIdempotencyFilter] = useState<string>("all");
  const [costFilter, setCostFilter] = useState<string>("all");

  const filteredFunctions = useMemo(() => {
    let filtered = functions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.authScopes.some((s) => s.toLowerCase().includes(query)) ||
          JSON.stringify(f.inputsSchema).toLowerCase().includes(query) ||
          JSON.stringify(f.outputsSchema).toLowerCase().includes(query)
      );
    }

    if (appFilter !== "all") {
      filtered = filtered.filter((f) => f.appType === appFilter);
    }

    if (idempotencyFilter !== "all") {
      filtered = filtered.filter((f) =>
        idempotencyFilter === "true" ? f.idempotent : !f.idempotent
      );
    }

    if (costFilter !== "all") {
      filtered = filtered.filter((f) => f.cost === costFilter);
    }

    return filtered;
  }, [functions, searchQuery, appFilter, idempotencyFilter, costFilter]);

  const appTypes = Array.from(new Set(functions.map((f) => f.appType).filter(Boolean)));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Functions ({filteredFunctions.length})</h3>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Apps</SelectItem>
            {appTypes.map((app) => (
              <SelectItem key={app} value={app}>
                {app}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={idempotencyFilter} onValueChange={setIdempotencyFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Idempotent</SelectItem>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
        <Select value={costFilter} onValueChange={setCostFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cost</SelectItem>
            <SelectItem value="cheap">Cheap</SelectItem>
            <SelectItem value="expensive">Expensive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredFunctions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No functions found</p>
        ) : (
          filteredFunctions.map((func) => (
            <div
              key={func.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm font-mono">{func.name}</h4>
                    {func.idempotent && (
                      <Badge variant="outline" className="text-xs">
                        Idempotent
                      </Badge>
                    )}
                    <Badge
                      variant={func.cost === "cheap" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {func.cost}
                    </Badge>
                  </div>
                  {func.appType && (
                    <Badge variant="outline" className="text-xs mr-1">
                      {func.appType}
                    </Badge>
                  )}
                  {func.authScopes.map((scope) => (
                    <Badge key={scope} variant="secondary" className="text-xs mr-1">
                      {scope.split(".").pop()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-2">
                {Object.keys(func.inputsSchema.properties || {}).length} inputs →{" "}
                {Object.keys(func.outputsSchema.properties || {}).length} outputs
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onViewSchema(func)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View Schema
                </Button>
                <Button
                  onClick={() => onTestFunction(func)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Test Function
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

