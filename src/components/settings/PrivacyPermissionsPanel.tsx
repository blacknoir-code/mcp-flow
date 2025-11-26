import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore } from "@/stores/settingsStore";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

const sampleJson = {
  email: "user@example.com",
  creditCard: "4532-1234-5678-9010",
  ssn: "123-45-6789",
  phone: "+1-555-123-4567",
};

const applyMasking = (json: any, rules: Array<{ field: string; pattern: string }>) => {
  const masked = JSON.parse(JSON.stringify(json));
  rules.forEach((rule) => {
    if (masked[rule.field]) {
      masked[rule.field] = "***MASKED***";
    }
  });
  return masked;
};

export const PrivacyPermissionsPanel = () => {
  const { privacy, roles, updatePrivacy, addDLPRule, deleteDLPRule, addRole, updateRole, deleteRole } =
    useSettingsStore();
  const [newRule, setNewRule] = useState({
    name: "",
    pattern: "",
    action: "mask" as "mask" | "block" | "redact",
    scope: "workspace" as "workspace" | "workflow",
  });
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] as string[],
  });

  const allPermissions = [
    "run",
    "edit",
    "share",
    "view_logs",
    "manage_integrations",
    "manage_settings",
    "view_audit",
  ];

  const dlpPresets = [
    { name: "Mask Emails", pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b", action: "mask" as const },
    { name: "Redact Credit Cards", pattern: "\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b", action: "redact" as const },
    { name: "Block SSNs", pattern: "\\b\\d{3}-\\d{2}-\\d{4}\\b", action: "block" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Data Loss Prevention (DLP)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Enable DLP</Label>
              <p className="text-sm text-gray-500">
                Enable data loss prevention rules to protect sensitive information
              </p>
            </div>
            <Switch
              checked={privacy.dlpEnabled}
              onCheckedChange={(checked) => updatePrivacy({ dlpEnabled: checked })}
            />
          </div>

          {privacy.dlpEnabled && (
            <>
              <div>
                <Label>DLP Rules</Label>
                <div className="space-y-2 mt-2">
                  {privacy.dlpRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{rule.name}</span>
                          <Badge variant="outline">{rule.action}</Badge>
                          <Badge variant="secondary">{rule.scope}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{rule.pattern}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteDLPRule(rule.id)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-4">
                <Label className="mb-2">Add DLP Rule</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {dlpPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          addDLPRule({
                            ...preset,
                            scope: "workspace",
                          });
                        }}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Rule name"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    />
                    <Input
                      placeholder="Regex pattern"
                      value={newRule.pattern}
                      onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={newRule.action}
                      onValueChange={(value) =>
                        setNewRule({ ...newRule, action: value as "mask" | "block" | "redact" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mask">Mask</SelectItem>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="redact">Redact</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newRule.scope}
                      onValueChange={(value) =>
                        setNewRule({ ...newRule, scope: value as "workspace" | "workflow" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workspace">Workspace</SelectItem>
                        <SelectItem value="workflow">Workflow</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => {
                        if (newRule.name && newRule.pattern) {
                          addDLPRule(newRule);
                          setNewRule({ name: "", pattern: "", action: "mask", scope: "workspace" });
                        }
                      }}
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Data Masking</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Enable Data Masking</Label>
              <p className="text-sm text-gray-500">
                Mask sensitive fields in logs and responses
              </p>
            </div>
            <Switch
              checked={privacy.dataMasking.enabled}
              onCheckedChange={(checked) =>
                updatePrivacy({
                  dataMasking: { ...privacy.dataMasking, enabled: checked },
                })
              }
            />
          </div>

          {privacy.dataMasking.enabled && (
            <Card className="p-4">
              <Label className="mb-2">Mask Preview</Label>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Original:</p>
                  <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded overflow-auto">
                    {JSON.stringify(sampleJson, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Masked:</p>
                  <pre className="text-xs bg-gray-900 text-yellow-400 p-2 rounded overflow-auto">
                    {JSON.stringify(applyMasking(sampleJson, privacy.dataMasking.rules), null, 2)}
                  </pre>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Role-Based Permissions</h3>
        <div className="space-y-3">
          {roles.map((role) => (
            <Card key={role.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Label className="font-semibold">{role.name}</Label>
                  <p className="text-sm text-gray-500">{role.permissions.length} permissions</p>
                </div>
                {!["admin", "editor", "viewer", "auditor"].includes(role.id) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteRole(role.id)}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allPermissions.map((perm) => (
                  <Badge
                    key={perm}
                    variant={role.permissions.includes(perm) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newPerms = role.permissions.includes(perm)
                        ? role.permissions.filter((p) => p !== perm)
                        : [...role.permissions, perm];
                      updateRole(role.id, { permissions: newPerms });
                    }}
                  >
                    {perm}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 mt-4">
          <Label className="mb-2">Add Custom Role</Label>
          <div className="space-y-3">
            <Input
              placeholder="Role name"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              {allPermissions.map((perm) => (
                <Badge
                  key={perm}
                  variant={newRole.permissions.includes(perm) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newPerms = newRole.permissions.includes(perm)
                      ? newRole.permissions.filter((p) => p !== perm)
                      : [...newRole.permissions, perm];
                    setNewRole({ ...newRole, permissions: newPerms });
                  }}
                >
                  {perm}
                </Badge>
              ))}
            </div>
            <Button
              onClick={() => {
                if (newRole.name) {
                  addRole(newRole);
                  setNewRole({ name: "", permissions: [] });
                }
              }}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Role
            </Button>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Allow Usage Data Collection</Label>
              <p className="text-sm text-gray-500">
                Help improve the product by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={privacy.allowUsageDataCollection}
              onCheckedChange={(checked) =>
                updatePrivacy({ allowUsageDataCollection: checked })
              }
            />
          </div>
          <Button variant="outline">Export User Data</Button>
        </div>
      </div>
    </div>
  );
};

