import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { Integration, IntegrationLog, IntegrationTrigger, IntegrationSettings } from "@/data/mockIntegrations";
import { mockIntegrations } from "@/data/mockIntegrations";

interface IntegrationState {
  integrations: Record<string, Integration>;

  // Actions
  getIntegration: (id: string) => Integration | undefined;
  syncIntegration: (id: string) => Promise<void>;
  rotateToken: (id: string) => void;
  revokeIntegration: (id: string) => void;
  reconnectIntegration: (id: string, requestedScopes: string[]) => void;
  updateTriggerConfig: (id: string, triggerId: string, config: Record<string, any>) => void;
  toggleTrigger: (id: string, triggerId: string, enabled: boolean) => void;
  runTestCall: (id: string, endpoint: string, params: Record<string, any>) => Promise<any>;
  updateDefaultParam: (id: string, key: string, value: any) => void;
  updateSettings: (id: string, settings: Partial<IntegrationSettings>) => void;
  addLogEntry: (id: string, log: Omit<IntegrationLog, "id" | "timestamp">) => void;
  requestMoreScopes: (id: string, scopeNames: string[]) => void;
  copyToken: (id: string, masked: boolean) => string;
  testTrigger: (id: string, triggerId: string) => void;
}

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set, get) => ({
      integrations: mockIntegrations.reduce((acc, integration) => {
        acc[integration.id] = integration;
        return acc;
      }, {} as Record<string, Integration>),

      getIntegration: (id: string) => {
        return get().integrations[id];
      },

      syncIntegration: async (id: string) => {
        const integration = get().integrations[id];
        if (!integration) return;

        // Simulate sync delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const now = new Date().toISOString();
        const success = Math.random() > 0.1; // 90% success rate

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              lastSyncAt: now,
              lastSyncResult: success ? "success" : "error",
              health: success ? "healthy" : "degraded",
              rateLimits: {
                ...integration.rateLimits,
                usedLastHour: integration.rateLimits.usedLastHour + Math.floor(Math.random() * 10),
              },
            },
          };

          // Add log entry
          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: now,
            type: "sync",
            message: success ? "Sync completed successfully" : "Sync failed",
            status: success ? "success" : "error",
            metadata: { itemsSynced: success ? Math.floor(Math.random() * 20) : 0 },
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)]; // Keep last 50

          return { integrations: updated };
        });
      },

      rotateToken: (id: string) => {
        const integration = get().integrations[id];
        if (!integration) return;

        const now = new Date();
        const expiresAt = dayjs(now)
          .add(integration.settings.rotateEveryDays, "day")
          .toISOString();

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              token: {
                ...integration.token,
                valueMasked: `****_${uuidv4().slice(0, 6)}`,
                expiresAt,
                lastRotated: now.toISOString(),
              },
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: now.toISOString(),
            type: "token_rotated",
            message: "Token rotated successfully",
            status: "success",
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });
      },

      revokeIntegration: (id: string) => {
        const integration = get().integrations[id];
        if (!integration) return;

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              status: "disconnected",
              token: {
                ...integration.token,
                valueMasked: "",
                expiresAt: new Date().toISOString(),
              },
              health: "error",
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            type: "error",
            message: "Integration revoked",
            status: "error",
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });
      },

      reconnectIntegration: (id: string, requestedScopes: string[]) => {
        const integration = get().integrations[id];
        if (!integration) return;

        const now = new Date().toISOString();
        const updatedScopes = integration.scopes.map((scope) => {
          if (requestedScopes.includes(scope.name)) {
            return {
              ...scope,
              granted: true,
              lastGrantedAt: now,
            };
          }
          return scope;
        });

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              status: "connected",
              scopes: updatedScopes,
              token: {
                ...integration.token,
                valueMasked: `****_${uuidv4().slice(0, 6)}`,
                expiresAt: dayjs().add(30, "day").toISOString(),
                lastRotated: now,
              },
              health: "healthy",
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: now,
            type: "scope_reconsent",
            message: "Integration reconnected with additional scopes",
            status: "success",
            metadata: { scopes: requestedScopes },
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });
      },

      updateTriggerConfig: (id: string, triggerId: string, config: Record<string, any>) => {
        const integration = get().integrations[id];
        if (!integration) return;

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              triggers: integration.triggers.map((trigger) =>
                trigger.id === triggerId ? { ...trigger, config } : trigger
              ),
            },
          };

          return { integrations: updated };
        });
      },

      toggleTrigger: (id: string, triggerId: string, enabled: boolean) => {
        const integration = get().integrations[id];
        if (!integration) return;

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              triggers: integration.triggers.map((trigger) =>
                trigger.id === triggerId ? { ...trigger, enabled } : trigger
              ),
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            type: "trigger_fired",
            message: `${enabled ? "Enabled" : "Disabled"} trigger`,
            status: "success",
            metadata: { triggerId },
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });
      },

      runTestCall: async (id: string, endpoint: string, params: Record<string, any>) => {
        const integration = get().integrations[id];
        if (!integration) return null;

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

        const success = Math.random() > 0.15; // 85% success rate
        const statusCode = success ? 200 : (Math.random() > 0.5 ? 400 : 500);

        // Get mock response from mockResponses
        const { mockResponses } = require("@/data/mockResponses");
        const responseKey = endpoint.split(".")[1]?.replace(/\s+/g, "_") || "default";
        const mockResponse = mockResponses[responseKey] || { success, data: "Mock response" };

        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              rateLimits: {
                ...integration.rateLimits,
                usedLastHour: integration.rateLimits.usedLastHour + 1,
                usedToday: integration.rateLimits.usedToday + 1,
              },
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: now,
            type: "test_call",
            message: `Test call to ${endpoint}: ${success ? "Success" : "Failed"}`,
            status: success ? "success" : "error",
            metadata: {
              endpoint,
              params,
              response: mockResponse,
              statusCode,
              latency: Math.floor(500 + Math.random() * 500),
            },
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });

        return {
          success,
          statusCode,
          response: mockResponse,
          latency: Math.floor(500 + Math.random() * 500),
        };
      },

      updateDefaultParam: (id: string, key: string, value: any) => {
        const integration = get().integrations[id];
        if (!integration) return;

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              defaultParams: {
                ...integration.defaultParams,
                [key]: value,
              },
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            type: "sync",
            message: `Default parameter '${key}' updated`,
            status: "success",
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });
      },

      updateSettings: (id: string, settings: Partial<IntegrationSettings>) => {
        const integration = get().integrations[id];
        if (!integration) return;

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              settings: {
                ...integration.settings,
                ...settings,
              },
            },
          };

          return { integrations: updated };
        });
      },

      addLogEntry: (id: string, log: Omit<IntegrationLog, "id" | "timestamp">) => {
        const integration = get().integrations[id];
        if (!integration) return;

        const newLog: IntegrationLog = {
          ...log,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              logs: [newLog, ...integration.logs.slice(0, 49)],
            },
          };

          return { integrations: updated };
        });
      },

      requestMoreScopes: (id: string, scopeNames: string[]) => {
        const integration = get().integrations[id];
        if (!integration) return;

        // Mark scopes as pending
        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              scopes: integration.scopes.map((scope) => {
                if (scopeNames.includes(scope.name) && !scope.granted) {
                  return { ...scope, granted: false }; // Keep as not granted until reconnect
                }
                return scope;
              }),
            },
          };

          return { integrations: updated };
        });
      },

      copyToken: (id: string, masked: boolean) => {
        const integration = get().integrations[id];
        if (!integration) return "";
        return masked ? integration.token.valueMasked : "token_copied";
      },

      testTrigger: (id: string, triggerId: string) => {
        const integration = get().integrations[id];
        if (!integration) return;

        const trigger = integration.triggers.find((t) => t.id === triggerId);
        if (!trigger || !trigger.enabled) return;

        const now = new Date().toISOString();

        set((state) => {
          const updated = {
            ...state.integrations,
            [id]: {
              ...integration,
              triggers: integration.triggers.map((t) =>
                t.id === triggerId ? { ...t, lastFiredAt: now } : t
              ),
            },
          };

          const log: IntegrationLog = {
            id: uuidv4(),
            timestamp: now,
            type: "trigger_fired",
            message: `Trigger '${trigger.name}' fired`,
            status: "success",
            metadata: { triggerId, config: trigger.config },
          };

          updated[id].logs = [log, ...updated[id].logs.slice(0, 49)];

          return { integrations: updated };
        });
      },
    }),
    {
      name: "integration-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

