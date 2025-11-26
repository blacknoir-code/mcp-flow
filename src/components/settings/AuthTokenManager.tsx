import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/settingsStore";
import { ConfirmModal } from "./ConfirmModal";
import { useToastSystem } from "./ToastSystem";
import { appendAuditLog } from "@/stores/auditStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DocumentDuplicateIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const allScopes = [
  "workflow:read",
  "workflow:write",
  "workflow:run",
  "integration:read",
  "integration:write",
  "settings:read",
  "settings:write",
  "admin",
];

export const AuthTokenManager = () => {
  const store = useSettingsStore();
  const { tokens = [], addToken, updateToken, deleteToken, rotateToken } = store;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [newToken, setNewToken] = useState({
    name: "",
    scopes: [] as string[],
    expiresIn: "90",
  });
  const toast = useToastSystem();

  const handleCreate = () => {
    if (!newToken.name || newToken.scopes.length === 0) {
      toast.showError("Name and at least one scope are required");
      return;
    }

    const expiresAt =
      newToken.expiresIn === "never"
        ? null
        : dayjs().add(parseInt(newToken.expiresIn), "days").toISOString();

    const tokenId = addToken({
      name: newToken.name,
      scopes: newToken.scopes,
      expiresAt,
    });

    appendAuditLog({
      user: "current_user",
      userEmail: "user@example.com",
      eventType: "token",
      action: "create_token",
      resource: "token",
      resourceId: tokenId,
      metadata: { tokenName: newToken.name, scopes: newToken.scopes },
    });

    toast.showSuccess("Token created successfully");
    setShowCreateModal(false);
    setNewToken({ name: "", scopes: [], expiresIn: "90" });
  };

  const handleRotate = (tokenId: string) => {
    rotateToken(tokenId);
    appendAuditLog({
      user: "current_user",
      userEmail: "user@example.com",
      eventType: "token",
      action: "rotate_token",
      resource: "token",
      resourceId: tokenId,
      metadata: {},
    });
    toast.showSuccess("Token rotated successfully");
  };

  const handleRevoke = (tokenId: string) => {
    const token = tokens.find((t) => t.id === tokenId);
    if (token) {
      deleteToken(tokenId);
      appendAuditLog({
        user: "current_user",
        userEmail: "user@example.com",
        eventType: "token",
        action: "revoke_token",
        resource: "token",
        resourceId: tokenId,
        metadata: { tokenName: token.name },
      });
      toast.showSuccess("Token revoked successfully");
    }
    setShowRevokeModal(null);
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.showSuccess("Token copied to clipboard");
  };

  const hasAdminScope = (scopes: string[]) => scopes.includes("admin");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Authentication Tokens ({tokens.length})</h3>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Token
        </Button>
      </div>

      <div className="space-y-2">
        {tokens.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tokens created yet</p>
        ) : (
          tokens.map((token) => (
            <div key={token.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{token.name}</span>
                    {hasAdminScope(token.scopes) && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {token.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Created: {dayjs(token.createdAt).format("MMM D, YYYY")}</div>
                    {token.expiresAt && (
                      <div>
                        Expires: {dayjs(token.expiresAt).format("MMM D, YYYY")}
                      </div>
                    )}
                    {token.lastUsed && (
                      <div>Last used: {dayjs(token.lastUsed).fromNow()}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const visible = visibleTokens.has(token.id);
                      const newVisible = new Set(visibleTokens);
                      if (visible) {
                        newVisible.delete(token.id);
                      } else {
                        newVisible.add(token.id);
                      }
                      setVisibleTokens(newVisible);
                    }}
                  >
                    {visibleTokens.has(token.id) ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToken(token.maskedValue)}
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRotate(token.id)}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRevokeModal(token.id)}
                    className="text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {visibleTokens.has(token.id) && (
                <div className="mt-2 p-2 bg-gray-900 rounded font-mono text-sm text-green-400">
                  {token.maskedValue}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Token</DialogTitle>
            <DialogDescription>
              Create a new authentication token for API access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Token Name</Label>
              <Input
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                placeholder="My API Token"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Scopes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allScopes.map((scope) => (
                  <Badge
                    key={scope}
                    variant={newToken.scopes.includes(scope) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newScopes = newToken.scopes.includes(scope)
                        ? newToken.scopes.filter((s) => s !== scope)
                        : [...newToken.scopes, scope];
                      setNewToken({ ...newToken, scopes: newScopes });
                    }}
                  >
                    {scope}
                  </Badge>
                ))}
              </div>
              {hasAdminScope(newToken.scopes) && (
                <p className="text-sm text-yellow-600 mt-2">
                  ⚠️ Warning: Admin scope grants full access
                </p>
              )}
            </div>
            <div>
              <Label>Expires In</Label>
              <Select
                value={newToken.expiresIn}
                onValueChange={(value) => setNewToken({ ...newToken, expiresIn: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">365 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-primary to-electric-glow">
                Create Token
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showRevokeModal && (
        <ConfirmModal
          open={true}
          onClose={() => setShowRevokeModal(null)}
          onConfirm={() => handleRevoke(showRevokeModal)}
          title="Revoke Token"
          description="Are you sure you want to revoke this token? This action cannot be undone."
          confirmText="Revoke"
          variant="destructive"
        />
      )}
    </div>
  );
};

