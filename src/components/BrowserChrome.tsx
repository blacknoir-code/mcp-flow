import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Plus, 
  X,
  Settings,
  Grid3x3,
  Sparkles,
  Home,
  GitBranch,
  Wand2,
  Server,
  Cpu,
  History,
  SquareStack
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RegenerateAIButton } from "./RegenerateAIButton";
import { useAddCardStore } from "@/stores/addCardStore";

interface Tab {
  id: string;
  title: string;
  path: string;
}

export const BrowserChrome = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const openAddCard = useAddCardStore((state) => state.open);
  
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", title: "Dashboard", path: "/" },
  ]);
  const [activeTab, setActiveTab] = useState("1");

  const currentPath = location.pathname;
  
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/workflow": return "Workflow Builder";
      case "/runs": return "Workflow Runs";
      case "/templates": return "Templates";
      case "/integrations": return "Integrations";
      case "/mcp-servers": return "MCP Server Manager";
      case "/settings": return "Settings";
      default: return "MCP Browser";
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    const existingTab = tabs.find(t => t.path === path);
    if (!existingTab) {
      const newTab: Tab = {
        id: String(tabs.length + 1),
        title: getPageTitle(path),
        path: path,
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newTab.id);
    } else {
      setActiveTab(existingTab.id);
    }
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[newTabs.length - 1];
      setActiveTab(newActiveTab.id);
      navigate(newActiveTab.path);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Browser Chrome */}
      <div className="bg-card border-b border-border">
        {/* Tab Bar */}
        <div className="flex items-center px-2 pt-2 gap-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.path);
              }}
              className={cn(
                "group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-colors",
                tab.path === currentPath
                  ? "bg-canvas text-foreground"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              )}
            >
              <span className="text-sm font-medium max-w-[150px] truncate">
                {tab.title}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleNavigate("/")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-canvas">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.history.forward()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.location.reload()}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 flex items-center gap-2 bg-muted/30 rounded-lg px-4 py-2 border border-border">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm flex-1 truncate">
              mcp://browser{currentPath === "/" ? "" : currentPath}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/")}
              title="Home"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/workflow")}
              title="Workflow Builder"
            >
              <GitBranch className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/runs")}
              title="Workflow Runs"
            >
              <History className="h-4 w-4" />
            </Button>
            <RegenerateAIButton />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={openAddCard}
              title="Add Card"
            >
              <SquareStack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/integrations")}
              title="Integrations"
            >
              <Server className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/mcp-servers")}
              title="MCP Server Manager"
            >
              <Cpu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/templates")}
              title="Templates"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleNavigate("/settings")}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 bg-canvas" style={{ minHeight: 0, overflow: currentPath === '/workflow' ? 'hidden' : 'auto' }}>
        {children}
      </div>
    </div>
  );
};
