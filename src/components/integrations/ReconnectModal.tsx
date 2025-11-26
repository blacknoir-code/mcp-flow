import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Integration } from "@/data/mockIntegrations";

interface ReconnectModalProps {
  open: boolean;
  onClose: () => void;
  integration: Integration;
  requestedScopes: string[];
  onApprove: () => void;
  onDeny: () => void;
}

export const ReconnectModal = ({
  open,
  onClose,
  integration,
  requestedScopes,
  onApprove,
  onDeny,
}: ReconnectModalProps) => {
  const missingScopes = integration.scopes.filter(
    (s) => requestedScopes.includes(s.name) && !s.granted
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reconnect {integration.name}</DialogTitle>
          <DialogDescription>
            Approve additional scopes to reconnect this integration
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Requested Scopes</h4>
            <div className="space-y-2">
              {missingScopes.map((scope) => (
                <div
                  key={scope.name}
                  className="p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <XCircleIcon className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-sm">{scope.name}</span>
                    <Badge variant="outline" className="text-xs bg-yellow-50">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{scope.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Approving will reconnect the integration with these additional
              scopes. You may need to authenticate again.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <Button onClick={onApprove} className="flex-1">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Approve & Reconnect
            </Button>
            <Button onClick={onDeny} variant="outline" className="flex-1">
              <XCircleIcon className="w-4 h-4 mr-2" />
              Deny
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

