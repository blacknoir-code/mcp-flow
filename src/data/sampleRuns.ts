import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export type RunStatus = "success" | "failed" | "running" | "cancelled" | "pending";
export type TriggerType = "manual" | "schedule" | "webhook" | "api";

export interface StepEvent {
  id: string;
  nodeId: string;
  title: string;
  app: string;
  status: RunStatus;
  startTime: string;
  endTime?: string;
  durationMs?: number;
  logs: Array<{ level: string; message: string; timestamp: string }>;
  mockResponse?: any;
  error?: string;
  retryCount?: number;
}

export interface RunRecord {
  runId: string;
  workflowId: string;
  workflowName: string;
  status: RunStatus;
  trigger: TriggerType;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  triggeredBy?: string;
  steps: StepEvent[];
  summary?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}

const generateSteps = (count: number, status: RunStatus = "success"): StepEvent[] => {
  const apps = ["gmail", "jira", "slack", "notion"];
  const steps: StepEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const stepStart = now - (count - i) * 2000;
    const stepDuration = 500 + Math.random() * 1500;
    const stepStatus = i === count - 1 && status === "failed" ? "failed" : "success";

    steps.push({
      id: `step-${i}`,
      nodeId: `node-${i}`,
      title: `${apps[i % apps.length]}.${i === 0 ? "get" : i === count - 1 ? "post" : "process"}`,
      app: apps[i % apps.length],
      status: stepStatus,
      startTime: new Date(stepStart).toISOString(),
      endTime: new Date(stepStart + stepDuration).toISOString(),
      durationMs: stepDuration,
      logs: [
        {
          level: "info",
          message: `Step ${i + 1} executed successfully`,
          timestamp: new Date(stepStart).toISOString(),
        },
      ],
      mockResponse: { success: true, data: `result-${i}` },
      ...(stepStatus === "failed" && {
        error: "Connection timeout",
        retryCount: 2,
      }),
    });
  }

  return steps;
};

