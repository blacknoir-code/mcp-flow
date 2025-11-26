import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { initialSettings } from "@/data/initialSettings";

interface Theme {
  mode: "light" | "dark" | "system";
  accent: string;
  typography: "small" | "normal" | "large";
}

interface NotificationChannel {
  enabled: boolean;
  frequency: "immediate" | "digest" | "off";
}

interface NotificationSettings {
  channels: {
    inApp: NotificationChannel;
    email: NotificationChannel;
    slack: NotificationChannel;
    webhook: NotificationChannel;
  };
  events: {
    workflowCompleted: boolean;
    workflowFailed: boolean;
    integrationDisconnected: boolean;
    billingEvents: boolean;
    adminApprovals: boolean;
  };
}

interface ConcurrencySettings {
  maxConcurrentWorkflows: number;
  maxConcurrentCardExecutions: number;
  defaultRetryPolicy: {
    attempts: number;
    backoff: "linear" | "exponential";
    timeout: number;
  };
  allowOverridePerWorkflow: boolean;
  safeGuards: {
    pauseOnQueueLength: number;
    autoThrottleErrorRate: number;
  };
}

interface RetentionSettings {
  runLogsDays: number;
  auditLogsDays: number;
  purgeOnDelete: boolean;
  autoPurgeSchedule: "daily" | "weekly" | "monthly";
}

interface DLPRule {
  id: string;
  name: string;
  pattern: string;
  action: "mask" | "block" | "redact";
  scope: "workspace" | "workflow";
}

interface PrivacySettings {
  dlpEnabled: boolean;
  dlpRules: DLPRule[];
  dataMasking: {
    enabled: boolean;
    rules: Array<{ field: string; pattern: string }>;
  };
  allowUsageDataCollection: boolean;
}

interface WorkspaceSettings {
  name: string;
  description: string;
  domain: string;
  domainVerified: boolean;
  timezone: string;
  seats: {
    purchased: number;
    used: number;
  };
  sso: {
    enabled: boolean;
    provider: string;
  };
  scim: {
    enabled: boolean;
  };
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface AuthToken {
  id: string;
  name: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
  lastUsed: string | null;
  maskedValue: string;
}

interface SettingsState {
  theme: Theme;
  notifications: NotificationSettings;
  concurrency: ConcurrencySettings;
  retention: RetentionSettings;
  privacy: PrivacySettings;
  workspace: WorkspaceSettings;
  roles: Role[];
  tokens: AuthToken[];
  hasUnsavedChanges: boolean;

  updateTheme: (theme: Partial<Theme>) => void;
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;
  updateConcurrency: (concurrency: Partial<ConcurrencySettings>) => void;
  updateRetention: (retention: Partial<RetentionSettings>) => void;
  updatePrivacy: (privacy: Partial<PrivacySettings>) => void;
  updateWorkspace: (workspace: Partial<WorkspaceSettings>) => void;
  addRole: (role: Omit<Role, "id">) => void;
  updateRole: (roleId: string, updates: Partial<Role>) => void;
  deleteRole: (roleId: string) => void;
  addToken: (token: Omit<AuthToken, "id" | "maskedValue" | "createdAt" | "lastUsed">) => string;
  updateToken: (tokenId: string, updates: Partial<AuthToken>) => void;
  deleteToken: (tokenId: string) => void;
  rotateToken: (tokenId: string) => void;
  addDLPRule: (rule: Omit<DLPRule, "id">) => void;
  updateDLPRule: (ruleId: string, updates: Partial<DLPRule>) => void;
  deleteDLPRule: (ruleId: string) => void;
  save: () => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialSettings,
      hasUnsavedChanges: false,

      updateTheme: (theme) => {
        set((state) => ({
          theme: { ...state.theme, ...theme },
          hasUnsavedChanges: true,
        }));
        // Apply theme to document
        if (theme.mode) {
          const root = document.documentElement;
          if (theme.mode === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.toggle("dark", prefersDark);
          } else {
            root.classList.toggle("dark", theme.mode === "dark");
          }
        }
        if (theme.accent) {
          document.documentElement.style.setProperty("--color-primary", theme.accent);
        }
      },

      updateNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
          hasUnsavedChanges: true,
        })),

      updateConcurrency: (concurrency) =>
        set((state) => ({
          concurrency: { ...state.concurrency, ...concurrency },
          hasUnsavedChanges: true,
        })),

      updateRetention: (retention) =>
        set((state) => ({
          retention: { ...state.retention, ...retention },
          hasUnsavedChanges: true,
        })),

      updatePrivacy: (privacy) =>
        set((state) => ({
          privacy: { ...state.privacy, ...privacy },
          hasUnsavedChanges: true,
        })),

      updateWorkspace: (workspace) =>
        set((state) => ({
          workspace: { ...state.workspace, ...workspace },
          hasUnsavedChanges: true,
        })),

      addRole: (role) =>
        set((state) => ({
          roles: [...state.roles, { ...role, id: `role-${Date.now()}` }],
          hasUnsavedChanges: true,
        })),

      updateRole: (roleId, updates) =>
        set((state) => ({
          roles: state.roles.map((r) => (r.id === roleId ? { ...r, ...updates } : r)),
          hasUnsavedChanges: true,
        })),

      deleteRole: (roleId) =>
        set((state) => ({
          roles: state.roles.filter((r) => r.id !== roleId),
          hasUnsavedChanges: true,
        })),

      addToken: (token) => {
        const id = `tok-${Date.now()}`;
        const maskedValue = `mcp_****${Math.random().toString(36).substring(2, 6)}`;
        const newToken: AuthToken = {
          ...token,
          id,
          maskedValue,
          createdAt: new Date().toISOString(),
          lastUsed: null,
        };
        set((state) => ({
          tokens: [...state.tokens, newToken],
          hasUnsavedChanges: true,
        }));
        return id;
      },

      updateToken: (tokenId, updates) =>
        set((state) => ({
          tokens: state.tokens.map((t) => (t.id === tokenId ? { ...t, ...updates } : t)),
          hasUnsavedChanges: true,
        })),

      deleteToken: (tokenId) =>
        set((state) => ({
          tokens: state.tokens.filter((t) => t.id !== tokenId),
          hasUnsavedChanges: true,
        })),

      rotateToken: (tokenId) => {
        const token = get().tokens.find((t) => t.id === tokenId);
        if (!token) return;
        const newMaskedValue = `mcp_****${Math.random().toString(36).substring(2, 6)}`;
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === tokenId
              ? {
                  ...t,
                  maskedValue: newMaskedValue,
                  createdAt: new Date().toISOString(),
                }
              : t
          ),
          hasUnsavedChanges: true,
        }));
      },

      addDLPRule: (rule) =>
        set((state) => ({
          privacy: {
            ...state.privacy,
            dlpRules: [...state.privacy.dlpRules, { ...rule, id: `dlp-${Date.now()}` }],
          },
          hasUnsavedChanges: true,
        })),

      updateDLPRule: (ruleId, updates) =>
        set((state) => ({
          privacy: {
            ...state.privacy,
            dlpRules: state.privacy.dlpRules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
          },
          hasUnsavedChanges: true,
        })),

      deleteDLPRule: (ruleId) =>
        set((state) => ({
          privacy: {
            ...state.privacy,
            dlpRules: state.privacy.dlpRules.filter((r) => r.id !== ruleId),
          },
          hasUnsavedChanges: true,
        })),

      save: () => set({ hasUnsavedChanges: false }),

      reset: () => set({ ...initialSettings, hasUnsavedChanges: false }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

