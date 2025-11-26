export const initialSettings = {
  theme: {
    mode: "system" as "light" | "dark" | "system",
    accent: "#2B6DF6",
    typography: "normal" as "small" | "normal" | "large",
  },
  notifications: {
    channels: {
      inApp: { enabled: true, frequency: "immediate" as "immediate" | "digest" | "off" },
      email: { enabled: false, frequency: "digest" as "immediate" | "digest" | "off" },
      slack: { enabled: false, frequency: "immediate" as "immediate" | "digest" | "off" },
      webhook: { enabled: false, frequency: "immediate" as "immediate" | "digest" | "off" },
    },
    events: {
      workflowCompleted: true,
      workflowFailed: true,
      integrationDisconnected: true,
      billingEvents: false,
      adminApprovals: true,
    },
  },
  concurrency: {
    maxConcurrentWorkflows: 50,
    maxConcurrentCardExecutions: 10,
    defaultRetryPolicy: {
      attempts: 3,
      backoff: "exponential" as "linear" | "exponential",
      timeout: 30000,
    },
    allowOverridePerWorkflow: true,
    safeGuards: {
      pauseOnQueueLength: 100,
      autoThrottleErrorRate: 0.1,
    },
  },
  retention: {
    runLogsDays: 90,
    auditLogsDays: 365,
    purgeOnDelete: false,
    autoPurgeSchedule: "weekly" as "daily" | "weekly" | "monthly",
  },
  privacy: {
    dlpEnabled: false,
    dlpRules: [],
    dataMasking: {
      enabled: false,
      rules: [],
    },
    allowUsageDataCollection: true,
  },
  workspace: {
    name: "My Workspace",
    description: "",
    domain: "",
    domainVerified: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    seats: {
      purchased: 10,
      used: 3,
    },
    sso: {
      enabled: false,
      provider: "",
    },
    scim: {
      enabled: false,
    },
  },
  roles: [
    {
      id: "admin",
      name: "Admin",
      permissions: ["run", "edit", "share", "view_logs", "manage_integrations", "manage_settings"],
    },
    {
      id: "editor",
      name: "Editor",
      permissions: ["run", "edit", "share", "view_logs"],
    },
    {
      id: "viewer",
      name: "Viewer",
      permissions: ["view_logs"],
    },
    {
      id: "auditor",
      name: "Auditor",
      permissions: ["view_logs", "view_audit"],
    },
  ],
  tokens: [],
};