export const sampleRuns: RunRecord[] = [
  {
    runId: uuidv4(),
    workflowId: "wf-1",
    workflowName: "Email to Slack",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000).toISOString(),
    durationMs: 5000,
    triggeredBy: "alice@example.com",
    steps: generateSteps(5, "success"),
    summary: "Successfully processed 12 emails and posted to Slack",
    inputs: { label: "inbox", limit: 10 },
    outputs: { emailsProcessed: 12, slackMessageId: "msg-123" },
  },
  {
    runId: uuidv4(),
    workflowId: "wf-2",
    workflowName: "Jira Ticket Updates",
    status: "failed",
    trigger: "schedule",
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 8000).toISOString(),
    durationMs: 8000,
    triggeredBy: "system",
    steps: generateSteps(8, "failed"),
    summary: "Failed at step 8: Jira API timeout",
    inputs: { project: "PROJ", status: "In Progress" },
  },
  {
    runId: uuidv4(),
    workflowId: "wf-1",
    workflowName: "Email to Slack",
    status: "success",
    trigger: "webhook",
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3500).toISOString(),
    durationMs: 3500,
    triggeredBy: "webhook-123",
    steps: generateSteps(4, "success"),
    summary: "Processed webhook event and posted to Slack",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-3",
    workflowName: "Notion Page Creator",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 12000).toISOString(),
    durationMs: 12000,
    triggeredBy: "bob@example.com",
    steps: generateSteps(6, "success"),
    summary: "Created 3 Notion pages successfully",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-2",
    workflowName: "Jira Ticket Updates",
    status: "running",
    trigger: "api",
    startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    triggeredBy: "api-key-xyz",
    steps: generateSteps(3, "running").map((s, i) =>
      i === 2 ? { ...s, status: "running" as RunStatus, endTime: undefined, durationMs: undefined } : s
    ),
  },
  {
    runId: uuidv4(),
    workflowId: "wf-4",
    workflowName: "Data Sync Workflow",
    status: "cancelled",
    trigger: "schedule",
    startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 2000).toISOString(),
    durationMs: 2000,
    triggeredBy: "system",
    steps: generateSteps(2, "cancelled"),
    summary: "Cancelled by user",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-1",
    workflowName: "Email to Slack",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 12 * 60 * 60 * 1000 + 4500).toISOString(),
    durationMs: 4500,
    triggeredBy: "charlie@example.com",
    steps: generateSteps(5, "success"),
    summary: "Processed 8 emails",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-5",
    workflowName: "Complex Multi-Step Workflow",
    status: "success",
    trigger: "schedule",
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25000).toISOString(),
    durationMs: 25000,
    triggeredBy: "system",
    steps: generateSteps(12, "success"),
    summary: "Completed all 12 steps successfully",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-2",
    workflowName: "Jira Ticket Updates",
    status: "failed",
    trigger: "manual",
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 6000).toISOString(),
    durationMs: 6000,
    triggeredBy: "alice@example.com",
    steps: generateSteps(6, "failed"),
    summary: "Failed: Authentication error",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-6",
    workflowName: "Quick Notification",
    status: "success",
    trigger: "webhook",
    startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 30 * 60 * 1000 + 1500).toISOString(),
    durationMs: 1500,
    triggeredBy: "webhook-456",
    steps: generateSteps(2, "success"),
    summary: "Sent notification successfully",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-1",
    workflowName: "Email to Slack",
    status: "pending",
    trigger: "schedule",
    startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    triggeredBy: "system",
    steps: [],
  },
  {
    runId: uuidv4(),
    workflowId: "wf-3",
    workflowName: "Notion Page Creator",
    status: "success",
    trigger: "api",
    startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 8000).toISOString(),
    durationMs: 8000,
    triggeredBy: "api-key-abc",
    steps: generateSteps(7, "success"),
    summary: "Created 5 pages",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-7",
    workflowName: "Long Running Process",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45000).toISOString(),
    durationMs: 45000,
    triggeredBy: "bob@example.com",
    steps: generateSteps(15, "success"),
    summary: "Processed large dataset",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-2",
    workflowName: "Jira Ticket Updates",
    status: "success",
    trigger: "schedule",
    startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 5500).toISOString(),
    durationMs: 5500,
    triggeredBy: "system",
    steps: generateSteps(5, "success"),
    summary: "Updated 20 tickets",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-8",
    workflowName: "Error Recovery Test",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 18000).toISOString(),
    durationMs: 18000,
    triggeredBy: "alice@example.com",
    steps: generateSteps(9, "success").map((s, i) =>
      i === 3
        ? {
            ...s,
            status: "failed" as RunStatus,
            error: "Temporary failure",
            retryCount: 1,
            logs: [
              ...s.logs,
              { level: "error", message: "Retry attempt 1", timestamp: s.startTime },
              { level: "info", message: "Retry successful", timestamp: s.endTime || s.startTime },
            ],
          }
        : s
    ),
    summary: "Recovered from error and completed",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-1",
    workflowName: "Email to Slack",
    status: "success",
    trigger: "webhook",
    startedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 3200).toISOString(),
    durationMs: 3200,
    triggeredBy: "webhook-789",
    steps: generateSteps(4, "success"),
    summary: "Webhook processed",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-4",
    workflowName: "Data Sync Workflow",
    status: "failed",
    trigger: "schedule",
    startedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 4000).toISOString(),
    durationMs: 4000,
    triggeredBy: "system",
    steps: generateSteps(4, "failed"),
    summary: "Data sync failed: Connection lost",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-9",
    workflowName: "Quick Test Run",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 800).toISOString(),
    durationMs: 800,
    triggeredBy: "charlie@example.com",
    steps: generateSteps(1, "success"),
    summary: "Test completed",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-5",
    workflowName: "Complex Multi-Step Workflow",
    status: "success",
    trigger: "api",
    startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
    durationMs: 30000,
    triggeredBy: "api-key-def",
    steps: generateSteps(10, "success"),
    summary: "All steps completed",
  },
  {
    runId: uuidv4(),
    workflowId: "wf-1",
    workflowName: "Email to Slack",
    status: "success",
    trigger: "manual",
    startedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000 + 4200).toISOString(),
    durationMs: 4200,
    triggeredBy: "bob@example.com",
    steps: generateSteps(5, "success"),
    summary: "Processed 15 emails",
  },
];

