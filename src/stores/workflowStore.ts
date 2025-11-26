import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export interface WorkflowMetadata {
  connectedApps: string[];
  lastRun?: {
    runId: string;
    status: "success" | "error" | "running";
    duration?: number;
    timestamp: string;
  };
}

export interface WorkflowSchedule {
  enabled: boolean;
  frequency: "manual" | "hourly" | "daily" | "weekly" | "cron";
  hour?: number;
  minute?: number;
  dayOfWeek?: number;
  cronExpression?: string;
  nextRun?: string;
}

export interface WorkflowTrigger {
  id: string;
  type: "email" | "jira" | "slack" | "notion" | "webhook";
  enabled: boolean;
  config: Record<string, any>;
}

export interface WorkflowPermission {
  app: string;
  scopes: string[];
  connected: boolean;
  lastSync?: string;
}

export interface WorkflowVersion {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changeType: "ai_regenerate" | "manual_edit" | "template_import" | "version_restore";
  summary: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  diff?: {
    nodesAdded: number;
    nodesRemoved: number;
    nodesModified: number;
    edgesAdded: number;
    edgesRemoved: number;
  };
}

export interface WorkflowActivity {
  id: string;
  type: "node_updated" | "workflow_regenerated" | "node_moved" | "node_added" | "node_deleted" | "settings_changed";
  timestamp: string;
  description: string;
  userId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  metadata: WorkflowMetadata;
  canvas: {
    nodes: Node<NodeData>[];
    edges: Edge[];
  };
  schedule: WorkflowSchedule;
  triggers: WorkflowTrigger[];
  permissions: WorkflowPermission[];
  versions: WorkflowVersion[];
  activity: WorkflowActivity[];
}

interface WorkflowState {
  workflows: Record<string, Workflow>;
  currentWorkflowId: string | null;

  // Actions
  getWorkflow: (id: string) => Workflow | undefined;
  createWorkflow: (name: string, description?: string) => string;
  setWorkflowName: (id: string, name: string) => void;
  setWorkflowDescription: (id: string, description: string) => void;
  updateCanvas: (id: string, nodes: Node<NodeData>[], edges: Edge[]) => void;
  addVersion: (id: string, changeType: WorkflowVersion["changeType"], summary?: string) => void;
  addActivity: (id: string, activity: Omit<WorkflowActivity, "id" | "timestamp">) => void;
  updateSchedule: (id: string, schedule: Partial<WorkflowSchedule>) => void;
  updateTriggers: (id: string, triggers: WorkflowTrigger[]) => void;
  updatePermissions: (id: string, permissions: WorkflowPermission[]) => void;
  setCurrentWorkflow: (id: string | null) => void;
  duplicateWorkflow: (id: string) => string;
  deleteWorkflow: (id: string) => void;
  getVersionDiff: (id: string, versionId1: string, versionId2: string) => any;
}

const defaultSchedule: WorkflowSchedule = {
  enabled: false,
  frequency: "manual",
};

const defaultTriggers: WorkflowTrigger[] = [];

