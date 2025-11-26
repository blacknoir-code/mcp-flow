import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useMcpStore } from "@/stores/mcpStore";

interface MCPHeaderProps {
  onDiscover: () => void;
  onAddServer: () => void;
  healthFilter: string;
  onHealthFilterChange: (filter: string) => void;
}

export const MCPHeader = ({ onDiscover, onAddServer, healthFilter, onHealthFilterChange }: MCPHeaderProps) => {
  const { servers } = useMcpStore();

  const serverList = Object.values(servers);
  const healthyCount = serverList.filter((s) => s.health === "healthy").length;
  const degradedCount = serverList.filter((s) => s.health === "degraded").length;
  const downCount = serverList.filter((s) => s.health === "down").length;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MCP Server Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor MCP servers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onDiscover} size="sm" variant="outline">
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            Discover Servers
          </Button>
          <Button onClick={onAddServer} size="sm" className="bg-gradient-to-r from-primary to-electric-glow">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Server
          </Button>
          <Button size="sm" variant="ghost" aria-label="Help">
            <QuestionMarkCircleIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <Select value={healthFilter} onValueChange={onHealthFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({serverList.length})</SelectItem>
              <SelectItem value="healthy">Healthy ({healthyCount})</SelectItem>
              <SelectItem value="degraded">Degraded ({degradedCount})</SelectItem>
              <SelectItem value="down">Down ({downCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">Healthy: {healthyCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-600">Degraded: {degradedCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-600">Down: {downCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

