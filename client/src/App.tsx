import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { upsertUser } from "./lib/firestore";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/preview-landing"} component={Landing} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user } = useFirebaseAuth();

  // Upsert user to Firestore when they sign in
  useEffect(() => {
    if (user) {
      upsertUser(user.id, {
        id: user.id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        createdAt: new Date(),
        lastSignedIn: new Date(),
      }).catch(console.error);
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
