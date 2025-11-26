import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { MCPServer, MCPServerLog, MCPFunction } from "@/data/mockMcpServers";
import { mockMcpServers } from "@/data/mockMcpServers";
import { mockFunctions } from "@/data/mockFunctions";
import { generateMockLogs } from "@/data/mockLogs";
import dayjs from "dayjs";

interface MCPState {
  servers: Record<string, MCPServer>;
  selectedServerId: string | null;
  globalActivity: Array<{
    id: string;
    timestamp: string;
    serverId: string;
    action: string;
    message: string;
  }>;

  // Actions
  setSelectedServer: (serverId: string | null) => void;
  discoverServers: () => void;
  addServer: (serverData: Partial<MCPServer>) => void;
  removeServer: (serverId: string) => void;
  runHealthCheck: (serverId: string) => Promise<void>;
  reloadFunctions: (serverId: string) => Promise<void>;
  restartServer: (serverId: string) => Promise<void>;
  toggleMaintenance: (serverId: string, enabled: boolean) => void;
  toggleDisabled: (serverId: string, enabled: boolean) => void;
  runTestFunction: (serverId: string, functionName: string, params: Record<string, any>) => Promise<any>;
  appendLog: (serverId: string, log: Omit<MCPServerLog, "id" | "ts">) => void;
  setServerMetadata: (serverId: string, updates: Partial<MCPServer>) => void;
  clearLogs: (serverId: string) => void;
  downloadLogs: (serverId: string) => string;
  updateMetrics: (serverId: string) => void;
}

const evaluateHealth = (server: MCPServer): "healthy" | "degraded" | "down" => {
  if (server.settings.maintenance) return "maintenance";
  if (server.settings.disabled) return "down";
  
  const lastErrorRate = server.metrics.errorRateHistory[server.metrics.errorRateHistory.length - 1] || 0;
  if (lastErrorRate > 0.15) return "down";
  if (lastErrorRate > 0.05) return "degraded";
  return "healthy";
};

