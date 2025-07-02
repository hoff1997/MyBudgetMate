import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import Envelopes from "@/pages/envelopes-new";
import Transactions from "@/pages/transactions";
import RulesPage from "@/pages/rules";
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
import LoginPage from "@/pages/login";
import SignUpPage from "@/pages/signup";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import AuthDemoPage from "@/pages/auth-demo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ReconciliationMainPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/accounts" component={AccountsPage} />
      <Route path="/envelopes-new" component={Envelopes} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/rules" component={RulesPage} />
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
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/auth-demo" component={AuthDemoPage} />
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('budgetApp_authenticated');
    setIsAuthenticated(authStatus === 'true');
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('budgetApp_authenticated');
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <LoginForm onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider value={{ logout: handleLogout }}>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
