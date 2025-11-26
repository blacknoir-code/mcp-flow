import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Node, Edge, Connection } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { NodeData } from "@/data/sampleNodes";
import { Template } from "@/data/sampleTemplates";

interface FlowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  templates: Template[];
  taskSpec: string | null;
  history: { nodes: Node<NodeData>[]; edges: Edge[] }[];
  historyIndex: number;
  
  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node<NodeData>) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  addEdge: (edge: Edge | Connection) => void;
  deleteEdge: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setTaskSpec: (spec: string) => void;
  saveTemplate: (template: Omit<Template, "id">) => void;
  loadTemplate: (templateId: string) => void;
  importFlow: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  exportFlow: () => { nodes: Node<NodeData>[]; edges: Edge[] };
  runWorkflow: () => Promise<void>;
  applyAiSuggestion: (suggestedNodes: Node<NodeData>[], suggestedEdges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // AI Assistant methods
  focusNode: (nodeId: string) => void;
  applyMutation: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  getNodeById: (id: string) => Node<NodeData> | undefined;
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      templates: [],
      taskSpec: null,
      history: [],
      historyIndex: -1,

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      addNode: (node) => {
        const newNodes = [...get().nodes, node];
        set({ nodes: newNodes });
        get().saveHistory();
      },

      updateNode: (id, data) => {
        const nodes = get().nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...data } }
            : node
        );
        set({ nodes });
      },

      deleteNode: (id) => {
        const nodes = get().nodes.filter((node) => node.id !== id);
        const edges = get().edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        set({ nodes, edges });
        if (get().selectedNodeId === id) {
          set({ selectedNodeId: null });
        }
        get().saveHistory();
      },

      duplicateNode: (id) => {
        const node = get().nodes.find((n) => n.id === id);
        if (!node) return;
        
        const newNode: Node<NodeData> = {
          ...node,
          id: uuidv4(),
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          data: { ...node.data },
        };
        get().addNode(newNode);
      },

      addEdge: (edgeOrConnection) => {
        const edge: Edge = {
          id: `e${edgeOrConnection.source}-${edgeOrConnection.target}`,
          source: edgeOrConnection.source,
          target: edgeOrConnection.target,
          type: "smoothstep",
          animated: false,
        };
        const edges = [...get().edges, edge];
        set({ edges });
      },

      deleteEdge: (id) => {
        const edges = get().edges.filter((edge) => edge.id !== id);
        set({ edges });
      },

      setSelectedNodeId: (id) => set({ selectedNodeId: id }),

      setTaskSpec: (spec) => set({ taskSpec: spec }),

      saveTemplate: (template) => {
        const newTemplate: Template = {
          ...template,
          id: uuidv4(),
        };
        const templates = [...get().templates, newTemplate];
        set({ templates });
      },

      loadTemplate: (templateId) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) {
          // Try sample templates
          const sampleTemplates = require("@/data/sampleTemplates").sampleTemplates;
          const sampleTemplate = sampleTemplates.find((t: Template) => t.id === templateId);
          if (sampleTemplate) {
            set({
              nodes: sampleTemplate.nodes.map((n) => ({
                ...n,
                id: uuidv4(),
                position: { ...n.position },
              })),
              edges: sampleTemplate.edges.map((e) => ({
                ...e,
                id: uuidv4(),
                source: e.source,
                target: e.target,
              })),
            });
            get().saveHistory();
          }
          return;
        }
        set({
          nodes: template.nodes.map((n) => ({
            ...n,
            id: uuidv4(),
            position: { ...n.position },
          })),
          edges: template.edges.map((e) => ({
            ...e,
            id: uuidv4(),
            source: e.source,
            target: e.target,
          })),
        });
        get().saveHistory();
      },

      importFlow: (nodes, edges) => {
        set({ nodes, edges });
        get().saveHistory();
      },

      exportFlow: () => {
        return {
          nodes: get().nodes,
          edges: get().edges,
        };
      },

      runWorkflow: async () => {
        const { nodes, edges } = get();
        
        // Reset all nodes to pending
        const resetNodes = nodes.map((node) => ({
          ...node,
          data: { ...node.data, status: "pending" as const },
        }));
        set({ nodes: resetNodes });

        // Topological sort
        const sortedNodes = topologicalSort(nodes, edges);
        
        for (const node of sortedNodes) {
          // Set running
          get().updateNode(node.id, { status: "running" });
          
          // Animate edge
          const incomingEdge = edges.find((e) => e.target === node.id);
          if (incomingEdge) {
            const updatedEdges = get().edges.map((e) =>
              e.id === incomingEdge.id ? { ...e, animated: true } : e
            );
            set({ edges: updatedEdges });
          }

          // Simulate execution
          await new Promise((resolve) => {
            const delay = 700 + Math.random() * 500;
            setTimeout(() => {
              // Check if node has error flag
              if (node.data.error) {
                get().updateNode(node.id, { status: "error" });
                // Stop execution
                resolve(undefined);
                return;
              }
              get().updateNode(node.id, { status: "success" });
              
              // Remove edge animation
              if (incomingEdge) {
                const updatedEdges = get().edges.map((e) =>
                  e.id === incomingEdge.id ? { ...e, animated: false } : e
                );
                set({ edges: updatedEdges });
              }
              resolve(undefined);
            }, delay);
          });

          // Check if we should stop (error occurred)
          const currentNode = get().nodes.find((n) => n.id === node.id);
          if (currentNode?.data.status === "error") {
            break;
          }
        }
      },

      applyAiSuggestion: (suggestedNodes, suggestedEdges) => {
        set({ nodes: suggestedNodes, edges: suggestedEdges });
        get().saveHistory();
      },

      saveHistory: () => {
        const { nodes, edges, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const previous = history[historyIndex - 1];
          set({
            nodes: previous.nodes,
            edges: previous.edges,
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          set({
            nodes: next.nodes,
            edges: next.edges,
            historyIndex: historyIndex + 1,
          });
        }
      },

      // AI Assistant methods
      focusNode: (nodeId: string) => {
        set({ selectedNodeId: nodeId });
        // Scroll to node in canvas (handled by React Flow)
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
        if (nodeElement) {
          nodeElement.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add highlight animation
          nodeElement.classList.add("ring-2", "ring-blue-400", "ring-opacity-50");
          setTimeout(() => {
            nodeElement.classList.remove("ring-2", "ring-blue-400", "ring-opacity-50");
          }, 2000);
        }
      },

      applyMutation: (newNodes: Node<NodeData>[], newEdges: Edge[]) => {
        set({ nodes: newNodes, edges: newEdges });
        get().saveHistory();
      },

      getNodeById: (id: string) => {
        return get().nodes.find((n) => n.id === id);
      },
    }),
    {
      name: "flow-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        templates: state.templates,
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);

// Topological sort helper
function topologicalSort(nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] {
  const inDegree = new Map<string, number>();
  const graph = new Map<string, string[]>();
  
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    graph.set(node.id, []);
  });
  
  edges.forEach((edge) => {
    const targetInDegree = inDegree.get(edge.target) || 0;
    inDegree.set(edge.target, targetInDegree + 1);
    
    const sourceChildren = graph.get(edge.source) || [];
    sourceChildren.push(edge.target);
    graph.set(edge.source, sourceChildren);
  });
  
  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });
  
  const sorted: Node<NodeData>[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      sorted.push(node);
    }
    
    const children = graph.get(nodeId) || [];
    children.forEach((childId) => {
      const childInDegree = inDegree.get(childId)! - 1;
      inDegree.set(childId, childInDegree);
      if (childInDegree === 0) {
        queue.push(childId);
      }
    });
  }
  
  return sorted;
}

