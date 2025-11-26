import { useState } from "react";
import { MCPHeader } from "@/components/mcp/MCPHeader";
import { ServerListPanel } from "@/components/mcp/ServerListPanel";
import { ServerDetailPanel } from "@/components/mcp/ServerDetailPanel";
import { DiscoveryPanel } from "@/components/mcp/DiscoveryPanel";
import { useMcpStore } from "@/stores/mcpStore";
import { clsx } from "clsx";

export const MCPServerManagerPage = () => {
  const { servers, selectedServerId, setSelectedServer } = useMcpStore();
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [healthFilter, setHealthFilter] = useState("all");

  const selectedServer = selectedServerId ? servers[selectedServerId] : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <MCPHeader
        onDiscover={() => setShowDiscovery(true)}
        onAddServer={() => setShowDiscovery(true)}
        healthFilter={healthFilter}
        onHealthFilterChange={setHealthFilter}
      />

      <div className="flex-1 flex overflow-hidden">
        <ServerListPanel
          healthFilter={healthFilter}
          onServerSelect={setSelectedServer}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedServer ? (
            <ServerDetailPanel server={selectedServer} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No server selected</p>
                <p className="text-sm">
                  Select a server from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDiscovery && (
        <DiscoveryPanel onClose={() => setShowDiscovery(false)} />
      )}
    </div>
  );
};

