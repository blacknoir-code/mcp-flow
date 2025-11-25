import { useState } from "react";
import { WorkflowCard } from "@/components/WorkflowCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Save, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Mail,
  CheckSquare,
  MessageSquare,
  FileText,
  Layers
} from "lucide-react";

const WorkflowCanvas = () => {
  const [isExecuting, setIsExecuting] = useState(false);

  const workflowSteps = [
    {
      id: "1",
      title: "Get Unread Emails",
      app: "Gmail",
      status: "success" as const,
      icon: Mail,
      inputs: { filter: "is:unread label:tickets" },
      outputs: { emails: 12, processed: 12 },
    },
    {
      id: "2",
      title: "Extract Ticket IDs",
      app: "Parser",
      status: "success" as const,
      icon: FileText,
      inputs: { pattern: "PROJ-\\d+" },
      outputs: { tickets: ["PROJ-123", "PROJ-124", "PROJ-125"] },
    },
    {
      id: "3",
      title: "Update Jira Tickets",
      app: "Jira",
      status: "running" as const,
      icon: CheckSquare,
      inputs: { tickets: ["PROJ-123", "PROJ-124", "PROJ-125"] },
    },
    {
      id: "4",
      title: "Generate Summary",
      app: "AI",
      status: "pending" as const,
      icon: Sparkles,
    },
    {
      id: "5",
      title: "Post to Slack",
      app: "Slack",
      status: "pending" as const,
      icon: MessageSquare,
      inputs: { channel: "#updates" },
    },
  ];

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
                <h1 className="text-xl font-bold">Gmail → Jira → Slack Pipeline</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">5 steps</Badge>
                  <Badge variant="outline" className="text-xs">
                    <span className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse" />
                    Running
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsExecuting(!isExecuting)}
                className="bg-gradient-to-r from-primary to-electric-glow"
              >
                <Play className="h-4 w-4 mr-2" />
                {isExecuting ? "Stop" : "Run Workflow"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Workflow Steps */}
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Workflow Pipeline</h2>
              </div>

              <div className="space-y-4 relative">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <WorkflowCard
                      title={step.title}
                      app={step.app}
                      status={step.status}
                      icon={step.icon}
                      inputs={step.inputs}
                      outputs={step.outputs}
                    />
                    
                    {index < workflowSteps.length - 1 && (
                      <div className="flex justify-center my-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="h-8 w-0.5 bg-border" />
                          <ArrowRight className="h-4 w-4" />
                          <div className="h-8 w-0.5 bg-border" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6 border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-2">Understanding:</p>
                  <p className="font-medium">
                    Processing unread Gmail messages, extracting Jira ticket references, 
                    updating tickets, and posting summary to Slack.
                  </p>
                </div>

                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-success font-medium">✓ Workflow validated</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All required permissions are granted
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">SUGGESTIONS</p>
                  <button className="w-full text-left p-2 hover:bg-muted/50 rounded-lg text-xs transition-colors">
                    Add error handling for failed updates
                  </button>
                  <button className="w-full text-left p-2 hover:bg-muted/50 rounded-lg text-xs transition-colors">
                    Filter emails from last 24 hours only
                  </button>
                  <button className="w-full text-left p-2 hover:bg-muted/50 rounded-lg text-xs transition-colors">
                    Include ticket status in summary
                  </button>
                </div>
              </div>
            </div>

            {/* Execution Timeline */}
            <div className="bg-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold mb-4">Execution Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Get Unread Emails</p>
                    <p className="text-xs text-muted-foreground">Completed • 2.3s</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Extract Ticket IDs</p>
                    <p className="text-xs text-muted-foreground">Completed • 0.8s</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Update Jira Tickets</p>
                    <p className="text-xs text-primary">Running • 4.1s</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Generate Summary</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Post to Slack</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkflowCanvas;
