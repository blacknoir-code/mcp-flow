import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RunRecord, RunStatus, TriggerType } from "@/data/sampleRuns";
import { sampleRuns } from "@/data/sampleRuns";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

interface RunFilters {
  status: RunStatus[];
  timeRange: string;
  trigger: TriggerType[];
  workflowId?: string;
  user?: string;
  searchText: string;
  showFailedOnly?: boolean;
  showSlowRuns?: boolean;
  slowRunThreshold?: number;
}

interface Pagination {
  page: number;
  perPage: number;
}

interface RunsState {
  runs: RunRecord[];
  selectedRunIds: string[];
  filters: RunFilters;
  pagination: Pagination;
  sortBy?: { field: string; direction: "asc" | "desc" };

  addRun: (run: RunRecord) => void;
  updateRun: (runId: string, patch: Partial<RunRecord>) => void;
  deleteRun: (runId: string) => void;
  selectRun: (runId: string) => void;
  deselectRun: (runId: string) => void;
  selectAll: (runIds: string[]) => void;
  clearSelection: () => void;
  setFilters: (filters: Partial<RunFilters>) => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  setSort: (field: string, direction?: "asc" | "desc") => void;
  queryRuns: () => RunRecord[];
  exportRuns: (runIds: string[], format: "json" | "csv") => string;
  getMetrics: () => {
    avgDuration: number;
    medianDuration: number;
    successRate: number;
    runsLast24h: number;
    slowestRunId?: string;
    runsPerHour: number[];
  };
}

const defaultFilters: RunFilters = {
  status: [],
  timeRange: "24h",
  trigger: [],
  searchText: "",
  showFailedOnly: false,
  showSlowRuns: false,
  slowRunThreshold: 10000,
};

