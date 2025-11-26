import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIntegrationStore } from "@/stores/integrationStore";
import { IntegrationHeader } from "@/components/integrations/IntegrationHeader";
import { IntegrationStatusCard } from "@/components/integrations/IntegrationStatusCard";
import { ScopesViewer } from "@/components/integrations/ScopesViewer";
import { TokenManager } from "@/components/integrations/TokenManager";
import { RateLimitPanel } from "@/components/integrations/RateLimitPanel";
import { TriggerToggles } from "@/components/integrations/TriggerToggles";
import { DefaultParamsEditor } from "@/components/integrations/DefaultParamsEditor";
import { TestCallPanel } from "@/components/integrations/TestCallPanel";
import { IntegrationLogs } from "@/components/integrations/IntegrationLogs";
import { IntegrationActivityFeed } from "@/components/integrations/IntegrationActivityFeed";
import { ReconnectModal } from "@/components/integrations/ReconnectModal";
import { RevokeConfirmModal } from "@/components/integrations/RevokeConfirmModal";

const IntegrationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showReconnectModal, setShowReconnectModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [requestedScopes, setRequestedScopes] = useState<string[]>([]);

  const integration = useIntegrationStore((state) => (id ? state.getIntegration(id) : undefined));
  const {
    syncIntegration,
    rotateToken,
    revokeIntegration,
    reconnectIntegration,
    updateTriggerConfig,
    toggleTrigger,
    runTestCall,
    updateDefaultParam,
    updateSettings,
    testTrigger,
    requestMoreScopes,
  } = useIntegrationStore();

  if (!id) {
    navigate("/integrations");
    return null;
  }

  if (!integration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Integration Not Found</h2>
          <p className="text-gray-600 mb-4">The integration you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/integrations")}
            className="text-blue-600 hover:text-blue-700"
          >
            Go to Integrations
          </button>
        </div>
      </div>
    );
  }

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncIntegration(id);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReconnect = () => {
    const missingScopes = integration.scopes.filter((s) => !s.granted).map((s) => s.name);
    if (missingScopes.length > 0) {
      setRequestedScopes(missingScopes);
      setShowReconnectModal(true);
    } else {
      reconnectIntegration(id, []);
    }
  };

  const handleApproveReconnect = () => {
    reconnectIntegration(id, requestedScopes);
    setShowReconnectModal(false);
    setRequestedScopes([]);
  };

  const handleDenyReconnect = () => {
    setShowReconnectModal(false);
    setRequestedScopes([]);
  };

  const handleRequestMoreScopes = () => {
    const missingScopes = integration.scopes.filter((s) => !s.granted).map((s) => s.name);
    if (missingScopes.length > 0) {
      requestMoreScopes(id, missingScopes);
      setRequestedScopes(missingScopes);
      setShowReconnectModal(true);
    }
  };

  const handleRevoke = () => {
    setShowRevokeModal(true);
  };

  const handleConfirmRevoke = () => {
    revokeIntegration(id);
    setShowRevokeModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IntegrationHeader
        integration={integration}
        onReconnect={handleReconnect}
        onRevoke={handleRevoke}
      />

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <IntegrationStatusCard
              integration={integration}
              onSync={handleSync}
              isSyncing={isSyncing}
            />

            <ScopesViewer
              integration={integration}
              onRequestMoreScopes={handleRequestMoreScopes}
            />

            <TokenManager
              integration={integration}
              onRotate={() => rotateToken(id)}
              onRevoke={handleRevoke}
              onUpdateSettings={(settings) => updateSettings(id, settings)}
            />

            <RateLimitPanel
              integration={integration}
              onToggleThrottle={(enabled) => updateSettings(id, { throttleEnabled: enabled })}
            />

            <TriggerToggles
              integration={integration}
              onToggleTrigger={(triggerId, enabled) => toggleTrigger(id, triggerId, enabled)}
              onUpdateConfig={(triggerId, config) => updateTriggerConfig(id, triggerId, config)}
              onTestTrigger={(triggerId) => testTrigger(id, triggerId)}
            />

            <DefaultParamsEditor
              integration={integration}
              onUpdateParam={(key, value) => updateDefaultParam(id, key, value)}
            />

            <TestCallPanel
              integration={integration}
              onRunTestCall={(endpoint, params) => runTestCall(id, endpoint, params)}
            />

            <IntegrationLogs integration={integration} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <IntegrationActivityFeed integration={integration} />
          </div>
        </div>
      </div>

      <ReconnectModal
        open={showReconnectModal}
        onClose={() => setShowReconnectModal(false)}
        integration={integration}
        requestedScopes={requestedScopes}
        onApprove={handleApproveReconnect}
        onDeny={handleDenyReconnect}
      />

      <RevokeConfirmModal
        open={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        integration={integration}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
};

export default IntegrationDetailPage;

