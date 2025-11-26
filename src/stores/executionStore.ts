import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export type ExecutionStatus = "pending" | "running" | "success" | "error" | "cancelled";

export interface ExecutionEvent {
  id: string;
  nodeId: string;
  type: "node_started" | "node_log" | "node_output" | "node_success" | "node_error" | "node_retry";
  timestamp: string;
  data?: any;
  log?: string;
  error?: string;
  retryAttempt?: number;
}

export interface NodeExecution {
  nodeId: string;
  nodeTitle: string;
  app: string;
  status: ExecutionStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;
  events: ExecutionEvent[];
  mockResponse?: any;
  error?: string;
  retryCount: number;
  retryHistory: Array<{
    attempt: number;
    timestamp: string;
    status: ExecutionStatus;
    error?: string;
  }>;
}

export interface Run {
  runId: string;
  workflowName: string;
  startTime: string;
  endTime?: string;
  status: ExecutionStatus;
  nodes: NodeExecution[];
  events: ExecutionEvent[];
  summary: {
    total: number;
    success: number;
    error: number;
    pending: number;
  };
}

interface ExecutionState {
  runs: Run[];
  currentRun: Run | null;
  isRunning: boolean;
  selectedNodeId: string | null;
  filter: "all" | "errors" | "warnings" | "success";
  timeRange: "last_run" | "today" | "last_7_days";
  
  // Actions
  startRun: (workflowName: string, nodeIds: string[]) => string;
  addEvent: (runId: string, event: Omit<ExecutionEvent, "id" | "timestamp">) => void;
  updateNodeStatus: (runId: string, nodeId: string, status: ExecutionStatus, data?: any) => void;
  completeRun: (runId: string) => void;
  cancelRun: (runId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setFilter: (filter: "all" | "errors" | "warnings" | "success") => void;
  setTimeRange: (range: "last_run" | "today" | "last_7_days") => void;
  getNodeExecution: (runId: string, nodeId: string) => NodeExecution | undefined;
  getFilteredRuns: () => Run[];
  clearHistory: () => void;
}

export const useExecutionStore = create<ExecutionState>()(
  persist(
    (set, get) => ({
      runs: [],
      currentRun: null,
      isRunning: false,
      selectedNodeId: null,
      filter: "all",
      timeRange: "last_run",

      startRun: (workflowName, nodeIds) => {
        const runId = uuidv4();
        const startTime = new Date().toISOString();
        
        const nodes: NodeExecution[] = nodeIds.map((nodeId) => ({
          nodeId,
          nodeTitle: `Node ${nodeId}`,
          app: "Unknown",
          status: "pending",
          events: [],
          retryCount: 0,
          retryHistory: [],
        }));

        const run: Run = {
          runId,
          workflowName,
          startTime,
          status: "running",
          nodes,
          events: [],
          summary: {
            total: nodes.length,
            success: 0,
            error: 0,
            pending: nodes.length,
          },
        };

        set({
          runs: [run, ...get().runs.slice(0, 19)], // Keep last 20 runs
          currentRun: run,
          isRunning: true,
        });

        return runId;
      },

      addEvent: (runId, event) => {
        const runs = get().runs.map((run) => {
          if (run.runId === runId) {
            const newEvent: ExecutionEvent = {
              ...event,
              id: uuidv4(),
              timestamp: new Date().toISOString(),
            };
            return {
              ...run,
              events: [...run.events, newEvent],
            };
          }
          return run;
        });

        set({ runs });
      },

      updateNodeStatus: (runId, nodeId, status, data) => {
        const runs = get().runs.map((run) => {
          if (run.runId === runId) {
            const nodes = run.nodes.map((node) => {
              if (node.nodeId === nodeId) {
                const now = new Date().toISOString();
                const updated: NodeExecution = {
                  ...node,
                  status,
                  ...(data?.nodeTitle && { nodeTitle: data.nodeTitle }),
                  ...(data?.app && { app: data.app }),
                  ...(status === "running" && !node.startTime && { startTime: now }),
                  ...(status === "success" || status === "error") && {
                    endTime: now,
                    duration: node.startTime
                      ? dayjs(now).diff(dayjs(node.startTime), "millisecond")
                      : 0,
                  },
                  ...(data?.mockResponse && { mockResponse: data.mockResponse }),
                  ...(data?.error && { error: data.error }),
                  ...(data?.retryAttempt && {
                    retryCount: data.retryAttempt,
                    retryHistory: [
                      ...node.retryHistory,
                      {
                        attempt: data.retryAttempt,
                        timestamp: now,
                        status,
                        error: data.error,
                      },
                    ],
                  }),
                };
                return updated;
              }
              return node;
            });

            const summary = {
              total: nodes.length,
              success: nodes.filter((n) => n.status === "success").length,
              error: nodes.filter((n) => n.status === "error").length,
              pending: nodes.filter((n) => n.status === "pending" || n.status === "running").length,
            };

            return {
              ...run,
              nodes,
              summary,
              status: summary.pending === 0 ? (summary.error > 0 ? "error" : "success") : "running",
            };
          }
          return run;
        });

        const currentRun = runs.find((r) => r.runId === runId) || null;

        set({ runs, currentRun });
      },

      completeRun: (runId) => {
        const runs = get().runs.map((run) => {
          if (run.runId === runId) {
            return {
              ...run,
              endTime: new Date().toISOString(),
              status: run.summary.error > 0 ? "error" : "success",
            };
          }
          return run;
        });

        set({
          runs,
          currentRun: null,
          isRunning: false,
        });
      },

      cancelRun: (runId) => {
        const runs = get().runs.map((run) => {
          if (run.runId === runId) {
            return {
              ...run,
              endTime: new Date().toISOString(),
              status: "cancelled",
            };
          }
          return run;
        });

        set({
          runs,
          currentRun: null,
          isRunning: false,
        });
      },

      selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

      setFilter: (filter) => set({ filter }),

      setTimeRange: (timeRange) => set({ timeRange }),

      getNodeExecution: (runId, nodeId) => {
        const run = get().runs.find((r) => r.runId === runId);
        return run?.nodes.find((n) => n.nodeId === nodeId);
      },

      getFilteredRuns: () => {
        const { runs, filter, timeRange } = get();
        let filtered = [...runs];

        // Time range filter
        const now = dayjs();
        if (timeRange === "today") {
          filtered = filtered.filter((run) => dayjs(run.startTime).isSame(now, "day"));
        } else if (timeRange === "last_7_days") {
          filtered = filtered.filter((run) => dayjs(run.startTime).isAfter(now.subtract(7, "day")));
        } else if (timeRange === "last_run") {
          filtered = filtered.slice(0, 1);
        }

        return filtered;
      },

      clearHistory: () => set({ runs: [], currentRun: null }),
    }),
    {
      name: "execution-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        runs: state.runs.slice(0, 20), // Persist last 20 runs
      }),
    }
  )
);

