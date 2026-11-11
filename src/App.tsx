
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Projects from "./pages/FindProject";
import ProjectDetail from "./pages/ProjectDetail";
import Organizations from "./pages/Organizations";
import OrganizationDetail from "./pages/OrganizationDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import DashboardHome from "./pages/DashboardHome";
import DashboardProjects from "./pages/DashboardProjects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import EditProfile from "./pages/EditProfile";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminApprovedOrganizations from "./pages/admin/AdminApprovedOrganizations";
import VitalInfo from "./pages/VitalInfo";
import FemTech from "./pages/FemTech";
import FemTechDashboard from "./pages/FemTechDashboard";
import FemTechReviews from "./pages/FemTechReviews";
import ProjectSelfEvaluation from "./pages/ProjectSelfEvaluation";
import Opportunities from "./pages/Opportunities";
import AdvertDetail from "./pages/AdvertDetail";
import AdminVitalInfo from "./pages/admin/AdminVitalInfo";
import AdminOpportunities from "./pages/admin/AdminOpportunities";
import AdminTraffic from "./pages/admin/AdminTraffic";
import AdminAIInsights from "./pages/admin/AdminAIInsights";
import PageTracker from "./components/analytics/PageTracker";
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <PageTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organizations/:id" element={<OrganizationDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/adverts/:id" element={<AdvertDetail />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/vital-info" element={<VitalInfo />} />
            <Route path="/femtech" element={<FemTech />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            
            {/* Protected Dashboard Routes - Flattened structure */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardHome /></PrivateRoute>} />
            <Route path="/dashboard/projects" element={<PrivateRoute><DashboardProjects /></PrivateRoute>} />
            <Route path="/dashboard/femtech/reviews" element={<PrivateRoute><FemTechReviews /></PrivateRoute>} />
            <Route path="/dashboard/femtech" element={<PrivateRoute><FemTechDashboard /></PrivateRoute>} />
            <Route path="/dashboard/self-evaluation" element={<PrivateRoute><ProjectSelfEvaluation /></PrivateRoute>} />
            <Route path="/dashboard/projects/add" element={<PrivateRoute><AddProject /></PrivateRoute>} />
            <Route path="/dashboard/projects/edit/:id" element={<PrivateRoute><EditProject /></PrivateRoute>} />
            <Route path="/dashboard/profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/dashboard/account" element={<PrivateRoute><MyAccount /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/femtech/reviews" element={<AdminRoute><FemTechReviews /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/organizations" element={<AdminRoute><AdminOrganizations /></AdminRoute>} />
            <Route path="/admin/approved-organizations" element={<AdminRoute><AdminApprovedOrganizations /></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
            <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/vital-info" element={<AdminRoute><AdminVitalInfo /></AdminRoute>} />
            <Route path="/admin/opportunities" element={<AdminRoute><AdminOpportunities /></AdminRoute>} />
            <Route path="/admin/traffic" element={<AdminRoute><AdminTraffic /></AdminRoute>} />
            <Route path="/admin/ai-insights" element={<AdminRoute><AdminAIInsights /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
