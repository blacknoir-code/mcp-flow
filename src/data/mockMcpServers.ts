import { v4 as uuidv4 } from "uuid";

export interface MCPFunction {
  id: string;
  name: string;
  idempotent: boolean;
  inputsSchema: any;
  outputsSchema: any;
  authScopes: string[];
  examples: {
    request: any;
    response: any;
  };
  cost: "cheap" | "expensive";
  appType?: string;
}

export interface MCPServerMetrics {
  rpsHistory: number[];
  errorRateHistory: number[];
  avgLatencyMs: number;
  cpuPct: number;
  memPct: number;
}

export interface MCPServerLog {
  id: string;
  ts: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  meta?: any;
}

export interface MCPServerSettings {
  maintenance: boolean;
  disabled: boolean;
  alias?: string;
  tags: string[];
  credentials?: Record<string, any>;
}

export interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  region: string;
  tags: string[];
  version: string;
  instanceId: string;
  health: "healthy" | "degraded" | "down" | "maintenance" | "restarting";
  lastHeartbeat: string;
  uptimePct: number;
  lastDeployTime: string;
  deployVersion: string;
  metrics: MCPServerMetrics;
  functions: MCPFunction[];
  logs: MCPServerLog[];
  settings: MCPServerSettings;
}

export const mockMcpServers: MCPServer[] = [
  {
    id: "mcp-eu-prod-01",
    name: "mcp-eu-prod-01",
    endpoint: "mcp://eu-prod-01.mcp.example.com",
    region: "eu",
    tags: ["production", "eu"],
    version: "1.2.3",
    instanceId: "i-abc123def456",
    health: "healthy",
    lastHeartbeat: new Date(Date.now() - 5 * 1000).toISOString(),
    uptimePct: 99.8,
    lastDeployTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deployVersion: "1.2.3",
    metrics: {
      rpsHistory: [45, 52, 48, 55, 50, 47, 53, 49, 51, 46],
      errorRateHistory: [0.01, 0.02, 0.01, 0.01, 0.02, 0.01, 0.01, 0.02, 0.01, 0.01],
      avgLatencyMs: 125,
      cpuPct: 45,
      memPct: 62,
    },
    functions: [],
    logs: [],
    settings: {
      maintenance: false,
      disabled: false,
      alias: "EU Production",
      tags: ["production", "eu"],
    },
  },
  {
    id: "mcp-us-staging-01",
    name: "mcp-us-staging-01",
    endpoint: "mcp://us-staging-01.mcp.example.com",
    region: "us-west",
    tags: ["staging", "us"],
    version: "1.2.2",
    instanceId: "i-xyz789ghi012",
    health: "degraded",
    lastHeartbeat: new Date(Date.now() - 30 * 1000).toISOString(),
    uptimePct: 95.2,
    lastDeployTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deployVersion: "1.2.2",
    metrics: {
      rpsHistory: [38, 42, 35, 40, 33, 38, 41, 36, 39, 34],
      errorRateHistory: [0.08, 0.12, 0.09, 0.11, 0.10, 0.08, 0.13, 0.09, 0.11, 0.10],
      avgLatencyMs: 280,
      cpuPct: 78,
      memPct: 85,
    },
    functions: [],
    logs: [],
    settings: {
      maintenance: false,
      disabled: false,
      alias: "US Staging",
      tags: ["staging", "us"],
    },
  },
  {
    id: "mcp-intl-canary",
    name: "mcp-intl-canary",
    endpoint: "mcp://intl-canary.mcp.example.com",
    region: "canary",
    tags: ["canary", "testing"],
    version: "1.3.0-beta",
    instanceId: "i-canary001",
    health: "maintenance",
    lastHeartbeat: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    uptimePct: 88.5,
    lastDeployTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    deployVersion: "1.3.0-beta",
    metrics: {
      rpsHistory: [12, 15, 10, 14, 11, 13, 16, 12, 15, 10],
      errorRateHistory: [0.05, 0.06, 0.04, 0.05, 0.06, 0.04, 0.05, 0.06, 0.04, 0.05],
      avgLatencyMs: 195,
      cpuPct: 35,
      memPct: 48,
    },
    functions: [],
    logs: [],
    settings: {
      maintenance: true,
      disabled: false,
      alias: "Canary",
      tags: ["canary", "testing"],
    },
  },
];

