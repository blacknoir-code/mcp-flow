import { useState, useCallback } from "react";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { TaskSpec, Suggestion, Conflict, parseIntent, keywordMappings } from "@/data/mockTaskSpecs";
import { v4 as uuidv4 } from "uuid";

export const useAiAssistant = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [taskSpec, setTaskSpec] = useState<TaskSpec | null>(null);

  const parseIntentText = useCallback((intentText: string): TaskSpec => {
    const spec = parseIntent(intentText);
    setTaskSpec(spec);
    return spec;
  }, []);

  const generateSuggestions = useCallback((
    taskSpec: TaskSpec,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const lowerIntent = taskSpec.intent.toLowerCase();

    // Suggestion 1: Add filter for "assigned to me"
    if (lowerIntent.includes("assigned to me") || lowerIntent.includes("my")) {
      const hasFilter = nodes.some(
        (n) => n.data.functionName === "filter" && n.data.params?.assignee === "me"
      );
      if (!hasFilter) {
        const extractNode = nodes.find((n) => n.data.functionName === "extractPattern");
        if (extractNode) {
          suggestions.push({
            id: uuidv4(),
            type: "add_filter",
            title: "Add filter: only tickets assigned to me",
            explanation: "Detected 'assigned to me' in intent. Add a filter node to process only your assigned tickets.",
            impact: "Saves 30% processing time",
            affectedNodeIds: [extractNode.id],
            rule: "Keyword: 'assigned to me'",
          });
        }
      }
    }

    // Suggestion 2: Merge consecutive transform nodes
    const transformNodes = nodes.filter(
      (n) => n.data.app === "Internal" && (n.data.functionName?.includes("extract") || n.data.functionName?.includes("transform"))
    );
    if (transformNodes.length >= 2) {
      const consecutive = transformNodes.slice(0, 2);
      const hasEdge = edges.some(
        (e) => e.source === consecutive[0].id && e.target === consecutive[1].id
      );
      if (hasEdge) {
        suggestions.push({
          id: uuidv4(),
          type: "merge",
          title: "Merge 'Extract IDs' + 'Update Tickets' into single 'Bulk Update' node",
          explanation: "Two consecutive transform nodes can be merged into a single operation for better performance.",
          impact: "Reduces execution time by 40%",
          affectedNodeIds: consecutive.map((n) => n.id),
          rule: "Two consecutive transform nodes detected",
        });
      }
    }

    // Suggestion 3: Add summary step before Slack
    if (lowerIntent.includes("summary") || lowerIntent.includes("summar")) {
      const slackNode = nodes.find((n) => n.data.app === "Slack");
      const hasSummarizer = nodes.some((n) => n.data.functionName === "summarize");
      if (slackNode && !hasSummarizer) {
        suggestions.push({
          id: uuidv4(),
          type: "add_summary",
          title: "Add summary step before posting to Slack",
          explanation: "Detected 'summary' in intent. Add a summarization node to condense information before posting.",
          impact: "Improves message clarity",
          affectedNodeIds: [slackNode.id],
          rule: "Keyword: 'summary'",
        });
      }
    }

    // Suggestion 4: Add retry policy
    const jiraNodes = nodes.filter((n) => n.data.app === "Jira" && !n.data.params?.retryPolicy);
    if (jiraNodes.length > 0) {
      suggestions.push({
        id: uuidv4(),
        type: "add_retry",
        title: `Add retry policy to '${jiraNodes[0].data.title}' node`,
        explanation: "Jira operations can fail due to network issues. Adding a retry policy (3 attempts) improves reliability.",
        impact: "Reduces failure rate by 60%",
        affectedNodeIds: jiraNodes.map((n) => n.id),
        rule: "Jira node without retry policy",
      });
    }

    // Suggestion 5: Add group by if mentioned
    if (lowerIntent.includes("group by")) {
      const hasGroupBy = nodes.some((n) => n.data.functionName === "groupBy");
      if (!hasGroupBy) {
        suggestions.push({
          id: uuidv4(),
          type: "add",
          title: "Add 'Group by Project' node",
          explanation: "Detected 'group by' in intent. Add a grouping node to organize data by project.",
          impact: "Better data organization",
          affectedNodeIds: [],
          rule: "Keyword: 'group by'",
        });
      }
    }

    setSuggestions(suggestions);
    return suggestions;
  }, []);

  const detectConflicts = useCallback((nodes: Node<NodeData>[], edges: Edge[]): Conflict[] => {
    const conflicts: Conflict[] = [];

    // Check for missing required params
    nodes.forEach((node) => {
      if (node.data.app === "Jira" && !node.data.params?.project) {
        conflicts.push({
          id: uuidv4(),
          type: "missing_param",
          severity: "error",
          message: `Missing required parameter 'project' in '${node.data.title}'`,
          affectedNodeIds: [node.id],
          resolveAction: {
            type: "auto_fill",
            value: { project: "PROJ" },
          },
        });
      }
      if (node.data.app === "Slack" && !node.data.params?.channel) {
        conflicts.push({
          id: uuidv4(),
          type: "missing_param",
          severity: "warning",
          message: `Missing recommended parameter 'channel' in '${node.data.title}'`,
          affectedNodeIds: [node.id],
          resolveAction: {
            type: "auto_fill",
            value: { channel: "#general" },
          },
        });
      }
      if (node.data.app === "Gmail" && !node.data.params?.label) {
        conflicts.push({
          id: uuidv4(),
          type: "missing_param",
          severity: "warning",
          message: `Missing recommended parameter 'label' in '${node.data.title}'`,
          affectedNodeIds: [node.id],
          resolveAction: {
            type: "auto_fill",
            value: { label: "inbox" },
          },
        });
      }
    });

    // Check for broken edges
    edges.forEach((edge) => {
      const sourceExists = nodes.some((n) => n.id === edge.source);
      const targetExists = nodes.some((n) => n.id === edge.target);
      if (!sourceExists || !targetExists) {
        conflicts.push({
          id: uuidv4(),
          type: "broken_edge",
          severity: "error",
          message: `Edge connects to non-existent node: ${!sourceExists ? edge.source : edge.target}`,
          affectedNodeIds: [edge.source, edge.target].filter((id) => id),
          resolveAction: {
            type: "remove_edge",
          },
        });
      }
    });

    // Check for cycles (simple detection)
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const hasCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);
      recStack.add(nodeId);
      const outgoingEdges = edges.filter((e) => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true;
      }
      recStack.delete(nodeId);
      return false;
    };
    nodes.forEach((node) => {
      if (hasCycle(node.id)) {
        conflicts.push({
          id: uuidv4(),
          type: "cycle",
          severity: "error",
          message: `Cycle detected in workflow graph starting from '${node.data.title}'`,
          affectedNodeIds: [node.id],
        });
      }
    });

    setConflicts(conflicts);
    return conflicts;
  }, []);

  const mockRegenerate = useCallback((
    intent: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ): { nodes: Node<NodeData>[]; edges: Edge[]; suggestions: Suggestion[]; confidence: number } => {
    const taskSpec = parseIntent(intent);
    let newNodes = [...nodes];
    let newEdges = [...edges];
    const lowerIntent = intent.toLowerCase();

    // Rule 1: If "assigned to me", insert filter node
    if (lowerIntent.includes("assigned to me")) {
      const extractNode = newNodes.find((n) => n.data.functionName === "extractPattern");
      if (extractNode) {
        const filterNode: Node<NodeData> = {
          id: uuidv4(),
          type: "cardNode",
          position: {
            x: extractNode.position.x + 50,
            y: extractNode.position.y + 100,
          },
          data: {
            title: "Filter by Assignee",
            app: "Internal",
            functionName: "filter",
            params: { field: "assignee", value: "me" },
            status: "idle",
          },
        };
        const insertIndex = newNodes.findIndex((n) => n.id === extractNode.id) + 1;
        newNodes.splice(insertIndex, 0, filterNode);
        // Update edges
        const edgeToUpdate = newEdges.find((e) => e.target === extractNode.id);
        if (edgeToUpdate) {
          edgeToUpdate.target = filterNode.id;
          newEdges.push({
            id: uuidv4(),
            source: filterNode.id,
            target: extractNode.id,
            type: "smoothstep",
          });
        }
      }
    }

    // Rule 2: If "summary", add summarizer before Slack
    if (lowerIntent.includes("summary") || lowerIntent.includes("summar")) {
      const slackNode = newNodes.find((n) => n.data.app === "Slack");
      const hasSummarizer = newNodes.some((n) => n.data.functionName === "summarize");
      if (slackNode && !hasSummarizer) {
        const summaryNode: Node<NodeData> = {
          id: uuidv4(),
          type: "cardNode",
          position: {
            x: slackNode.position.x - 300,
            y: slackNode.position.y,
          },
          data: {
            title: "Generate Summary",
            app: "Internal",
            functionName: "summarize",
            params: { mode: "concise" },
            status: "idle",
          },
        };
        const slackIndex = newNodes.findIndex((n) => n.id === slackNode.id);
        newNodes.splice(slackIndex, 0, summaryNode);
        // Update edges
        const edgeToSlack = newEdges.find((e) => e.target === slackNode.id);
        if (edgeToSlack) {
          edgeToSlack.target = summaryNode.id;
          newEdges.push({
            id: uuidv4(),
            source: summaryNode.id,
            target: slackNode.id,
            type: "smoothstep",
          });
        }
      }
    }

    // Rule 3: Merge duplicate transforms
    const transformNodes = newNodes.filter(
      (n) => n.data.app === "Internal" && n.data.functionName?.includes("extract")
    );
    if (transformNodes.length > 1) {
      const toMerge = transformNodes.slice(0, 2);
      const mergedNode: Node<NodeData> = {
        id: uuidv4(),
        type: "cardNode",
        position: toMerge[0].position,
        data: {
          title: "Extract and Process",
          app: "Internal",
          functionName: "extractAndProcess",
          params: { ...toMerge[0].data.params, ...toMerge[1].data.params },
          status: "idle",
        },
      };
      // Remove merged nodes
      newNodes.splice(
        newNodes.findIndex((n) => n.id === toMerge[0].id),
        1
      );
      newNodes.splice(
        newNodes.findIndex((n) => n.id === toMerge[1].id),
        1
      );
      newNodes.push(mergedNode);
      // Update edges
      newEdges = newEdges.filter(
        (e) => e.source !== toMerge[0].id && e.source !== toMerge[1].id && e.target !== toMerge[0].id && e.target !== toMerge[1].id
      );
    }

    const suggestions = generateSuggestions(taskSpec, newNodes, newEdges);
    return {
      nodes: newNodes,
      edges: newEdges,
      suggestions,
      confidence: taskSpec.confidence,
    };
  }, [generateSuggestions]);

  return {
    taskSpec,
    suggestions,
    conflicts,
    parseIntentText,
    generateSuggestions,
    detectConflicts,
    mockRegenerate,
  };
};
