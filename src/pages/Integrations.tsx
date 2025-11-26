import { useState } from "react";
import { IntegrationCard } from "@/components/IntegrationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Sparkles, 
  Plus, 
  Activity,
  Server,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mcpServers = [
    {
      id: "1",
      name: "Gmail Server",
      status: "healthy" as const,
      url: "mcp://gmail.server",
      lastPing: "2s ago",
      requestCount: "1.2K",
    },
    {
      id: "2",
      name: "Jira Server",
      status: "healthy" as const,
      url: "mcp://jira.server",
      lastPing: "5s ago",
      requestCount: "856",
    },
    {
      id: "3",
      name: "Slack Server",
      status: "warning" as const,
      url: "mcp://slack.server",
      lastPing: "45s ago",
      requestCount: "634",
    },
  ];

  const integrations = [
    { id: "gmail-1", name: "Gmail", status: "connected" as const, lastSync: "2 min ago" },
    { id: "jira-1", name: "Jira", status: "connected" as const, lastSync: "5 min ago" },
    { id: "slack-1", name: "Slack", status: "needs-auth" as const },
  ];

  return (
    <div className="min-h-full">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>MCP Servers & Apps</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Integrations</h1>
          <p className="text-lg text-muted-foreground">
            Manage your MCP servers and connected applications
          </p>
        </div>

        {/* MCP Server Status */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">MCP Server Health</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time status of your backend servers
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {mcpServers.map((server) => (
              <Card key={server.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      server.status === "healthy" ? "bg-success/10" : "bg-warning/10"
                    }`}>
                      <Server className={`h-5 w-5 ${
                        server.status === "healthy" ? "text-success" : "text-warning"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{server.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{server.url}</p>
                    </div>
                  </div>
                  {server.status === "healthy" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-warning" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Ping</span>
                    <span className="font-medium">{server.lastPing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Requests</span>
                    <span className="font-medium">{server.requestCount}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Activity className="h-3 w-3 mr-2" />
                  View Logs
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Connected Apps */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Connected Applications</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage OAuth connections and permissions
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                id={integration.id}
                name={integration.name}
                status={integration.status}
                lastSync={integration.lastSync}
              />
            ))}
            
            {/* Add New Integration Card */}
            <Card className="p-5 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="p-3 rounded-xl bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Add Integration</h3>
                <p className="text-xs text-muted-foreground">
                  Connect a new app
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Rate Limits Section */}
        <section className="mt-12">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Rate Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Current usage across all integrations
                </p>
              </div>
              <Badge variant="outline">Last hour</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gmail API</span>
                  <span className="font-medium">245 / 1000</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "24.5%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jira API</span>
                  <span className="font-medium">856 / 1500</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "57%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Slack API</span>
                  <span className="font-medium">124 / 500</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "24.8%" }} />
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Integrations;
