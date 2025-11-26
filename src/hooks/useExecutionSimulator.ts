import { useCallback } from "react";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/data/sampleNodes";
import { useExecutionStore } from "@/stores/executionStore";
import { useFlowStore } from "@/stores/flowStore";
import { mockResponses, mockLogs } from "@/data/sampleRunEvents";
import { ExecutionEvent } from "@/stores/executionStore";

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

export const useExecutionSimulator = () => {
  const { startRun, addEvent, updateNodeStatus, completeRun, cancelRun } = useExecutionStore();
  const { nodes, edges, updateNode, focusNode } = useFlowStore();

  const getMockResponse = (node: Node<NodeData>): any => {
    const functionName = node.data.functionName || "";
    const key = functionName.toLowerCase().replace(/\s+/g, "_");
    
    // Try to find matching mock response
    for (const [mockKey, response] of Object.entries(mockResponses)) {
      if (key.includes(mockKey) || mockKey.includes(key)) {
        return response;
      }
    }
    
    // Default response based on app
    if (node.data.app === "Gmail") {
      return mockResponses.get_unread_emails;
    } else if (node.data.app === "Jira") {
      return mockResponses.update_jira_ticket;
    } else if (node.data.app === "Slack") {
      return mockResponses.post_to_slack;
    }
    
    return { success: true, data: "Mock execution completed" };
  };

  const getMockLogs = (node: Node<NodeData>): string[] => {
    const functionName = node.data.functionName || "";
    const key = functionName.toLowerCase().replace(/\s+/g, "_");
    
    for (const [mockKey, logs] of Object.entries(mockLogs)) {
      if (key.includes(mockKey) || mockKey.includes(key)) {
        return logs;
      }
    }
    
    return [
      `[INFO] Executing ${node.data.title}...`,
      `[INFO] Processing data...`,
      `[SUCCESS] ${node.data.title} completed successfully`
    ];
  };

  const runWorkflow = useCallback(async (workflowName: string = "Workflow") => {
    const sortedNodes = topologicalSort(nodes, edges);
    if (sortedNodes.length === 0) return;

    const nodeIds = sortedNodes.map((n) => n.id);
    const runId = startRun(workflowName, nodeIds);

    // Update node titles and apps in execution store
    sortedNodes.forEach((node) => {
      updateNodeStatus(runId, node.id, "pending", {
        nodeTitle: node.data.title,
        app: node.data.app,
      });
    });

    // Execute nodes in order
    for (const node of sortedNodes) {
      // Check if run was cancelled
      const { currentRun } = useExecutionStore.getState();
      if (!currentRun || currentRun.runId !== runId) break;

      // Focus node on canvas
      focusNode(node.id);

      // Start node
      updateNodeStatus(runId, node.id, "running");
      addEvent(runId, {
        nodeId: node.id,
        type: "node_started",
      });

      // Emit logs
      const logs = getMockLogs(node);
      for (const log of logs) {
        addEvent(runId, {
          nodeId: node.id,
          type: "node_log",
          log,
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Simulate execution delay
      const delay = 700 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Check for error
      if (node.data.error || node.data.mockError) {
        const errorMsg = node.data.error || "Mock error occurred";
        updateNodeStatus(runId, node.id, "error", {
          error: errorMsg,
        });
        addEvent(runId, {
          nodeId: node.id,
          type: "node_error",
          error: errorMsg,
        });

        // Check retry policy
        const retryPolicy = node.data.params?.retryPolicy;
        if (retryPolicy && retryPolicy > 0) {
          for (let attempt = 1; attempt <= retryPolicy; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Backoff
            
            addEvent(runId, {
              nodeId: node.id,
              type: "node_retry",
              retryAttempt: attempt,
            });

            // Retry (deterministic: 3rd attempt succeeds)
            if (attempt === 3) {
              const mockResponse = getMockResponse(node);
              updateNodeStatus(runId, node.id, "success", {
                mockResponse,
                retryAttempt: attempt,
              });
              addEvent(runId, {
                nodeId: node.id,
                type: "node_success",
                data: mockResponse,
              });
              break;
            } else {
              updateNodeStatus(runId, node.id, "error", {
                error: `Retry ${attempt} failed`,
                retryAttempt: attempt,
              });
            }
          }
        }
      } else {
        // Success
        const mockResponse = getMockResponse(node);
        updateNodeStatus(runId, node.id, "success", {
          mockResponse,
        });
        addEvent(runId, {
          nodeId: node.id,
          type: "node_success",
          data: mockResponse,
        });

        // Update node in flowStore
        updateNode(node.id, { mockResponse, status: "success" });
      }
    }

    completeRun(runId);
  }, [nodes, edges, startRun, addEvent, updateNodeStatus, completeRun, updateNode, focusNode]);

  const runStepOnly = useCallback(async (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const runId = startRun(`Run Step: ${node.data.title}`, [nodeId]);
    
    updateNodeStatus(runId, nodeId, "pending", {
      nodeTitle: node.data.title,
      app: node.data.app,
    });

    focusNode(nodeId);
    updateNodeStatus(runId, nodeId, "running");
    addEvent(runId, {
      nodeId,
      type: "node_started",
    });

    const logs = getMockLogs(node);
    for (const log of logs) {
      addEvent(runId, {
        nodeId,
        type: "node_log",
        log,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (node.data.error || node.data.mockError) {
      const errorMsg = node.data.error || "Mock error occurred";
      updateNodeStatus(runId, nodeId, "error", { error: errorMsg });
      addEvent(runId, {
        nodeId,
        type: "node_error",
        error: errorMsg,
      });
    } else {
      const mockResponse = getMockResponse(node);
      updateNodeStatus(runId, nodeId, "success", { mockResponse });
      addEvent(runId, {
        nodeId,
        type: "node_success",
        data: mockResponse,
      });
      updateNode(nodeId, { mockResponse, status: "success" });
    }

    completeRun(runId);
  }, [nodes, startRun, addEvent, updateNodeStatus, completeRun, updateNode, focusNode]);

  const retryFailedStep = useCallback(async (runId: string, nodeId: string) => {
    const { getNodeExecution } = useExecutionStore.getState();
    const nodeExecution = getNodeExecution(runId, nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    
    if (!node || !nodeExecution) return;

    const retryAttempt = (nodeExecution.retryCount || 0) + 1;

    updateNodeStatus(runId, nodeId, "running");
    addEvent(runId, {
      nodeId,
      type: "node_retry",
      retryAttempt,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000 * retryAttempt));

    // Deterministic: retry succeeds on 2nd attempt
    if (retryAttempt >= 2) {
      const mockResponse = getMockResponse(node);
      updateNodeStatus(runId, nodeId, "success", {
        mockResponse,
        retryAttempt,
      });
      addEvent(runId, {
        nodeId,
        type: "node_success",
        data: mockResponse,
      });
      updateNode(nodeId, { mockResponse, status: "success" });
    } else {
      updateNodeStatus(runId, nodeId, "error", {
        error: `Retry ${retryAttempt} failed`,
        retryAttempt,
      });
    }
  }, [nodes, addEvent, updateNodeStatus, updateNode]);

  return {
    runWorkflow,
    runStepOnly,
    retryFailedStep,
    cancelRun,
  };
};