export const useMcpStore = create<MCPState>()(
  persist(
    (set, get) => ({
      servers: mockMcpServers.reduce((acc, server) => {
        // Add functions and logs to each server
        acc[server.id] = {
          ...server,
          functions: mockFunctions,
          logs: generateMockLogs(30),
        };
        return acc;
      }, {} as Record<string, MCPServer>),
      selectedServerId: null,
      globalActivity: [],

      setSelectedServer: (serverId) => set({ selectedServerId: serverId }),

      discoverServers: () => {
        const newServers: MCPServer[] = [
          {
            id: `mcp-discovered-${Date.now()}`,
            name: `mcp-discovered-${Date.now()}`,
            endpoint: `mcp://discovered-${Date.now()}.mcp.example.com`,
            region: "us-east",
            tags: ["discovered", "auto"],
            version: "1.2.1",
            instanceId: `i-discovered-${uuidv4().slice(0, 8)}`,
            health: "healthy",
            lastHeartbeat: new Date().toISOString(),
            uptimePct: 98.5,
            lastDeployTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            deployVersion: "1.2.1",
            metrics: {
              rpsHistory: [20, 25, 22, 24, 21, 23, 25, 22, 24, 20],
              errorRateHistory: [0.02, 0.01, 0.02, 0.01, 0.02, 0.01, 0.02, 0.01, 0.02, 0.01],
              avgLatencyMs: 150,
              cpuPct: 40,
              memPct: 55,
            },
            functions: mockFunctions,
            logs: generateMockLogs(10),
            settings: {
              maintenance: false,
              disabled: false,
              tags: ["discovered", "auto"],
            },
          },
        ];

        set((state) => {
          const updated = { ...state.servers };
          newServers.forEach((server) => {
            updated[server.id] = server;
          });

          const activity = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            serverId: newServers[0].id,
            action: "discover",
            message: `Discovered ${newServers.length} new server(s)`,
          };

          return {
            servers: updated,
            globalActivity: [activity, ...state.globalActivity.slice(0, 49)],
          };
        });
      },

      addServer: (serverData) => {
        const newServer: MCPServer = {
          id: serverData.id || uuidv4(),
          name: serverData.name || "New Server",
          endpoint: serverData.endpoint || "mcp://new-server.mcp.example.com",
          region: serverData.region || "us-east",
          tags: serverData.tags || [],
          version: serverData.version || "1.0.0",
          instanceId: serverData.instanceId || `i-${uuidv4().slice(0, 8)}`,
          health: "healthy",
          lastHeartbeat: new Date().toISOString(),
          uptimePct: 100,
          lastDeployTime: new Date().toISOString(),
          deployVersion: serverData.version || "1.0.0",
          metrics: {
            rpsHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            errorRateHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            avgLatencyMs: 0,
            cpuPct: 0,
            memPct: 0,
          },
          functions: mockFunctions,
          logs: [],
          settings: {
            maintenance: false,
            disabled: false,
            alias: serverData.settings?.alias,
            tags: serverData.tags || [],
            credentials: serverData.settings?.credentials,
          },
        };

        set((state) => ({
          servers: { ...state.servers, [newServer.id]: newServer },
        }));
      },

      removeServer: (serverId) => {
        set((state) => {
          const updated = { ...state.servers };
          delete updated[serverId];
          return {
            servers: updated,
            selectedServerId: state.selectedServerId === serverId ? null : state.selectedServerId,
          };
        });
      },

      runHealthCheck: async (serverId) => {
        const server = get().servers[serverId];
        if (!server) return;

        // Simulate health check delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const now = new Date().toISOString();
        const health = evaluateHealth(server);

        // Update metrics slightly
        const newErrorRate = Math.max(0, Math.min(0.2, server.metrics.errorRateHistory[server.metrics.errorRateHistory.length - 1] + (Math.random() - 0.5) * 0.02));
        const newRps = Math.max(0, server.metrics.rpsHistory[server.metrics.rpsHistory.length - 1] + Math.floor((Math.random() - 0.5) * 10));

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              health,
              lastHeartbeat: now,
              metrics: {
                ...server.metrics,
                rpsHistory: [...server.metrics.rpsHistory.slice(1), newRps],
                errorRateHistory: [...server.metrics.errorRateHistory.slice(1), newErrorRate],
              },
            },
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: now,
            level: health === "down" ? "ERROR" : health === "degraded" ? "WARN" : "INFO",
            message: `Health check ${health === "down" ? "failed" : health === "degraded" ? "warned" : "passed"}`,
            meta: { health, errorRate: newErrorRate },
          };

          updated[serverId].logs = [log, ...updated[serverId].logs.slice(0, 99)];

          const activity = {
            id: uuidv4(),
            timestamp: now,
            serverId,
            action: "health_check",
            message: `Health check: ${health}`,
          };

          return {
            servers: updated,
            globalActivity: [activity, ...state.globalActivity.slice(0, 49)],
          };
        });
      },

      reloadFunctions: async (serverId) => {
        const server = get().servers[serverId];
        if (!server) return;

        if (server.health === "down") {
          const log: MCPServerLog = {
            id: uuidv4(),
            ts: new Date().toISOString(),
            level: "ERROR",
            message: "Reload functions failed: Server is down",
            meta: { error: "SERVER_DOWN" },
          };
          set((state) => {
            const updated = {
              ...state.servers,
              [serverId]: {
                ...server,
                logs: [log, ...server.logs.slice(0, 99)],
              },
            };
            return { servers: updated };
          });
          return;
        }

        // Simulate reload delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              functions: [...mockFunctions], // Reload functions
            },
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: now,
            level: "INFO",
            message: "Functions reloaded successfully",
            meta: { functionCount: mockFunctions.length },
          };

          updated[serverId].logs = [log, ...updated[serverId].logs.slice(0, 99)];

          const activity = {
            id: uuidv4(),
            timestamp: now,
            serverId,
            action: "reload_functions",
            message: "Functions reloaded",
          };

          return {
            servers: updated,
            globalActivity: [activity, ...state.globalActivity.slice(0, 49)],
          };
        });
      },

      restartServer: async (serverId) => {
        const server = get().servers[serverId];
        if (!server) return;

        const previousHealth = server.health;

        // Set to restarting
        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              health: "restarting",
            },
          };
          return { servers: updated };
        });

        // Simulate restart delay (3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              health: previousHealth === "restarting" ? "healthy" : previousHealth,
              lastHeartbeat: now,
              metrics: {
                ...server.metrics,
                rpsHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                errorRateHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              },
            },
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: now,
            level: "INFO",
            message: "Server restarted successfully",
            meta: { previousHealth },
          };

          updated[serverId].logs = [log, ...updated[serverId].logs.slice(0, 99)];

          const activity = {
            id: uuidv4(),
            timestamp: now,
            serverId,
            action: "restart",
            message: "Server restarted",
          };

          return {
            servers: updated,
            globalActivity: [activity, ...state.globalActivity.slice(0, 49)],
          };
        });
      },

      toggleMaintenance: (serverId, enabled) => {
        const server = get().servers[serverId];
        if (!server) return;

        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              health: enabled ? "maintenance" : evaluateHealth(server),
              settings: {
                ...server.settings,
                maintenance: enabled,
              },
            },
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: now,
            level: "INFO",
            message: `Maintenance mode ${enabled ? "enabled" : "disabled"}`,
          };

          updated[serverId].logs = [log, ...updated[serverId].logs.slice(0, 99)];

          return { servers: updated };
        });
      },

      toggleDisabled: (serverId, enabled) => {
        const server = get().servers[serverId];
        if (!server) return;

        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              health: enabled ? "down" : evaluateHealth(server),
              settings: {
                ...server.settings,
                disabled: enabled,
              },
            },
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: now,
            level: enabled ? "WARN" : "INFO",
            message: `Server ${enabled ? "disabled" : "enabled"}`,
          };

          updated[serverId].logs = [log, ...updated[serverId].logs.slice(0, 99)];

          return { servers: updated };
        });
      },

      runTestFunction: async (serverId, functionName, params) => {
        const server = get().servers[serverId];
        if (!server) return null;

        if (server.settings.maintenance || server.settings.disabled) {
          const error = {
            success: false,
            statusCode: 503,
            error: "Service unavailable",
            message: server.settings.maintenance ? "Server in maintenance mode" : "Server disabled",
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: new Date().toISOString(),
            level: "ERROR",
            message: `Test function call failed: ${functionName}`,
            meta: { error, params },
          };

          set((state) => {
            const updated = {
              ...state.servers,
              [serverId]: {
                ...server,
                logs: [log, ...server.logs.slice(0, 99)],
              },
            };
            return { servers: updated };
          });

          return error;
        }

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

        const func = server.functions.find((f) => f.name === functionName);
        if (!func) {
          return {
            success: false,
            statusCode: 404,
            error: "Function not found",
          };
        }

        const response = func.examples.response;
        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              metrics: {
                ...server.metrics,
                rpsHistory: [...server.metrics.rpsHistory.slice(1), server.metrics.rpsHistory[server.metrics.rpsHistory.length - 1] + 1],
              },
            },
          };

          const log: MCPServerLog = {
            id: uuidv4(),
            ts: now,
            level: "INFO",
            message: `Test function call: ${functionName}`,
            meta: { functionName, params, response },
          };

          updated[serverId].logs = [log, ...updated[serverId].logs.slice(0, 99)];

          return { servers: updated };
        });

        return {
          success: true,
          statusCode: 200,
          response,
          latency: Math.floor(500 + Math.random() * 500),
        };
      },

      appendLog: (serverId, log) => {
        const server = get().servers[serverId];
        if (!server) return;

        const newLog: MCPServerLog = {
          ...log,
          id: uuidv4(),
          ts: new Date().toISOString(),
        };

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              logs: [newLog, ...server.logs.slice(0, 99)],
            },
          };
          return { servers: updated };
        });
      },

      setServerMetadata: (serverId, updates) => {
        const server = get().servers[serverId];
        if (!server) return;

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              ...updates,
            },
          };
          return { servers: updated };
        });
      },

      clearLogs: (serverId) => {
        const server = get().servers[serverId];
        if (!server) return;

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              logs: [],
            },
          };
          return { servers: updated };
        });
      },

      downloadLogs: (serverId) => {
        const server = get().servers[serverId];
        if (!server) return "";

        return JSON.stringify(server.logs, null, 2);
      },

      updateMetrics: (serverId) => {
        const server = get().servers[serverId];
        if (!server) return;

        // Simulate metric updates
        const newRps = Math.max(0, server.metrics.rpsHistory[server.metrics.rpsHistory.length - 1] + Math.floor((Math.random() - 0.5) * 5));
        const newErrorRate = Math.max(0, Math.min(0.2, server.metrics.errorRateHistory[server.metrics.errorRateHistory.length - 1] + (Math.random() - 0.5) * 0.01));
        const newCpu = Math.max(0, Math.min(100, server.metrics.cpuPct + (Math.random() - 0.5) * 5));
        const newMem = Math.max(0, Math.min(100, server.metrics.memPct + (Math.random() - 0.5) * 3));

        set((state) => {
          const updated = {
            ...state.servers,
            [serverId]: {
              ...server,
              health: evaluateHealth(server),
              metrics: {
                ...server.metrics,
                rpsHistory: [...server.metrics.rpsHistory.slice(1), newRps],
                errorRateHistory: [...server.metrics.errorRateHistory.slice(1), newErrorRate],
                cpuPct: newCpu,
                memPct: newMem,
              },
            },
          };
          return { servers: updated };
        });
      },
    }),
    {
      name: "mcp-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

