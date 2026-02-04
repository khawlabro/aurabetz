import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import { useEffect } from "react";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { upsertUser, getUserProfile } from "./lib/firestore";
import { useLocation } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/preview-landing"} component={Landing} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user, loading } = useFirebaseAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleUserFlow = async () => {
      if (user && !loading) {
        try {
          await upsertUser(user.id, {
            id: user.id,
            email: user.email,
            name: user.name,
            photoURL: user.photoURL,
            lastSignedIn: new Date(),
          });

          const profile = await getUserProfile(user.id);
          const isAtEntry = location === "/" || location === "/preview-landing";
          
          if (isAtEntry) {
            if (!profile?.preferredSports && !profile?.wantsAllPicks) {
              navigate("/onboarding");
            } else {
              navigate("/dashboard");
            }
          }
        } catch (error) {
          console.error("Error in user flow:", error);
        }
      }
    };

    handleUserFlow();
  }, [user, loading, navigate, location]);

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
