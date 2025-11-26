import { useMemo } from "react";
import { Node } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { useFlowStore } from "@/stores/flowStore";
import { useExecutionStore } from "@/stores/executionStore";
import { mockResponses, mockSchemas, defaultParams } from "@/data/mockResponses";

export const useCardDetails = (nodeId: string | null) => {
  const node = useFlowStore((state) => 
    nodeId ? state.getNodeById(nodeId) : undefined
  );
  const { runs } = useExecutionStore();

  const executionData = useMemo(() => {
    if (!nodeId) return null;

    // Find latest execution for this node
    for (const run of runs) {
      const nodeExecution = run.nodes.find((n) => n.nodeId === nodeId);
      if (nodeExecution) {
        return {
          status: nodeExecution.status,
          duration: nodeExecution.duration,
          mockResponse: nodeExecution.mockResponse,
          error: nodeExecution.error,
          events: nodeExecution.events,
          retryCount: nodeExecution.retryCount,
          retryHistory: nodeExecution.retryHistory,
          startTime: nodeExecution.startTime,
          endTime: nodeExecution.endTime,
        };
      }
    }
    return null;
  }, [nodeId, runs]);

  const schema = useMemo(() => {
    if (!node) return null;
    const functionName = node.data.functionName || "";
    const key = functionName.toLowerCase().replace(/\s+/g, "_");
    
    for (const [schemaKey, schemaData] of Object.entries(mockSchemas)) {
      if (key.includes(schemaKey) || schemaKey.includes(key)) {
        return schemaData;
      }
    }
    
    // Default schema
    return {
      name: functionName || "unknown",
      description: "MCP function",
      inputs: {},
      outputs: {},
      idempotent: false,
      rateLimit: "N/A",
      authScopes: [],
    };
  }, [node]);

  const suggestDefaults = (node: Node<NodeData>) => {
    const functionName = node.data.functionName || "";
    const key = functionName.toLowerCase().replace(/\s+/g, "_");
    
    for (const [defaultKey, defaults] of Object.entries(defaultParams)) {
      if (key.includes(defaultKey) || defaultKey.includes(key)) {
        return defaults;
      }
    }
    
    return {};
  };

  const getMockResponse = (node: Node<NodeData>) => {
    const functionName = node.data.functionName || "";
    const key = functionName.toLowerCase().replace(/\s+/g, "_");
    
    for (const [mockKey, response] of Object.entries(mockResponses)) {
      if (key.includes(mockKey) || mockKey.includes(key)) {
        return response;
      }
    }
    
    return { success: true, data: "Mock execution completed" };
  };

  const getExecutionMetrics = () => {
    if (!nodeId) return null;

    const nodeRuns = runs
      .flatMap((run) => run.nodes.filter((n) => n.nodeId === nodeId))
      .filter((n) => n.endTime); // Only completed runs

    if (nodeRuns.length === 0) return null;

    const durations = nodeRuns
      .map((n) => n.duration || 0)
      .filter((d) => d > 0);
    
    const successes = nodeRuns.filter((n) => n.status === "success").length;
    const errors = nodeRuns.filter((n) => n.status === "error").length;
    
    const avgDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;
    
    const successRate = nodeRuns.length > 0
      ? (successes / nodeRuns.length) * 100
      : 0;
    
    const lastError = nodeRuns
      .filter((n) => n.status === "error")
      .sort((a, b) => (b.endTime || "").localeCompare(a.endTime || ""))[0];

    return {
      totalRuns: nodeRuns.length,
      avgDuration: Math.round(avgDuration),
      successRate: Math.round(successRate),
      lastError: lastError?.error || null,
      durations: durations.slice(-10), // Last 10 for sparkline
    };
  };

  return {
    node,
    executionData,
    schema,
    suggestDefaults,
    getMockResponse,
    getExecutionMetrics,
  };
};

