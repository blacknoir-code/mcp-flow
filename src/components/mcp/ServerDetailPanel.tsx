import { useState } from "react";
import { MCPServer } from "@/data/mockMcpServers";
import { ServerHealthCard } from "./ServerHealthCard";
import { FunctionList } from "./FunctionList";
import { FunctionSchemaViewer } from "./FunctionSchemaViewer";
import { ServerLogsViewer } from "./ServerLogsViewer";
import { ServerControls } from "./ServerControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DocumentDuplicateIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useMcpStore } from "@/stores/mcpStore";
import { MCPFunction } from "@/data/mockMcpServers";
import dayjs from "dayjs";
import { clsx } from "clsx";

interface ServerDetailPanelProps {
  server: MCPServer;
}

const healthColors = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  maintenance: "bg-purple-500",
  restarting: "bg-blue-500",
};

const healthLabels = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
  maintenance: "Maintenance",
  restarting: "Restarting",
};

export const ServerDetailPanel = ({ server }: ServerDetailPanelProps) => {
  const {
    runHealthCheck,
    reloadFunctions,
    restartServer,
    toggleMaintenance,
    toggleDisabled,
    runTestFunction,
    clearLogs,
    downloadLogs,
    setServerMetadata,
  } = useMcpStore();

  const [selectedFunction, setSelectedFunction] = useState<MCPFunction | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      await runHealthCheck(server.id);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleTestFunction = async (func: MCPFunction) => {
    const result = await runTestFunction(server.id, func.name, func.examples.request);
    setTestResult(result);
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(server.endpoint);
  };

  const handleForceHeartbeat = () => {
    setServerMetadata(server.id, {
      lastHeartbeat: new Date().toISOString(),
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {server.settings.alias || server.name}
              </h2>
              <div
                className={clsx("w-3 h-3 rounded-full", healthColors[server.health])}
                aria-label={healthLabels[server.health]}
              />
              <Badge
                className={clsx(
                  "text-xs",
                  server.health === "healthy" && "bg-green-100 text-green-700",
                  server.health === "degraded" && "bg-yellow-100 text-yellow-700",
                  server.health === "down" && "bg-red-100 text-red-700",
                  server.health === "maintenance" && "bg-purple-100 text-purple-700",
                  server.health === "restarting" && "bg-blue-100 text-blue-700"
                )}
              >
                {healthLabels[server.health]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">Region:</span>
                <Badge variant="outline">{server.region}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Version:</span>
                <span>{server.version}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Instance:</span>
                <span className="font-mono text-xs">{server.instanceId}</span>
              </div>
              <div className="flex items-center gap-1">
                <HeartIcon className="w-4 h-4" />
                <span>{dayjs(server.lastHeartbeat).fromNow()}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleCopyEndpoint} size="sm" variant="outline">
            <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
            Copy Endpoint
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ServerHealthCard
              server={server}
              onForceHealthCheck={handleHealthCheck}
              isChecking={isCheckingHealth}
            />
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
            <FunctionList
              functions={server.functions}
              onViewSchema={setSelectedFunction}
              onTestFunction={handleTestFunction}
            />
            {testResult && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Test Result</h4>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <ServerLogsViewer
              logs={server.logs}
              onDownload={() => {
                const logsJson = downloadLogs(server.id);
                const blob = new Blob([logsJson], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${server.name}-logs.json`;
                a.click();
              }}
              onClear={() => clearLogs(server.id)}
            />
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <ServerControls
              server={server}
              onReloadFunctions={() => reloadFunctions(server.id)}
              onRestart={() => restartServer(server.id)}
              onToggleMaintenance={(enabled) => toggleMaintenance(server.id, enabled)}
              onToggleDisabled={(enabled) => toggleDisabled(server.id, enabled)}
              onForceHeartbeat={handleForceHeartbeat}
            />
          </TabsContent>
        </Tabs>
      </div>

      <FunctionSchemaViewer
        function={selectedFunction}
        onClose={() => setSelectedFunction(null)}
      />
    </div>
  );
};

