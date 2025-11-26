import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Integration } from "@/data/mockIntegrations";

interface RevokeConfirmModalProps {
  open: boolean;
  onClose: () => void;
  integration: Integration;
  onConfirm: () => void;
}

export const RevokeConfirmModal = ({
  open,
  onClose,
  integration,
  onConfirm,
}: RevokeConfirmModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke Integration</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke access to {integration.name}?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <strong>Warning:</strong> This will immediately disconnect the integration. All
              workflows using this integration will stop working until you reconnect.
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <Button onClick={onConfirm} variant="destructive" className="flex-1">
              Revoke Access
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

