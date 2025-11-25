import { useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";

const categories = ["All", "PM", "Ops", "Engineering", "Support", "CRM", "Billing"];

const templates = [
  {
    id: "1",
    title: "Gmail → Jira Triage",
    description: "Automatically create Jira tickets from unread emails with specific labels. Perfect for support teams managing incoming requests.",
    category: "PM",
    integrations: ["Gmail", "Jira"],
    timeSaved: "2h/week",
  },
  {
    id: "2",
    title: "Daily Standup Summary",
    description: "Collect updates from Slack threads and generate a formatted daily standup summary posted to your team channel.",
    category: "Ops",
    integrations: ["Slack"],
    timeSaved: "30min/day",
  },
  {
    id: "3",
    title: "Support Escalation Pipeline",
    description: "Monitor support tickets and automatically escalate critical issues to the right team with context and priority.",
    category: "Support",
    integrations: ["Jira", "Slack"],
    timeSaved: "1h/day",
  },
  {
    id: "4",
    title: "PR Review Reminder",
    description: "Send automated reminders to team members for pending pull request reviews via Slack with direct links.",
    category: "Engineering",
    integrations: ["Slack"],
    timeSaved: "1h/week",
  },
  {
    id: "5",
    title: "Weekly Report Generator",
    description: "Aggregate data from multiple sources and generate comprehensive weekly reports automatically.",
    category: "Ops",
    integrations: ["Gmail", "Jira", "Slack"],
    timeSaved: "3h/week",
  },
  {
    id: "6",
    title: "Customer Onboarding Flow",
    description: "Automate the entire customer onboarding process from signup to first success milestone.",
    category: "CRM",
    integrations: ["Gmail", "Slack"],
    timeSaved: "5h/week",
  },
  {
    id: "7",
    title: "Invoice Follow-up",
    description: "Automatically send follow-up emails for unpaid invoices with payment links and reminders.",
    category: "Billing",
    integrations: ["Gmail"],
    timeSaved: "2h/week",
  },
  {
    id: "8",
    title: "Bug Triage Automation",
    description: "Automatically categorize and assign incoming bug reports based on content and severity.",
    category: "Engineering",
    integrations: ["Jira", "Slack"],
    timeSaved: "4h/week",
  },
  {
    id: "9",
    title: "Meeting Notes Distributor",
    description: "Extract action items from meeting notes and distribute to relevant team members automatically.",
    category: "Ops",
    integrations: ["Slack"],
    timeSaved: "45min/day",
  },
];

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Pre-built Workflows</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Template Library</h1>
          <p className="text-lg text-muted-foreground">
            Start with proven workflows and customize them to your needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              title={template.title}
              description={template.description}
              category={template.category}
              integrations={template.integrations}
              timeSaved={template.timeSaved}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">No templates found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
