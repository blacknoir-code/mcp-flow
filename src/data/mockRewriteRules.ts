import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { v4 as uuidv4 } from "uuid";

export interface RewriteSuggestion {
  id: string;
  title: string;
  explanation: string;
  type: "add" | "modify" | "remove" | "merge" | "reorder";
  affectedNodes?: string[];
  preview?: { nodes: Node<NodeData>[]; edges: Edge[] };
}

export interface RewriteRule {
  condition: (intent: string, nodes: Node<NodeData>[], edges: Edge[]) => boolean;
  apply: (intent: string, nodes: Node<NodeData>[], edges: Edge[]) => {
    nodes: Node<NodeData>[];
    edges: Edge[];
    suggestion: RewriteSuggestion;
  };
}

export const rewriteRules: RewriteRule[] = [
  // Rule 1: Add filter for "assigned to me"
  {
    condition: (intent, nodes, edges) => {
      const lowerIntent = intent.toLowerCase();
      return (
        lowerIntent.includes("assigned to me") ||
        lowerIntent.includes("my tickets") ||
        lowerIntent.includes("assigned to")
      );
    },
    apply: (intent, nodes, edges) => {
      const filterNode: Node<NodeData> = {
        id: uuidv4(),
        type: "cardNode",
        position: { x: 300, y: 100 },
        data: {
          title: "Filter Assigned to Me",
          app: "Internal",
          functionName: "filter_assigned",
          params: {
            assignee: "me",
            field: "assignee",
          },
          status: "idle",
        },
      };

      // Insert after first extraction node or before first update node
      const extractionNode = nodes.find((n) =>
        n.data.functionName?.toLowerCase().includes("extract")
      );
      const insertIndex = extractionNode
        ? nodes.findIndex((n) => n.id === extractionNode.id) + 1
        : 1;

      const newNodes = [
        ...nodes.slice(0, insertIndex),
        filterNode,
        ...nodes.slice(insertIndex),
      ];

      // Add edge from extraction to filter, filter to next node
      const newEdges: Edge[] = [...edges];
      if (extractionNode) {
        newEdges.push({
          id: uuidv4(),
          source: extractionNode.id,
          target: filterNode.id,
        });
        const nextNode = nodes[insertIndex];
        if (nextNode) {
          newEdges.push({
            id: uuidv4(),
            source: filterNode.id,
            target: nextNode.id,
          });
          // Remove old edge if exists
          const oldEdgeIndex = newEdges.findIndex(
            (e) => e.source === extractionNode.id && e.target === nextNode.id
          );
          if (oldEdgeIndex >= 0) {
            newEdges.splice(oldEdgeIndex, 1);
          }
        }
      }

      return {
        nodes: newNodes,
        edges: newEdges,
        suggestion: {
          id: uuidv4(),
          title: "Add Filter: Assigned to Me",
          explanation: "Inserted a filter node to only process items assigned to you",
          type: "add",
          affectedNodes: [filterNode.id],
        },
      };
    },
  },

  // Rule 2: Add summarization step
  {
    condition: (intent, nodes, edges) => {
      const lowerIntent = intent.toLowerCase();
      return (
        (lowerIntent.includes("summary") ||
          lowerIntent.includes("summarise") ||
          lowerIntent.includes("summarize")) &&
        !nodes.some((n) =>
          n.data.functionName?.toLowerCase().includes("summar")
        )
      );
    },
    apply: (intent, nodes, edges) => {
      const summaryNode: Node<NodeData> = {
        id: uuidv4(),
        type: "cardNode",
        position: { x: 900, y: 100 },
        data: {
          title: "Summarize Updates",
          app: "Internal",
          functionName: "summarize_updates",
          params: {
            mode: "concise",
          },
          status: "idle",
        },
      };

      // Insert before last node (usually Slack)
      const lastNode = nodes[nodes.length - 1];
      const insertIndex = nodes.length - 1;

      const newNodes = [...nodes.slice(0, insertIndex), summaryNode, lastNode];

      const newEdges: Edge[] = [...edges];
      if (nodes.length > 1) {
        const prevNode = nodes[insertIndex - 1];
        newEdges.push({
          id: uuidv4(),
          source: prevNode.id,
          target: summaryNode.id,
        });
        newEdges.push({
          id: uuidv4(),
          source: summaryNode.id,
          target: lastNode.id,
        });
        // Remove old edge
        const oldEdgeIndex = newEdges.findIndex(
          (e) => e.source === prevNode.id && e.target === lastNode.id
        );
        if (oldEdgeIndex >= 0) {
          newEdges.splice(oldEdgeIndex, 1);
        }
      }

      return {
        nodes: newNodes,
        edges: newEdges,
        suggestion: {
          id: uuidv4(),
          title: "Add Summarization Step",
          explanation: "Inserted a summarization node before posting to Slack",
          type: "add",
          affectedNodes: [summaryNode.id],
        },
      };
    },
  },

  // Rule 3: Merge adjacent transform steps
  {
    condition: (intent, nodes, edges) => {
      for (let i = 0; i < nodes.length - 1; i++) {
        const current = nodes[i];
        const next = nodes[i + 1];
        if (
          current.data.app === "Internal" &&
          next.data.app === "Internal" &&
          (current.data.functionName?.includes("extract") ||
            current.data.functionName?.includes("transform")) &&
          (next.data.functionName?.includes("extract") ||
            next.data.functionName?.includes("transform"))
        ) {
          return true;
        }
      }
      return false;
    },
    apply: (intent, nodes, edges) => {
      let merged = false;
      const newNodes = [...nodes];
      const newEdges = [...edges];

      for (let i = 0; i < newNodes.length - 1; i++) {
        const current = newNodes[i];
        const next = newNodes[i + 1];
        if (
          current.data.app === "Internal" &&
          next.data.app === "Internal" &&
          (current.data.functionName?.includes("extract") ||
            current.data.functionName?.includes("transform")) &&
          (next.data.functionName?.includes("extract") ||
            next.data.functionName?.includes("transform"))
        ) {
          // Merge into single node
          const mergedNode: Node<NodeData> = {
            ...current,
            id: current.id,
            data: {
              ...current.data,
              title: `${current.data.title} & ${next.data.title}`,
              functionName: "extract_and_transform",
              params: {
                ...current.data.params,
                ...next.data.params,
              },
            },
          };

          newNodes.splice(i, 2, mergedNode);
          // Update edges
          const edgesToRemove = newEdges.filter(
            (e) => e.source === current.id || e.target === current.id || e.source === next.id || e.target === next.id
          );
          edgesToRemove.forEach((e) => {
            const index = newEdges.indexOf(e);
            if (index >= 0) newEdges.splice(index, 1);
          });

          // Add new edges
          const prevNode = newNodes[i - 1];
          const nextNode = newNodes[i + 1];
          if (prevNode) {
            newEdges.push({
              id: uuidv4(),
              source: prevNode.id,
              target: mergedNode.id,
            });
          }
          if (nextNode) {
            newEdges.push({
              id: uuidv4(),
              source: mergedNode.id,
              target: nextNode.id,
            });
          }

          merged = true;
          break;
        }
      }

      return {
        nodes: newNodes,
        edges: newEdges,
        suggestion: {
          id: uuidv4(),
          title: "Merge Adjacent Transform Steps",
          explanation: "Merged two adjacent transform steps into a single node for efficiency",
          type: "merge",
          affectedNodes: merged ? [newNodes.find((n) => n.data.functionName === "extract_and_transform")?.id || ""] : [],
        },
      };
    },
  },

  // Rule 4: Add default channel to Slack
  {
    condition: (intent, nodes, edges) => {
      const slackNode = nodes.find((n) => n.data.app === "Slack");
      return slackNode && !slackNode.data.params?.channel;
    },
    apply: (intent, nodes, edges) => {
      const newNodes = nodes.map((node) => {
        if (node.data.app === "Slack" && !node.data.params?.channel) {
          return {
            ...node,
            data: {
              ...node.data,
              params: {
                ...node.data.params,
                channel: "#product-updates",
              },
            },
          };
        }
        return node;
      });

      return {
        nodes: newNodes,
        edges,
        suggestion: {
          id: uuidv4(),
          title: "Add Default Slack Channel",
          explanation: "Added default channel parameter to Slack step",
          type: "modify",
          affectedNodes: newNodes.filter((n) => n.data.app === "Slack").map((n) => n.id),
        },
      };
    },
  },

  // Rule 5: Add error handling wrapper
  {
    condition: (intent, nodes, edges) => {
      return nodes.some(
        (n) =>
          n.data.app === "Jira" &&
          n.data.functionName?.toLowerCase().includes("update") &&
          !nodes.some((n2) => n2.data.functionName?.includes("error"))
      );
    },
    apply: (intent, nodes, edges) => {
      const jiraNode = nodes.find(
        (n) =>
          n.data.app === "Jira" &&
          n.data.functionName?.toLowerCase().includes("update")
      );
      if (!jiraNode) {
        return { nodes, edges, suggestion: { id: uuidv4(), title: "", explanation: "", type: "modify" } };
      }

      const errorHandlerNode: Node<NodeData> = {
        id: uuidv4(),
        type: "cardNode",
        position: { x: jiraNode.position.x, y: jiraNode.position.y + 150 },
        data: {
          title: "Error Handler",
          app: "Internal",
          functionName: "error_handler",
          params: {
            retryPolicy: { attempts: 3, strategy: "exponential" },
          },
          status: "idle",
        },
      };

      const jiraIndex = nodes.indexOf(jiraNode);
      const newNodes = [
        ...nodes.slice(0, jiraIndex + 1),
        errorHandlerNode,
        ...nodes.slice(jiraIndex + 1),
      ];

      const newEdges = [...edges];
      // Add edge from Jira to error handler
      newEdges.push({
        id: uuidv4(),
        source: jiraNode.id,
        target: errorHandlerNode.id,
      });

      // Update next node's edge
      const nextNode = nodes[jiraIndex + 1];
      if (nextNode) {
        const oldEdgeIndex = newEdges.findIndex(
          (e) => e.source === jiraNode.id && e.target === nextNode.id
        );
        if (oldEdgeIndex >= 0) {
          newEdges[oldEdgeIndex] = {
            ...newEdges[oldEdgeIndex],
            source: errorHandlerNode.id,
          };
        }
      }

      return {
        nodes: newNodes,
        edges: newEdges,
        suggestion: {
          id: uuidv4(),
          title: "Add Error Handling",
          explanation: "Added error-handling wrapper for Jira update step",
          type: "add",
          affectedNodes: [errorHandlerNode.id],
        },
      };
    },
  },

  // Rule 6: Add priority filter for "urgent"
  {
    condition: (intent, nodes, edges) => {
      const lowerIntent = intent.toLowerCase();
      return (
        lowerIntent.includes("urgent") ||
        lowerIntent.includes("priority") ||
        lowerIntent.includes("critical")
      );
    },
    apply: (intent, nodes, edges) => {
      const priorityFilterNode: Node<NodeData> = {
        id: uuidv4(),
        type: "cardNode",
        position: { x: 300, y: 100 },
        data: {
          title: "Filter by Priority",
          app: "Internal",
          functionName: "filter_priority",
          params: {
            priority: "high",
            field: "priority",
          },
          status: "idle",
        },
      };

      // Insert after first node
      const newNodes = [nodes[0], priorityFilterNode, ...nodes.slice(1)];

      const newEdges: Edge[] = [
        {
          id: uuidv4(),
          source: nodes[0].id,
          target: priorityFilterNode.id,
        },
        {
          id: uuidv4(),
          source: priorityFilterNode.id,
          target: nodes[1]?.id || nodes[0].id,
        },
        ...edges.slice(1),
      ];

      return {
        nodes: newNodes,
        edges: newEdges,
        suggestion: {
          id: uuidv4(),
          title: "Add Priority Filter",
          explanation: "Inserted a priority filter for urgent items",
          type: "add",
          affectedNodes: [priorityFilterNode.id],
        },
      };
    },
  },
];

