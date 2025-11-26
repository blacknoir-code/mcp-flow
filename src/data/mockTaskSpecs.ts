import { Node, Edge } from "reactflow";
import { NodeData } from "./sampleNodes";

export interface TaskSpec {
  intent: string;
  detectedApps: string[];
  operations: string[];
  entities: string[];
  constraints: string[];
  keywords: string[];
  confidence: number;
}

export interface Suggestion {
  id: string;
  type: "add" | "merge" | "modify" | "add_filter" | "add_retry" | "add_summary";
  title: string;
  explanation: string;
  impact: string;
  affectedNodeIds: string[];
  preview?: {
    nodes: Node<NodeData>[];
    edges: Edge[];
  };
  rule?: string; // Which keyword/rule triggered this
}

export interface Conflict {
  id: string;
  type: "missing_param" | "broken_edge" | "cycle" | "type_mismatch";
  severity: "error" | "warning";
  message: string;
  affectedNodeIds: string[];
  resolveAction?: {
    type: "auto_fill" | "add_converter" | "remove_edge";
    value?: any;
  };
}

// Keyword mapping rules
export const keywordMappings: Record<string, any> = {
  unread: { param: "unread", value: true, targetApp: "Gmail" },
  "assigned to me": { action: "add_filter", field: "assignee", value: "me" },
  summary: { action: "add_summarizer" },
  "group by": { action: "add_groupby" },
  retry: { action: "add_retry", value: 3 },
  jira: { app: "Jira" },
  gmail: { app: "Gmail" },
  slack: { app: "Slack" },
  ticket: { entity: "ticket" },
  email: { entity: "email" },
  message: { entity: "message" },
};

export const parseIntent = (intentText: string): TaskSpec => {
  const lowerIntent = intentText.toLowerCase();
  const detectedApps: string[] = [];
  const operations: string[] = [];
  const entities: string[] = [];
  const constraints: string[] = [];
  const keywords: string[] = [];

  // Detect apps
  if (lowerIntent.includes("gmail")) detectedApps.push("Gmail");
  if (lowerIntent.includes("jira")) detectedApps.push("Jira");
  if (lowerIntent.includes("slack")) detectedApps.push("Slack");

  // Detect operations
  if (lowerIntent.includes("get") || lowerIntent.includes("fetch") || lowerIntent.includes("read")) {
    operations.push("Fetch");
  }
  if (lowerIntent.includes("update") || lowerIntent.includes("modify") || lowerIntent.includes("change")) {
    operations.push("Update");
  }
  if (lowerIntent.includes("create") || lowerIntent.includes("add") || lowerIntent.includes("new")) {
    operations.push("Create");
  }
  if (lowerIntent.includes("post") || lowerIntent.includes("send") || lowerIntent.includes("notify")) {
    operations.push("Send");
  }
  if (lowerIntent.includes("extract") || lowerIntent.includes("parse")) {
    operations.push("Extract");
  }
  if (lowerIntent.includes("filter")) {
    operations.push("Filter");
  }
  if (lowerIntent.includes("summar") || lowerIntent.includes("summary")) {
    operations.push("Summarize");
  }

  // Detect entities
  if (lowerIntent.includes("ticket") || lowerIntent.includes("issue")) entities.push("Ticket");
  if (lowerIntent.includes("email") || lowerIntent.includes("message")) entities.push("Email");
  if (lowerIntent.includes("message") || lowerIntent.includes("chat")) entities.push("Message");

  // Detect constraints
  if (lowerIntent.includes("unread")) constraints.push("Unread only");
  if (lowerIntent.includes("assigned to me") || lowerIntent.includes("my")) constraints.push("Assigned to me");
  if (lowerIntent.includes("last 24") || lowerIntent.includes("today")) constraints.push("Last 24 hours");
  if (lowerIntent.includes("priority") || lowerIntent.includes("urgent")) constraints.push("Priority filter");

  // Extract keywords
  Object.keys(keywordMappings).forEach((keyword) => {
    if (lowerIntent.includes(keyword)) {
      keywords.push(keyword);
    }
  });

  // Calculate confidence (deterministic)
  let confidence = 50;
  if (detectedApps.length > 0) confidence += 15;
  if (operations.length > 0) confidence += 10;
  if (entities.length > 0) confidence += 10;
  if (constraints.length > 0) confidence += 5;
  if (keywords.length >= 3) confidence += 10;
  confidence = Math.min(confidence, 95);

  return {
    intent: intentText,
    detectedApps,
    operations,
    entities,
    constraints,
    keywords,
    confidence,
  };
};

