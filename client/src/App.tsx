import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import Envelopes from "@/pages/envelopes-new";
import Transactions from "@/pages/transactions";
import ReconciliationMainPage from "@/pages/reconciliation-main";
import RecurringIncomePage from "@/pages/recurring-income";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import SetupPage from "@/pages/setup";
import ZeroBudgetSetup from "@/pages/zero-budget-setup";
import NetWorthPage from "@/pages/net-worth";
import DebtManagementPage from "@/pages/debt-management";
import EnvelopeBalances from "@/pages/envelope-balances";
import EnvelopePlanning from "@/pages/envelope-planning";
import EnvelopeSummary from "@/pages/envelope-summary";
import AccountsPage from "@/pages/accounts";
import Landing from "@/pages/landing";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route component={Landing} />
      ) : (
        <>
          <Route path="/" component={ReconciliationMainPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/accounts" component={AccountsPage} />
          <Route path="/envelopes-new" component={Envelopes} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/reconciliation" component={ReconciliationMainPage} />
          <Route path="/recurring-income" component={RecurringIncomePage} />
          <Route path="/reports" component={ReportsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/setup" component={SetupPage} />
          <Route path="/zero-budget-setup" component={ZeroBudgetSetup} />
          <Route path="/envelope-planning" component={EnvelopePlanning} />
          <Route path="/envelope-summary" component={EnvelopeSummary} />
          <Route path="/net-worth" component={NetWorthPage} />
          <Route path="/debt-management" component={DebtManagementPage} />
          <Route path="/envelope-balances" component={EnvelopeBalances} />
        </>
      )}
      <Route>
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
            <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Route>
    </Switch>
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
