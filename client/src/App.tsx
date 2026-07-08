import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminPortal from "./pages/AdminPortal";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogDashboard from "./pages/AdminBlogDashboard";
import AdminContactsDashboard from "./pages/AdminContactsDashboard";
import AdminSettingsDashboard from "./pages/AdminSettingsDashboard";
import AdminContentHero from "./pages/AdminContentHero";
import AdminContentAbout from "./pages/AdminContentAbout";
import AdminContentServices from "./pages/AdminContentServices";
import AdminContentTeam from "./pages/AdminContentTeam";
import AdminContentGallery from "./pages/AdminContentGallery";
import AdminContentTestimonials from "./pages/AdminContentTestimonials";
import AdminContentFaq from "./pages/AdminContentFaq";
import AdminSeoSettings from "./pages/AdminSeoSettings";

function AdminRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/blog" component={AdminBlogDashboard} />
        <Route path="/admin/contacts" component={AdminContactsDashboard} />
        <Route path="/admin/settings" component={AdminSettingsDashboard} />
        <Route path="/admin/content/hero" component={AdminContentHero} />
        <Route path="/admin/content/about" component={AdminContentAbout} />
        <Route path="/admin/content/services" component={AdminContentServices} />
        <Route path="/admin/content/team" component={AdminContentTeam} />
        <Route path="/admin/content/gallery" component={AdminContentGallery} />
        <Route path="/admin/content/testimonials" component={AdminContentTestimonials} />
        <Route path="/admin/content/faq" component={AdminContentFaq} />
        <Route path="/admin/seo" component={AdminSeoSettings} />
        <Route>
          <Redirect to="/admin/dashboard" />
        </Route>
      </Switch>
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portal-secret-entry-omtt" component={AdminPortal} />
      {/* Nested Admin Routes */}
      <Route path="/admin/*" component={AdminRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
