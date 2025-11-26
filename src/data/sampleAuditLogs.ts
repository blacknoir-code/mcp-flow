import { v4 as uuidv4 } from "uuid";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  eventType: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export const sampleAuditLogs: AuditLog[] = [
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: "alice",
    userEmail: "alice@example.com",
    eventType: "workflow",
    action: "run_workflow",
    resource: "workflow",
    resourceId: "wf-123",
    metadata: { workflowName: "Email to Slack", status: "completed" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: "bob",
    userEmail: "bob@example.com",
    eventType: "workflow",
    action: "modify_workflow",
    resource: "workflow",
    resourceId: "wf-456",
    metadata: { workflowName: "Jira Updates", changes: ["added_node", "updated_params"] },
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: "alice",
    userEmail: "alice@example.com",
    eventType: "ai",
    action: "regenerate_with_ai",
    resource: "workflow",
    resourceId: "wf-789",
    metadata: { intent: "Add error handling", suggestionsApplied: 3 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: "charlie",
    userEmail: "charlie@example.com",
    eventType: "integration",
    action: "connect_integration",
    resource: "integration",
    resourceId: "int-gmail-01",
    metadata: { integrationName: "Gmail", scopes: ["gmail.readonly"] },
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: "alice",
    userEmail: "alice@example.com",
    eventType: "token",
    action: "create_token",
    resource: "token",
    resourceId: "tok-abc123",
    metadata: { tokenName: "API Key", scopes: ["workflow:read", "workflow:write"] },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    user: "bob",
    userEmail: "bob@example.com",
    eventType: "settings",
    action: "update_settings",
    resource: "settings",
    metadata: { section: "concurrency", changes: { maxConcurrentWorkflows: 100 } },
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0",
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    user: "alice",
    userEmail: "alice@example.com",
    eventType: "billing",
    action: "upgrade_plan",
    resource: "billing",
    metadata: { fromPlan: "free", toPlan: "pro" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
  },
];

