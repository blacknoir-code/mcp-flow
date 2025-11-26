export interface IntegrationScope {
  name: string;
  description: string;
  granted: boolean;
  lastGrantedAt: string | null;
  longDescription?: string;
}

export interface IntegrationToken {
  valueMasked: string;
  expiresAt: string;
  lastRotated: string;
  type: "oauth" | "api_key";
}

export interface IntegrationTrigger {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  lastFiredAt: string | null;
  requiredParams?: string[];
}

export interface IntegrationRateLimit {
  perMinute: number;
  perDay: number;
  usedLastHour: number;
  usedToday: number;
  resetAt: string;
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  type: "sync" | "token_rotated" | "trigger_fired" | "test_call" | "scope_reconsent" | "rate_limit_exceeded" | "error";
  message: string;
  metadata?: any;
  status?: "success" | "error" | "warning";
}

export interface IntegrationSettings {
  autoRotate: boolean;
  rotateEveryDays: number;
  throttleEnabled: boolean;
  requestsBlocked?: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: "gmail" | "jira" | "slack" | "notion";
  status: "connected" | "needs_auth" | "error" | "disconnected";
  connectedAs: string;
  lastSyncAt: string;
  lastSyncResult: "success" | "error" | "warning";
  token: IntegrationToken;
  scopes: IntegrationScope[];
  rateLimits: IntegrationRateLimit;
  triggers: IntegrationTrigger[];
  defaultParams: Record<string, any>;
  logs: IntegrationLog[];
  settings: IntegrationSettings;
  health: "healthy" | "degraded" | "error";
}

export const mockIntegrations: Integration[] = [
  {
    id: "gmail-1",
    name: "Gmail - acme.team",
    provider: "gmail",
    status: "connected",
    connectedAs: "alice@acme.com",
    lastSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    lastSyncResult: "success",
    token: {
      valueMasked: "****_abc123",
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
      lastRotated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      type: "oauth",
    },
    scopes: [
      {
        name: "https://www.googleapis.com/auth/gmail.readonly",
        description: "Read Gmail messages",
        granted: true,
        lastGrantedAt: "2024-10-01T00:00:00Z",
        longDescription: "Allows the application to read Gmail messages and metadata, including labels, threads, and message content.",
      },
      {
        name: "https://www.googleapis.com/auth/gmail.send",
        description: "Send email as user",
        granted: false,
        lastGrantedAt: null,
        longDescription: "Allows the application to send emails on behalf of the user.",
      },
      {
        name: "https://www.googleapis.com/auth/gmail.modify",
        description: "Modify Gmail messages",
        granted: true,
        lastGrantedAt: "2024-10-01T00:00:00Z",
        longDescription: "Allows the application to modify Gmail messages, including marking as read/unread, adding/removing labels.",
      },
    ],
    rateLimits: {
      perMinute: 600,
      perDay: 10000,
      usedLastHour: 120,
      usedToday: 2450,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    triggers: [
      {
        id: "t1",
        name: "On New Email",
        enabled: true,
        config: { label: "inbox", unread: true },
        lastFiredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        requiredParams: ["label"],
      },
      {
        id: "t2",
        name: "On Label Change",
        enabled: false,
        config: { label: "important" },
        lastFiredAt: null,
        requiredParams: ["label"],
      },
    ],
    defaultParams: {
      defaultEmailLabel: "inbox",
      defaultUnreadOnly: true,
    },
    logs: [
      {
        id: "log1",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: "sync",
        message: "Sync completed successfully",
        status: "success",
        metadata: { itemsSynced: 15 },
      },
      {
        id: "log2",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        type: "trigger_fired",
        message: "Trigger 'On New Email' fired",
        status: "success",
        metadata: { triggerId: "t1", emailCount: 3 },
      },
    ],
    settings: {
      autoRotate: true,
      rotateEveryDays: 30,
      throttleEnabled: false,
      requestsBlocked: 0,
    },
    health: "healthy",
  },
  {
    id: "jira-1",
    name: "Jira - acme.team",
    provider: "jira",
    status: "connected",
    connectedAs: "alice@acme.com",
    lastSyncAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    lastSyncResult: "success",
    token: {
      valueMasked: "****_jira456",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastRotated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      type: "oauth",
    },
    scopes: [
      {
        name: "read:jira-work",
        description: "Read Jira issues and projects",
        granted: true,
        lastGrantedAt: "2024-10-01T00:00:00Z",
      },
      {
        name: "write:jira-work",
        description: "Create and update Jira issues",
        granted: true,
        lastGrantedAt: "2024-10-01T00:00:00Z",
      },
    ],
    rateLimits: {
      perMinute: 500,
      perDay: 10000,
      usedLastHour: 85,
      usedToday: 3200,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    triggers: [
      {
        id: "t1",
        name: "On New Issue",
        enabled: true,
        config: { project: "PROJ" },
        lastFiredAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        requiredParams: ["project"],
      },
      {
        id: "t2",
        name: "On Status Change",
        enabled: true,
        config: { project: "PROJ", status: "In Progress" },
        lastFiredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        requiredParams: ["project", "status"],
      },
    ],
    defaultParams: {
      defaultJiraProject: "PROJ",
      defaultAssignee: "me",
    },
    logs: [
      {
        id: "log1",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        type: "sync",
        message: "Sync completed successfully",
        status: "success",
      },
    ],
    settings: {
      autoRotate: true,
      rotateEveryDays: 60,
      throttleEnabled: false,
    },
    health: "healthy",
  },
  {
    id: "slack-1",
    name: "Slack - acme.team",
    provider: "slack",
    status: "connected",
    connectedAs: "alice@acme.com",
    lastSyncAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    lastSyncResult: "success",
    token: {
      valueMasked: "****_slack789",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastRotated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "oauth",
    },
    scopes: [
      {
        name: "chat:write",
        description: "Send messages",
        granted: true,
        lastGrantedAt: "2024-10-01T00:00:00Z",
      },
      {
        name: "channels:read",
        description: "Read channel information",
        granted: true,
        lastGrantedAt: "2024-10-01T00:00:00Z",
      },
    ],
    rateLimits: {
      perMinute: 1000,
      perDay: 20000,
      usedLastHour: 45,
      usedToday: 1200,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    triggers: [
      {
        id: "t1",
        name: "On New Message",
        enabled: true,
        config: { channel: "#general", keyword: "urgent" },
        lastFiredAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        requiredParams: ["channel"],
      },
    ],
    defaultParams: {
      defaultSlackChannel: "#product-updates",
    },
    logs: [],
    settings: {
      autoRotate: false,
      rotateEveryDays: 30,
      throttleEnabled: false,
    },
    health: "healthy",
  },
];

export const availableEndpoints: Record<string, Array<{ name: string; params: Record<string, any> }>> = {
  gmail: [
    { name: "gmail.get_unread_emails", params: { label: "inbox", unread: true, limit: 10 } },
    { name: "gmail.send_email", params: { to: "", subject: "", body: "" } },
    { name: "gmail.add_label", params: { messageId: "", label: "" } },
  ],
  jira: [
    { name: "jira.get_issue", params: { issueId: "PROJ-123" } },
    { name: "jira.update_ticket", params: { ticketId: "PROJ-123", status: "In Progress" } },
    { name: "jira.create_issue", params: { project: "PROJ", summary: "", description: "" } },
  ],
  slack: [
    { name: "slack.post_message", params: { channel: "#general", message: "" } },
    { name: "slack.get_channels", params: {} },
    { name: "slack.get_messages", params: { channel: "#general", limit: 10 } },
  ],
};

