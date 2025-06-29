import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Transacoes from "@/pages/transacoes";
import NovaTransacao from "@/pages/nova-transacao";
import Categorias from "@/pages/categorias";
import Sidebar from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="h-screen bg-slate-50">
      <Sidebar />
      <main className="md:ml-64 h-full overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/transacoes" component={Transacoes} />
          <Route path="/nova-transacao" component={NovaTransacao} />
          <Route path="/categorias" component={Categorias} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
