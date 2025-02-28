
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import AuthPage from "@/pages/auth";
import BiographiePage from "@/pages/biographie";
import ActualitesPage from "@/pages/actualites";
import ActualitePage from "@/pages/actualites/[id]";
import InitiativesPage from "@/pages/initiatives";
import QuestionsOralesPage from "@/pages/initiatives/questions-orales";
import QuestionOralePage from "@/pages/initiatives/questions-orales/[id]";
import QuestionsEcritesPage from "@/pages/initiatives/questions-ecrites";
import QuestionEcritePage from "@/pages/initiatives/questions-ecrites/[id]";
import PropositionsLoiPage from "@/pages/initiatives/propositions-loi";
import PropositionLoiPage from "@/pages/initiatives/propositions-loi/[id]";
import CommissionsEnquetePage from "@/pages/initiatives/commissions-enquete";
import CommissionEnquetePage from "@/pages/initiatives/commissions-enquete/[id]";
import DoleancesPage from "@/pages/doleances";
import AudiencePage from "@/pages/audience";
import DashboardPage from "@/pages/admin/dashboard";
import InitiativesAdminPage from "@/pages/admin/initiatives";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminRoute from "@/components/AdminRoute";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/biographie" element={<BiographiePage />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/actualites/:id" element={<ActualitePage />} />
            <Route path="/initiatives" element={<InitiativesPage />} />
            <Route path="/initiatives/questions-orales" element={<QuestionsOralesPage />} />
            <Route path="/initiatives/questions-orales/:id" element={<QuestionOralePage />} />
            <Route path="/initiatives/questions-ecrites" element={<QuestionsEcritesPage />} />
            <Route path="/initiatives/questions-ecrites/:id" element={<QuestionEcritePage />} />
            <Route path="/initiatives/propositions-loi" element={<PropositionsLoiPage />} />
            <Route path="/initiatives/propositions-loi/:id" element={<PropositionLoiPage />} />
            <Route path="/initiatives/commissions-enquete" element={<CommissionsEnquetePage />} />
            <Route path="/initiatives/commissions-enquete/:id" element={<CommissionEnquetePage />} />
            <Route path="/doleances" element={<DoleancesPage />} />
            <Route path="/audience" element={<AudiencePage />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/initiatives"
              element={
                <AdminRoute>
                  <InitiativesAdminPage />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
