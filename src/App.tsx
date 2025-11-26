import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserChrome } from "./components/BrowserChrome";
import Dashboard from "./pages/Dashboard";
import WorkflowCanvas from "./pages/WorkflowCanvas";
import WorkflowDetailPage from "./pages/WorkflowDetailPage";
import Templates from "./pages/Templates";
import Integrations from "./pages/Integrations";
import IntegrationDetailPage from "./pages/IntegrationDetailPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get the base path from Vite's import.meta.env.BASE_URL
const basename = import.meta.env.BASE_URL || "/";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <BrowserChrome>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workflow" element={<WorkflowCanvas />} />
            <Route path="/workflow/:id" element={<WorkflowDetailPage />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/integrations/:id" element={<IntegrationDetailPage />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserChrome>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
