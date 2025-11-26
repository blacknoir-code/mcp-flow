import { useMemo } from "react";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { useFlowStore } from "@/stores/flowStore";
import { rewriteRules, RewriteSuggestion } from "@/data/mockRewriteRules";
import { TaskSpec } from "@/stores/regenerateStore";

export const useRegenerateAI = () => {
  const { nodes, edges } = useFlowStore();

  const parseIntent = (intent: string): TaskSpec => {
    const lowerIntent = intent.toLowerCase();
    const apps: string[] = [];
    const operations: string[] = [];
    const conditions: string[] = [];
    const entities: string[] = [];

    // Detect apps
    if (lowerIntent.includes("gmail") || lowerIntent.includes("email")) {
      apps.push("Gmail");
    }
    if (lowerIntent.includes("jira") || lowerIntent.includes("ticket")) {
      apps.push("Jira");
    }
    if (lowerIntent.includes("slack")) {
      apps.push("Slack");
    }
    if (lowerIntent.includes("notion")) {
      apps.push("Notion");
    }

    // Detect operations
    if (lowerIntent.includes("get") || lowerIntent.includes("fetch") || lowerIntent.includes("read")) {
      operations.push("read");
    }
    if (lowerIntent.includes("update") || lowerIntent.includes("modify") || lowerIntent.includes("change")) {
      operations.push("update");
    }
    if (lowerIntent.includes("create") || lowerIntent.includes("add") || lowerIntent.includes("new")) {
      operations.push("create");
    }
    if (lowerIntent.includes("delete") || lowerIntent.includes("remove")) {
      operations.push("delete");
    }
    if (lowerIntent.includes("post") || lowerIntent.includes("send") || lowerIntent.includes("notify")) {
      operations.push("send");
    }

    // Detect conditions
    if (lowerIntent.includes("unread")) {
      conditions.push("unread_only");
    }
    if (lowerIntent.includes("assigned to me") || lowerIntent.includes("my tickets")) {
      conditions.push("assigned_to_me");
    }
    if (lowerIntent.includes("urgent") || lowerIntent.includes("priority") || lowerIntent.includes("critical")) {
      conditions.push("high_priority");
    }
    if (lowerIntent.includes("mention") || lowerIntent.includes("mentioned")) {
      conditions.push("mentioned");
    }

    // Detect entities
    if (lowerIntent.includes("ticket") || lowerIntent.includes("jira")) {
      entities.push("ticket_ids");
    }
    if (lowerIntent.includes("email") || lowerIntent.includes("message")) {
      entities.push("emails");
    }
    if (lowerIntent.includes("summary") || lowerIntent.includes("summar")) {
      entities.push("summary");
    }

    return {
      apps,
      operations,
      conditions,
      entities,
    };
  };

  const generateAIRewrite = (
    intent: string,
    currentNodes: Node<NodeData>[],
    currentEdges: Edge[]
  ): {
    nodes: Node<NodeData>[];
    edges: Edge[];
    suggestions: RewriteSuggestion[];
    confidenceScore: number;
  } => {
    let rewrittenNodes = [...currentNodes];
    let rewrittenEdges = [...currentEdges];
    const suggestions: RewriteSuggestion[] = [];

    // Apply all matching rewrite rules
    for (const rule of rewriteRules) {
      if (rule.condition(intent, rewrittenNodes, rewrittenEdges)) {
        const result = rule.apply(intent, rewrittenNodes, rewrittenEdges);
        rewrittenNodes = result.nodes;
        rewrittenEdges = result.edges;
        suggestions.push(result.suggestion);
      }
    }

    // Calculate confidence score (mock)
    const confidenceScore = Math.min(95, 70 + suggestions.length * 5);

    return {
      nodes: rewrittenNodes,
      edges: rewrittenEdges,
      suggestions,
      confidenceScore,
    };
  };

  const computeDiff = (
    current: { nodes: Node<NodeData>[]; edges: Edge[] },
    rewritten: { nodes: Node<NodeData>[]; edges: Edge[] }
  ) => {
    const currentNodeIds = new Set(current.nodes.map((n) => n.id));
    const rewrittenNodeIds = new Set(rewritten.nodes.map((n) => n.id));

    const addedNodes = rewritten.nodes.filter((n) => !currentNodeIds.has(n.id));
    const removedNodes = current.nodes.filter((n) => !rewrittenNodeIds.has(n.id));

    const changedNodes = rewritten.nodes
      .filter((n) => {
        const oldNode = current.nodes.find((on) => on.id === n.id);
        if (!oldNode) return false;
        return JSON.stringify(oldNode.data) !== JSON.stringify(n.data);
      })
      .map((n) => {
        const oldNode = current.nodes.find((on) => on.id === n.id)!;
        return {
          nodeId: n.id,
          old: oldNode.data,
          new: n.data,
          paramDiffs: Object.keys(n.data.params || {}).filter(
            (key) => oldNode.data.params?.[key] !== n.data.params?.[key]
          ),
        };
      });

    const currentEdgeKeys = new Set(
      current.edges.map((e) => `${e.source}-${e.target}`)
    );
    const rewrittenEdgeKeys = new Set(
      rewritten.edges.map((e) => `${e.source}-${e.target}`)
    );

    const addedEdges = rewritten.edges.filter(
      (e) => !currentEdgeKeys.has(`${e.source}-${e.target}`)
    );
    const removedEdges = current.edges.filter(
      (e) => !rewrittenEdgeKeys.has(`${e.source}-${e.target}`)
    );

    return {
      addedNodes,
      removedNodes,
      changedNodes,
      addedEdges,
      removedEdges,
      summary: {
        nodesAdded: addedNodes.length,
        nodesRemoved: removedNodes.length,
        nodesModified: changedNodes.length,
        edgesAdded: addedEdges.length,
        edgesRemoved: removedEdges.length,
      },
    };
  };

  return {
    parseIntent,
    generateAIRewrite,
    computeDiff,
  };
};

