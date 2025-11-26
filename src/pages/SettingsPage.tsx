import { useState } from "react";
import { SettingsSidebar, SettingsSection } from "@/components/settings/SettingsSidebar";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { ConcurrencySettings } from "@/components/settings/ConcurrencySettings";
import { DataRetentionPanel } from "@/components/settings/DataRetentionPanel";
import { PrivacyPermissionsPanel } from "@/components/settings/PrivacyPermissionsPanel";
import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";
import { AuditLogsViewer } from "@/components/settings/AuditLogsViewer";
import { AuthTokenManager } from "@/components/settings/AuthTokenManager";
import { BillingPage } from "@/components/settings/BillingPage";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToastSystem } from "@/components/settings/ToastSystem";
import { DocumentCheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("theme");
  const { hasUnsavedChanges, save, reset } = useSettingsStore();
  const toast = useToastSystem();

  const handleSave = () => {
    save();
    toast.showSuccess("Settings saved successfully");
  };

  const handleDiscard = () => {
    reset();
    toast.showInfo("Changes discarded");
  };

  const renderContent = () => {
    try {
      switch (activeSection) {
        case "theme":
          return <ThemeSelector />;
        case "notifications":
          return <NotificationPreferences />;
        case "concurrency":
          return <ConcurrencySettings />;
        case "retention":
          return <DataRetentionPanel />;
        case "privacy":
          return <PrivacyPermissionsPanel />;
        case "workspace":
          return <WorkspaceSettings />;
        case "audit":
          return <AuditLogsViewer />;
        case "tokens":
          return <AuthTokenManager />;
        case "billing":
          return <BillingPage />;
        default:
          return <div className="text-center text-gray-500 py-8">Section not found</div>;
      }
    } catch (error) {
      console.error("Error rendering settings section:", error);
      return (
        <div className="text-center text-red-500 py-8">
          <p>Error loading section. Please refresh the page.</p>
          <p className="text-sm mt-2">{String(error)}</p>
        </div>
      );
    }
  };

  const getSectionTitle = (section: SettingsSection) => {
    const titles: Record<SettingsSection, string> = {
      theme: "Theme",
      notifications: "Notifications",
      concurrency: "Concurrency & Execution",
      retention: "Data Retention",
      privacy: "Privacy & Permissions",
      workspace: "Workspace",
      audit: "Audit Logs",
      tokens: "Authentication Tokens",
      billing: "Billing & Subscription",
    };
    return titles[section];
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getSectionTitle(activeSection)}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure your workspace settings
              </p>
            </div>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDiscard}>
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-electric-glow">
                  <DocumentCheckIcon className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

