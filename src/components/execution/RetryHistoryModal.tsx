import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExecutionBadge } from "./ExecutionBadge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface RetryHistoryModalProps {
  open: boolean;
  onClose: () => void;
  retryHistory: Array<{
    attempt: number;
    timestamp: string;
    status: "success" | "error";
    error?: string;
  }>;
  onRerunAttempt: (attempt: number) => void;
}

export const RetryHistoryModal = ({
  open,
  onClose,
  retryHistory,
  onRerunAttempt,
}: RetryHistoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Retry History</DialogTitle>
          <DialogDescription>
            View all retry attempts for this node
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {retryHistory.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No retry history</p>
          ) : (
            retryHistory.map((retry, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-sm">Attempt {retry.attempt}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dayjs(retry.timestamp).format("HH:mm:ss")} ({dayjs(retry.timestamp).fromNow()})
                    </div>
                    {retry.error && (
                      <div className="text-xs text-red-600 mt-1">{retry.error}</div>
                    )}
                  </div>
                  <ExecutionBadge status={retry.status} size="sm" />
                </div>
                <Button
                  onClick={() => onRerunAttempt(retry.attempt)}
                  size="sm"
                  variant="outline"
                >
                  Re-run
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

