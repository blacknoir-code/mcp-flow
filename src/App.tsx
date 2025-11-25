import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserChrome } from "./components/BrowserChrome";
import Dashboard from "./pages/Dashboard";
import WorkflowCanvas from "./pages/WorkflowCanvas";
import Templates from "./pages/Templates";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BrowserChrome>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workflow" element={<WorkflowCanvas />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/integrations" element={<Integrations />} />
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
