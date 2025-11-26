import { useCallback } from "react";
import { RunRecord, StepEvent } from "@/data/sampleRuns";
import { useRunsStore } from "@/stores/runsStore";
import { useExecutionSimulator } from "./useExecutionSimulator";
import { useFlowStore } from "@/stores/flowStore";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

interface ReplayOptions {
  startStepId?: string;
  paramOverrides?: Record<string, any>;
  skipFailures?: boolean;
  forceFail?: boolean;
  onStart?: (newRunId: string) => void;
  onProgress?: (stepEvent: StepEvent) => void;
  onComplete?: (newRunId: string) => void;
  onError?: (error: Error) => void;
}

export const useRunReplay = () => {
  const { addRun, updateRun } = useRunsStore();
  const { runWorkflow, runStepOnly } = useExecutionSimulator();
  const { nodes, edges } = useFlowStore();

  const replayRun = useCallback(
    async (originalRun: RunRecord, options: ReplayOptions = {}) => {
      const {
        startStepId,
        paramOverrides = {},
        skipFailures = false,
        forceFail = false,
        onStart,
        onProgress,
        onComplete,
        onError,
      } = options;

      try {
        // Create new run record
        const newRunId = uuidv4();
        const now = Date.now();

        const newRun: RunRecord = {
          runId: newRunId,
          workflowId: originalRun.workflowId,
          workflowName: originalRun.workflowName,
          status: "running",
          trigger: "manual",
          startedAt: new Date(now).toISOString(),
          triggeredBy: "replay",
          steps: [],
          inputs: { ...originalRun.inputs, ...paramOverrides },
          summary: `Replay of ${originalRun.runId}`,
        };

        addRun(newRun);
        onStart?.(newRunId);

        // Find start step index
        const startIndex = startStepId
          ? originalRun.steps.findIndex((s) => s.id === startStepId)
          : 0;

        if (startIndex === -1 && startStepId) {
          throw new Error(`Step ${startStepId} not found in original run`);
        }

        // Replay steps
        const stepsToReplay = originalRun.steps.slice(startIndex);
        const newSteps: StepEvent[] = [];

        for (let i = 0; i < stepsToReplay.length; i++) {
          const originalStep = stepsToReplay[i];
          const stepStart = now + i * 2000;
          let stepStatus: RunRecord["status"] = originalStep.status;

          // Apply overrides
          if (forceFail && i === stepsToReplay.length - 1) {
            stepStatus = "failed";
          } else if (skipFailures && originalStep.status === "failed") {
            stepStatus = "success";
          }

          // Simulate step execution
          const stepDuration = originalStep.durationMs || 1000;
          const stepEnd = stepStart + stepDuration;

          const newStep: StepEvent = {
            ...originalStep,
            id: `step-${i}`,
            startTime: new Date(stepStart).toISOString(),
            endTime: stepStatus !== "running" ? new Date(stepEnd).toISOString() : undefined,
            durationMs: stepStatus !== "running" ? stepDuration : undefined,
            status: stepStatus,
            logs: originalStep.logs.map((log) => ({
              ...log,
              timestamp: new Date(stepStart + Math.random() * stepDuration).toISOString(),
            })),
            mockResponse: originalStep.mockResponse,
            ...(stepStatus === "failed" && {
              error: originalStep.error || "Replay error",
            }),
          };

          newSteps.push(newStep);
          onProgress?.(newStep);

          // Update run with new step
          updateRun(newRunId, {
            steps: [...newSteps],
            status: i === stepsToReplay.length - 1 ? stepStatus : "running",
            ...(i === stepsToReplay.length - 1 && {
              endedAt: new Date(stepEnd).toISOString(),
              durationMs: stepEnd - stepStart,
            }),
          });

          // Simulate delay
          await new Promise((resolve) => setTimeout(resolve, Math.min(stepDuration, 1000)));
        }

        // Complete run
        const finalStatus = newSteps.every((s) => s.status === "success")
          ? "success"
          : newSteps.some((s) => s.status === "failed")
          ? "failed"
          : "success";

        updateRun(newRunId, {
          status: finalStatus,
          endedAt: new Date(now + newSteps.reduce((sum, s) => sum + (s.durationMs || 0), 0)).toISOString(),
          durationMs: newSteps.reduce((sum, s) => sum + (s.durationMs || 0), 0),
          summary: `Replayed ${stepsToReplay.length} steps from ${originalRun.runId}`,
        });

        onComplete?.(newRunId);
        return newRunId;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        onError?.(err);
        throw err;
      }
    },
    [addRun, updateRun]
  );

  return { replayRun };
};

