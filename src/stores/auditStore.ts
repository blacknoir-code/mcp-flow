import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuditLog } from "@/data/sampleAuditLogs";
import { sampleAuditLogs } from "@/data/sampleAuditLogs";
import { v4 as uuidv4 } from "uuid";

interface AuditState {
  logs: AuditLog[];
  filters: {
    search: string;
    user: string;
    eventType: string;
    dateRange: { start: string; end: string };
    workflow: string;
    integration: string;
  };
  savedFilters: Array<{ name: string; filters: AuditState["filters"] }>;

  appendLog: (entry: Omit<AuditLog, "id" | "timestamp">) => void;
  setFilters: (filters: Partial<AuditState["filters"]>) => void;
  saveFilter: (name: string) => void;
  deleteSavedFilter: (index: number) => void;
  queryLogs: () => AuditLog[];
  exportLogs: (format: "json" | "csv") => string;
  clearLogs: () => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      logs: sampleAuditLogs,
      filters: {
        search: "",
        user: "",
        eventType: "",
        dateRange: { start: "", end: "" },
        workflow: "",
        integration: "",
      },
      savedFilters: [],

      appendLog: (entry) =>
        set((state) => ({
          logs: [
            {
              ...entry,
              id: uuidv4(),
              timestamp: new Date().toISOString(),
            },
            ...state.logs,
          ],
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      saveFilter: (name) =>
        set((state) => ({
          savedFilters: [...state.savedFilters, { name, filters: state.filters }],
        })),

      deleteSavedFilter: (index) =>
        set((state) => ({
          savedFilters: state.savedFilters.filter((_, i) => i !== index),
        })),

      queryLogs: () => {
        const { logs, filters } = get();
        let filtered = [...logs];

        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (log) =>
              log.user.toLowerCase().includes(search) ||
              log.action.toLowerCase().includes(search) ||
              log.resource?.toLowerCase().includes(search) ||
              JSON.stringify(log.metadata).toLowerCase().includes(search)
          );
        }

        if (filters.user) {
          filtered = filtered.filter((log) => log.user === filters.user);
        }

        if (filters.eventType) {
          filtered = filtered.filter((log) => log.eventType === filters.eventType);
        }

        if (filters.dateRange.start) {
          filtered = filtered.filter((log) => log.timestamp >= filters.dateRange.start);
        }

        if (filters.dateRange.end) {
          filtered = filtered.filter((log) => log.timestamp <= filters.dateRange.end);
        }

        if (filters.workflow) {
          filtered = filtered.filter((log) => log.resourceId === filters.workflow);
        }

        if (filters.integration) {
          filtered = filtered.filter((log) => log.resourceId === filters.integration);
        }

        return filtered;
      },

      exportLogs: (format) => {
        const logs = get().queryLogs();
        if (format === "json") {
          return JSON.stringify(logs, null, 2);
        } else {
          const headers = ["Timestamp", "User", "Action", "Resource", "Metadata"];
          const rows = logs.map((log) => [
            log.timestamp,
            log.user,
            log.action,
            log.resource || "",
            JSON.stringify(log.metadata),
          ]);
          return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        }
      },

      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "audit-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper function for other components to append audit logs
export const appendAuditLog = (entry: Omit<AuditLog, "id" | "timestamp">) => {
  useAuditStore.getState().appendLog(entry);
};

