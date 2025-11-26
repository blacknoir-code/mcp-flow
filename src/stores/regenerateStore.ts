import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { v4 as uuidv4 } from "uuid";

export interface TaskSpec {
  apps: string[];
  operations: string[];
  conditions: string[];
  entities: string[];
}

export interface RegenerateHistoryEntry {
  id: string;
  timestamp: string;
  intent: string;
  summary: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  diff?: any;
}

export interface RegenerateState {
  intentDraft: string;
  parsedSpec: TaskSpec | null;
  suggestions: any[];
  rewrittenFlow: { nodes: Node<NodeData>[]; edges: Edge[] } | null;
  diff: any;
  history: RegenerateHistoryEntry[];
  isOpen: boolean;

  // Actions
  setIntentDraft: (text: string) => void;
  setParsedSpec: (spec: TaskSpec) => void;
  setSuggestions: (suggestions: any[]) => void;
  setRewrittenFlow: (flow: { nodes: Node<NodeData>[]; edges: Edge[] }) => void;
  setDiff: (diff: any) => void;
  addToHistory: (entry: Omit<RegenerateHistoryEntry, "id" | "timestamp">) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  reset: () => void;
}

export const useRegenerateStore = create<RegenerateState>()(
  persist(
    (set, get) => ({
      intentDraft: "",
      parsedSpec: null,
      suggestions: [],
      rewrittenFlow: null,
      diff: null,
      history: [],
      isOpen: false,

      setIntentDraft: (text) => set({ intentDraft: text }),

      setParsedSpec: (spec) => set({ parsedSpec: spec }),

      setSuggestions: (suggestions) => set({ suggestions }),

      setRewrittenFlow: (flow) => set({ rewrittenFlow: flow }),

      setDiff: (diff) => set({ diff }),

      addToHistory: (entry) => {
        const newEntry: RegenerateHistoryEntry = {
          ...entry,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        set({
          history: [newEntry, ...get().history.slice(0, 49)], // Keep last 50
        });
      },

      openDrawer: () => set({ isOpen: true }),

      closeDrawer: () => set({ isOpen: false }),

      reset: () =>
        set({
          intentDraft: "",
          parsedSpec: null,
          suggestions: [],
          rewrittenFlow: null,
          diff: null,
        }),
    }),
    {
      name: "regenerate-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history.slice(0, 20), // Persist last 20 entries
      }),
    }
  )
);

