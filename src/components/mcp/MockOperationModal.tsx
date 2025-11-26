import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface MockOperationModalProps {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  operation?: "reload" | "restart" | "health_check" | "test";
  isProgress?: boolean;
}

export const MockOperationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  operation = "reload",
  isProgress = false,
}: MockOperationModalProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isProgress]);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        {isProgress && (
          <div className="mt-4">
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-gray-500 text-center">{progress}%</p>
          </div>
        )}

        {!isProgress && (
          <div className="flex justify-end gap-2 mt-4">
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            )}
            {onConfirm && (
              <Button onClick={onConfirm} className="bg-gradient-to-r from-primary to-electric-glow">
                Confirm
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

