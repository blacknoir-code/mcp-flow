import { Node } from "reactflow";

export type NodeStatus = "idle" | "pending" | "running" | "success" | "error";

export interface NodeData {
  title: string;
  app: string;
  functionName?: string;
  params: Record<string, any>;
  status: NodeStatus;
  mockResponse?: any;
  error?: string;
}

export const createSampleNodes = (intent: string): Node<NodeData>[] => {
  const lowerIntent = intent.toLowerCase();
  
  // Default workflow for Gmail → Jira → Slack
  if (lowerIntent.includes("gmail") && lowerIntent.includes("jira") && lowerIntent.includes("slack")) {
    return [
      {
        id: "1",
        type: "cardNode",
        position: { x: 0, y: 0 },
        data: {
          title: "Get Unread Emails",
          app: "Gmail",
          functionName: "listEmails",
          params: { label: "inbox", unread: true },
          status: "idle",
          mockResponse: { emails: [{ id: "1", subject: "Ticket PROJ-123", body: "..." }] }
        }
      },
      {
        id: "2",
        type: "cardNode",
        position: { x: 300, y: 0 },
        data: {
          title: "Extract Ticket IDs",
          app: "Internal",
          functionName: "extractPattern",
          params: { pattern: "JIRA-\\d+|PROJ-\\d+" },
          status: "idle",
          mockResponse: { tickets: ["PROJ-123", "PROJ-124", "PROJ-125"] }
        }
      },
      {
        id: "3",
        type: "cardNode",
        position: { x: 600, y: 0 },
        data: {
          title: "Update Jira Tickets",
          app: "Jira",
          functionName: "updateTickets",
          params: { status: "In Progress" },
          status: "idle",
          mockResponse: { updated: 3, failed: 0 }
        }
      },
      {
        id: "4",
        type: "cardNode",
        position: { x: 900, y: 0 },
        data: {
          title: "Summarize Updates",
          app: "Internal",
          functionName: "summarize",
          params: { mode: "concise" },
          status: "idle",
          mockResponse: { summary: "Updated 3 tickets to In Progress" }
        }
      },
      {
        id: "5",
        type: "cardNode",
        position: { x: 1200, y: 0 },
        data: {
          title: "Post to Slack",
          app: "Slack",
          functionName: "postMessage",
          params: { channel: "#product-updates" },
          status: "idle",
          mockResponse: { messageId: "msg_123", channel: "#product-updates" }
        }
      }
    ];
  }
  
  // Simple Gmail workflow
  if (lowerIntent.includes("gmail") && !lowerIntent.includes("jira")) {
    return [
      {
        id: "1",
        type: "cardNode",
        position: { x: 0, y: 0 },
        data: {
          title: "Get Emails",
          app: "Gmail",
          functionName: "listEmails",
          params: { label: "inbox" },
          status: "idle"
        }
      },
      {
        id: "2",
        type: "cardNode",
        position: { x: 300, y: 0 },
        data: {
          title: "Process Emails",
          app: "Internal",
          functionName: "process",
          params: {},
          status: "idle"
        }
      }
    ];
  }
  
  // Default simple workflow
  return [
    {
      id: "1",
      type: "cardNode",
      position: { x: 0, y: 0 },
      data: {
        title: "Start",
        app: "Internal",
        functionName: "start",
        params: {},
        status: "idle"
      }
    }
  ];
};

export const createSampleEdges = (nodeIds: string[]) => {
  const edges = [];
  for (let i = 0; i < nodeIds.length - 1; i++) {
    edges.push({
      id: `e${nodeIds[i]}-${nodeIds[i + 1]}`,
      source: nodeIds[i],
      target: nodeIds[i + 1],
      type: "smoothstep",
      animated: false
    });
  }
  return edges;
};