const defaultPermissions: WorkflowPermission[] = [
  { app: "Gmail", scopes: ["read", "send"], connected: true },
  { app: "Jira", scopes: ["read", "write"], connected: true },
  { app: "Slack", scopes: ["read", "write"], connected: true },
];

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflows: {},
      currentWorkflowId: null,

      getWorkflow: (id: string) => {
        return get().workflows[id];
      },

      createWorkflow: (name: string, description = "") => {
        const id = uuidv4();
        const now = new Date().toISOString();
        
        const workflow: Workflow = {
          id,
          name,
          description,
          createdAt: now,
          updatedAt: now,
          owner: "Current User",
          metadata: {
            connectedApps: [],
            lastRun: undefined,
          },
          canvas: {
            nodes: [],
            edges: [],
          },
          schedule: { ...defaultSchedule },
          triggers: [...defaultTriggers],
          permissions: [...defaultPermissions],
          versions: [],
          activity: [],
        };

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: workflow,
          },
        }));

        return id;
      },

      setWorkflowName: (id: string, name: string) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              name,
              updatedAt: new Date().toISOString(),
            },
          },
        }));

        get().addActivity(id, {
          type: "settings_changed",
          description: `Workflow renamed to "${name}"`,
        });
      },

      setWorkflowDescription: (id: string, description: string) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              description,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      updateCanvas: (id: string, nodes: Node<NodeData>[], edges: Edge[]) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        const oldNodes = workflow.canvas.nodes;
        const oldEdges = workflow.canvas.edges;

        // Detect changes
        const nodesAdded = nodes.filter((n) => !oldNodes.find((on) => on.id === n.id)).length;
        const nodesRemoved = oldNodes.filter((on) => !nodes.find((n) => n.id === on.id)).length;
        const nodesModified = nodes.filter((n) => {
          const old = oldNodes.find((on) => on.id === n.id);
          return old && JSON.stringify(old.data) !== JSON.stringify(n.data);
        }).length;

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              canvas: { nodes, edges },
              updatedAt: new Date().toISOString(),
            },
          },
        }));

        // Add activity
        if (nodesAdded > 0) {
          get().addActivity(id, {
            type: "node_added",
            description: `${nodesAdded} node(s) added`,
          });
        }
        if (nodesRemoved > 0) {
          get().addActivity(id, {
            type: "node_deleted",
            description: `${nodesRemoved} node(s) removed`,
          });
        }
        if (nodesModified > 0) {
          get().addActivity(id, {
            type: "node_updated",
            description: `${nodesModified} node(s) updated`,
          });
        }

        // Create version snapshot
        get().addVersion(id, "manual_edit", `Canvas updated: ${nodesAdded} added, ${nodesRemoved} removed, ${nodesModified} modified`);
      },

      addVersion: (id: string, changeType: WorkflowVersion["changeType"], summary = "") => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        const version: WorkflowVersion = {
          id: uuidv4(),
          version: workflow.versions.length + 1,
          createdAt: new Date().toISOString(),
          createdBy: "Current User",
          changeType,
          summary: summary || `Workflow ${changeType.replace("_", " ")}`,
          nodes: JSON.parse(JSON.stringify(workflow.canvas.nodes)),
          edges: JSON.parse(JSON.stringify(workflow.canvas.edges)),
        };

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              versions: [version, ...workflow.versions],
            },
          },
        }));
      },

      addActivity: (id: string, activity: Omit<WorkflowActivity, "id" | "timestamp">) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        const newActivity: WorkflowActivity = {
          ...activity,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              activity: [newActivity, ...workflow.activity.slice(0, 49)], // Keep last 50
            },
          },
        }));
      },

      updateSchedule: (id: string, schedule: Partial<WorkflowSchedule>) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        const updatedSchedule = { ...workflow.schedule, ...schedule };
        
        // Calculate next run
        if (updatedSchedule.enabled && updatedSchedule.frequency !== "manual") {
          const now = dayjs();
          let nextRun = now;
          
          if (updatedSchedule.frequency === "hourly") {
            nextRun = now.add(1, "hour");
          } else if (updatedSchedule.frequency === "daily" && updatedSchedule.hour !== undefined && updatedSchedule.minute !== undefined) {
            nextRun = now.hour(updatedSchedule.hour).minute(updatedSchedule.minute).second(0);
            if (nextRun.isBefore(now)) {
              nextRun = nextRun.add(1, "day");
            }
          } else if (updatedSchedule.frequency === "weekly" && updatedSchedule.dayOfWeek !== undefined) {
            nextRun = now.day(updatedSchedule.dayOfWeek).hour(updatedSchedule.hour || 9).minute(updatedSchedule.minute || 0);
            if (nextRun.isBefore(now)) {
              nextRun = nextRun.add(1, "week");
            }
          }
          
          updatedSchedule.nextRun = nextRun.toISOString();
        }

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              schedule: updatedSchedule,
              updatedAt: new Date().toISOString(),
            },
          },
        }));

        get().addActivity(id, {
          type: "settings_changed",
          description: `Schedule updated: ${updatedSchedule.frequency}`,
        });
      },

      updateTriggers: (id: string, triggers: WorkflowTrigger[]) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              triggers,
              updatedAt: new Date().toISOString(),
            },
          },
        }));

        get().addActivity(id, {
          type: "settings_changed",
          description: `Triggers updated: ${triggers.filter((t) => t.enabled).length} enabled`,
        });
      },

      updatePermissions: (id: string, permissions: WorkflowPermission[]) => {
        const workflow = get().workflows[id];
        if (!workflow) return;

        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: {
              ...workflow,
              permissions,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      setCurrentWorkflow: (id: string | null) => {
        set({ currentWorkflowId: id });
      },

      duplicateWorkflow: (id: string) => {
        const workflow = get().workflows[id];
        if (!workflow) return "";

        const newId = uuidv4();
        const now = new Date().toISOString();

        const duplicated: Workflow = {
          ...workflow,
          id: newId,
          name: `${workflow.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
          versions: [],
          activity: [],
        };

        set((state) => ({
          workflows: {
            ...state.workflows,
            [newId]: duplicated,
          },
        }));

        return newId;
      },

      deleteWorkflow: (id: string) => {
        const workflows = { ...get().workflows };
        delete workflows[id];
        set({ workflows });
      },

      getVersionDiff: (id: string, versionId1: string, versionId2: string) => {
        const workflow = get().workflows[id];
        if (!workflow) return null;

        const v1 = workflow.versions.find((v) => v.id === versionId1);
        const v2 = workflow.versions.find((v) => v.id === versionId2);
        if (!v1 || !v2) return null;

        const nodes1 = new Set(v1.nodes.map((n) => n.id));
        const nodes2 = new Set(v2.nodes.map((n) => n.id));

        const nodesAdded = v2.nodes.filter((n) => !nodes1.has(n.id));
        const nodesRemoved = v1.nodes.filter((n) => !nodes2.has(n.id));
        const nodesModified = v2.nodes.filter((n) => {
          const old = v1.nodes.find((on) => on.id === n.id);
          return old && JSON.stringify(old.data) !== JSON.stringify(n.data);
        });

        const edges1 = new Set(v1.edges.map((e) => `${e.source}-${e.target}`));
        const edges2 = new Set(v2.edges.map((e) => `${e.source}-${e.target}`));

        const edgesAdded = v2.edges.filter((e) => !edges1.has(`${e.source}-${e.target}`));
        const edgesRemoved = v1.edges.filter((e) => !edges2.has(`${e.source}-${e.target}`));

        return {
          nodesAdded,
          nodesRemoved,
          nodesModified,
          edgesAdded,
          edgesRemoved,
        };
      },
    }),
    {
      name: "workflow-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