export const useRunsStore = create<RunsState>()(
  persist(
    (set, get) => ({
      runs: sampleRuns,
      selectedRunIds: [],
      filters: defaultFilters,
      pagination: { page: 1, perPage: 25 },
      sortBy: { field: "startedAt", direction: "desc" },

      addRun: (run) =>
        set((state) => ({
          runs: [run, ...state.runs],
        })),

      updateRun: (runId, patch) =>
        set((state) => ({
          runs: state.runs.map((r) => (r.runId === runId ? { ...r, ...patch } : r)),
        })),

      deleteRun: (runId) =>
        set((state) => ({
          runs: state.runs.filter((r) => r.runId !== runId),
          selectedRunIds: state.selectedRunIds.filter((id) => id !== runId),
        })),

      selectRun: (runId) =>
        set((state) => ({
          selectedRunIds: state.selectedRunIds.includes(runId)
            ? state.selectedRunIds.filter((id) => id !== runId)
            : [...state.selectedRunIds, runId],
        })),

      deselectRun: (runId) =>
        set((state) => ({
          selectedRunIds: state.selectedRunIds.filter((id) => id !== runId),
        })),

      selectAll: (runIds) =>
        set((state) => {
          const allSelected = runIds.every((id) => state.selectedRunIds.includes(id));
          return {
            selectedRunIds: allSelected ? [] : runIds,
          };
        }),

      clearSelection: () => set({ selectedRunIds: [] }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        })),

      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),

      setSort: (field, direction) => {
        const currentSort = get().sortBy;
        const newDirection =
          direction ||
          (currentSort?.field === field && currentSort?.direction === "desc" ? "asc" : "desc");
        set({ sortBy: { field, direction: newDirection } });
      },

      queryRuns: () => {
        const { runs, filters, sortBy } = get();
        let filtered = [...runs];

        // Status filter
        if (filters.status.length > 0) {
          filtered = filtered.filter((r) => filters.status.includes(r.status));
        }

        // Time range filter
        if (filters.timeRange && filters.timeRange !== "all") {
          const now = Date.now();
          const ranges: Record<string, number> = {
            "1h": 60 * 60 * 1000,
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
            "30d": 30 * 24 * 60 * 60 * 1000,
          };
          const cutoff = now - (ranges[filters.timeRange] || 0);
          filtered = filtered.filter((r) => new Date(r.startedAt).getTime() >= cutoff);
        }

        // Trigger filter
        if (filters.trigger.length > 0) {
          filtered = filtered.filter((r) => filters.trigger.includes(r.trigger));
        }

        // Workflow filter
        if (filters.workflowId) {
          filtered = filtered.filter((r) => r.workflowId === filters.workflowId);
        }

        // User filter
        if (filters.user) {
          filtered = filtered.filter((r) => r.triggeredBy === filters.user);
        }

        // Search text
        if (filters.searchText) {
          const search = filters.searchText.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.runId.toLowerCase().includes(search) ||
              r.workflowName.toLowerCase().includes(search) ||
              r.summary?.toLowerCase().includes(search) ||
              r.triggeredBy?.toLowerCase().includes(search) ||
              r.steps.some((s) => s.logs.some((l) => l.message.toLowerCase().includes(search)))
          );
        }

        // Show failed only
        if (filters.showFailedOnly) {
          filtered = filtered.filter((r) => r.status === "failed");
        }

        // Show slow runs
        if (filters.showSlowRuns && filters.slowRunThreshold) {
          filtered = filtered.filter((r) => (r.durationMs || 0) > filters.slowRunThreshold!);
        }

        // Sort
        if (sortBy) {
          filtered.sort((a, b) => {
            let aVal: any;
            let bVal: any;

            switch (sortBy.field) {
              case "startedAt":
                aVal = new Date(a.startedAt).getTime();
                bVal = new Date(b.startedAt).getTime();
                break;
              case "durationMs":
                aVal = a.durationMs || 0;
                bVal = b.durationMs || 0;
                break;
              case "workflowName":
                aVal = a.workflowName;
                bVal = b.workflowName;
                break;
              case "status":
                aVal = a.status;
                bVal = b.status;
                break;
              default:
                return 0;
            }

            if (aVal < bVal) return sortBy.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortBy.direction === "asc" ? 1 : -1;
            return 0;
          });
        }

        return filtered;
      },

      exportRuns: (runIds, format) => {
        const { runs } = get();
        const selectedRuns = runs.filter((r) => runIds.includes(r.runId));

        if (format === "json") {
          return JSON.stringify(selectedRuns, null, 2);
        } else {
          const headers = ["Run ID", "Workflow", "Status", "Duration (ms)", "Trigger", "User", "Start Time"];
          const rows = selectedRuns.map((r) => [
            r.runId,
            r.workflowName,
            r.status,
            r.durationMs?.toString() || "",
            r.trigger,
            r.triggeredBy || "",
            r.startedAt,
          ]);
          return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        }
      },

      getMetrics: () => {
        const filteredRuns = get().queryRuns();
        const completedRuns = filteredRuns.filter((r) => r.durationMs !== undefined);
        const durations = completedRuns.map((r) => r.durationMs || 0).sort((a, b) => a - b);

        const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
        const medianDuration =
          durations.length > 0
            ? durations[Math.floor(durations.length / 2)]
            : 0;

        const successCount = filteredRuns.filter((r) => r.status === "success").length;
        const successRate = filteredRuns.length > 0 ? (successCount / filteredRuns.length) * 100 : 0;

        const last24h = Date.now() - 24 * 60 * 60 * 1000;
        const runsLast24h = filteredRuns.filter((r) => new Date(r.startedAt).getTime() >= last24h).length;

        const slowestRun = completedRuns.reduce(
          (max, r) => ((r.durationMs || 0) > (max.durationMs || 0) ? r : max),
          completedRuns[0]
        );

        // Mock runs per hour (last 24 hours)
        const runsPerHour = Array.from({ length: 24 }, (_, i) => {
          const hourStart = Date.now() - (24 - i) * 60 * 60 * 1000;
          const hourEnd = hourStart + 60 * 60 * 1000;
          return filteredRuns.filter(
            (r) =>
              new Date(r.startedAt).getTime() >= hourStart &&
              new Date(r.startedAt).getTime() < hourEnd
          ).length;
        });

        return {
          avgDuration,
          medianDuration,
          successRate,
          runsLast24h,
          slowestRunId: slowestRun?.runId,
          runsPerHour,
        };
      },
    }),
    {
      name: "runs-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

