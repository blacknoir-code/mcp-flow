import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMcpStore } from "@/stores/mcpStore";
import { MCPServer } from "@/data/mockMcpServers";
import { mockFunctions } from "@/data/mockFunctions";
import { v4 as uuidv4 } from "uuid";

interface DiscoveryPanelProps {
  onClose: () => void;
}

export const DiscoveryPanel = ({ onClose }: DiscoveryPanelProps) => {
  const { discoverServers, addServer } = useMcpStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    region: "us-east",
    version: "1.0.0",
    tags: "",
  });

  const handleDiscover = () => {
    discoverServers();
    onClose();
  };

  const handleAddServer = () => {
    if (!formData.name || !formData.endpoint) {
      alert("Name and endpoint are required");
      return;
    }

    const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const newServer: Partial<MCPServer> = {
      id: uuidv4(),
      name: formData.name,
      endpoint: formData.endpoint,
      region: formData.region,
      version: formData.version,
      tags,
      functions: mockFunctions,
      logs: [],
      settings: {
        maintenance: false,
        disabled: false,
        alias: formData.name,
        tags,
      },
    };

    addServer(newServer);
    setShowAddModal(false);
    setFormData({
      name: "",
      endpoint: "",
      region: "us-east",
      version: "1.0.0",
      tags: "",
    });
    onClose();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Discover Servers</DialogTitle>
            <DialogDescription>
              Scan for MCP servers or add one manually
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Auto Discovery</h4>
              <p className="text-sm text-gray-600 mb-4">
                Scan your environment for available MCP servers
              </p>
              <Button onClick={handleDiscover} className="w-full">
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Discover Servers
              </Button>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Manual Add</h4>
              <p className="text-sm text-gray-600 mb-4">
                Add a server manually by providing its details
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
                className="w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Server Manually
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showAddModal && (
        <Dialog open={true} onOpenChange={() => setShowAddModal(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Server</DialogTitle>
              <DialogDescription>
                Enter server details to add it manually
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Server Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="mcp-server-01"
                />
              </div>

              <div>
                <Label htmlFor="endpoint">Endpoint *</Label>
                <Input
                  id="endpoint"
                  value={formData.endpoint}
                  onChange={(e) =>
                    setFormData({ ...formData, endpoint: e.target.value })
                  }
                  placeholder="mcp://server.example.com"
                />
              </div>

              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  placeholder="us-east"
                />
              </div>

              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="production, us"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddServer} className="bg-gradient-to-r from-primary to-electric-glow">
                  Add Server
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

