import { MCPServerLog } from "./mockMcpServers";

export const generateMockLogs = (count: number = 20): MCPServerLog[] => {
  const levels: ("INFO" | "WARN" | "ERROR" | "DEBUG")[] = ["INFO", "WARN", "ERROR", "DEBUG"];
  const messages = [
    "Function call completed successfully",
    "Health check passed",
    "Server metrics updated",
    "New connection established",
    "Rate limit approaching threshold",
    "Function execution timeout",
    "Authentication failed",
    "Schema validation error",
    "Server restart initiated",
    "Maintenance mode enabled",
    "Function reloaded",
    "Heartbeat received",
    "Memory usage high",
    "CPU spike detected",
    "Request queued",
    "Response cached",
    "Error rate threshold exceeded",
    "Server recovered from degraded state",
    "New function registered",
    "Configuration updated",
  ];

  const logs: MCPServerLog[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const timestamp = new Date(now - (count - i) * 60 * 1000).toISOString();

    logs.push({
      id: `log-${i}`,
      ts: timestamp,
      level,
      message,
      meta: level === "ERROR" ? { errorCode: "ERR_001", stack: "mock stack trace" } : undefined,
    });
  }

  return logs;
};

