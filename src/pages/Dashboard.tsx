import { CommandBar } from "@/components/CommandBar";
import { TemplateCard } from "@/components/TemplateCard";
import { WorkflowCard } from "@/components/WorkflowCard";
import { IntegrationCard } from "@/components/IntegrationCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Settings, Layers } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-electric-glow rounded-xl">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MCP Browser</h1>
                <p className="text-xs text-muted-foreground">Workflow Automation Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Workflow Automation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            What do you want to automate today?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect your tools, describe what you want, and watch the AI build your workflow
          </p>
        </div>

        {/* Command Bar */}
        <div className="mb-16">
          <CommandBar />
        </div>

        {/* Recent Workflows */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">Recent Workflows</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your latest automation runs
              </p>
            </div>
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <WorkflowCard
              title="Get Unread Emails"
              app="Gmail"
              status="success"
              inputs={{ filter: "is:unread" }}
              outputs={{ count: 5 }}
            />
            <WorkflowCard
              title="Update Jira Tickets"
              app="Jira"
              status="running"
              inputs={{ tickets: "PROJ-123, PROJ-124" }}
            />
            <WorkflowCard
              title="Post to Slack"
              app="Slack"
              status="pending"
              inputs={{ channel: "#updates" }}
            />
          </div>
        </section>

        {/* Templates */}
        <section className="mb-16">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Popular Templates</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pre-built workflows to get you started
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TemplateCard
              title="Gmail → Jira Triage"
              description="Automatically create Jira tickets from unread emails with specific labels"
              category="PM"
              integrations={["Gmail", "Jira"]}
              timeSaved="2h/week"
            />
            <TemplateCard
              title="Daily Standup Summary"
              description="Collect updates from Slack and post a formatted summary"
              category="Ops"
              integrations={["Slack"]}
              timeSaved="30min/day"
            />
            <TemplateCard
              title="Support Escalation"
              description="Monitor support tickets and escalate critical issues automatically"
              category="Support"
              integrations={["Jira", "Slack"]}
              timeSaved="1h/day"
            />
          </div>
        </section>

        {/* Connected Apps */}
        <section>
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Connected Apps</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your integrations
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IntegrationCard
              name="Gmail"
              status="connected"
              lastSync="2 min ago"
            />
            <IntegrationCard
              name="Jira"
              status="connected"
              lastSync="5 min ago"
            />
            <IntegrationCard
              name="Slack"
              status="needs-auth"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
