
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth";
import DoleancesPage from "./pages/doleances";
import AudiencePage from "./pages/audience";
import ActualitesPage from "./pages/actualites";
import ActualitePage from "./pages/actualites/[id]";
import InitiativesPage from "./pages/initiatives";
import QuestionsEcritesPage from "./pages/initiatives/questions-ecrites";
import QuestionEcriteDetailPage from "./pages/initiatives/questions-ecrites/[id]";
import QuestionsOralesPage from "./pages/initiatives/questions-orales";
import QuestionOraleDetailPage from "./pages/initiatives/questions-orales/[id]";
import CommissionsEnquetePage from "./pages/initiatives/commissions-enquete";
import CommissionEnqueteDetailPage from "./pages/initiatives/commissions-enquete/[id]";
import PropositionsLoiPage from "./pages/initiatives/propositions-loi";
import PropositionLoiDetailPage from "./pages/initiatives/propositions-loi/[id]";
import BiographiePage from "./pages/biographie";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/actualites/:id" element={<ActualitePage />} />
            <Route path="/initiatives" element={<InitiativesPage />} />
            <Route path="/initiatives/questions-ecrites" element={<QuestionsEcritesPage />} />
            <Route path="/initiatives/questions-ecrites/:id" element={<QuestionEcriteDetailPage />} />
            <Route path="/initiatives/questions-orales" element={<QuestionsOralesPage />} />
            <Route path="/initiatives/questions-orales/:id" element={<QuestionOraleDetailPage />} />
            <Route path="/initiatives/commissions-enquete" element={<CommissionsEnquetePage />} />
            <Route path="/initiatives/commissions-enquete/:id" element={<CommissionEnqueteDetailPage />} />
            <Route path="/initiatives/propositions-loi" element={<PropositionsLoiPage />} />
            <Route path="/initiatives/propositions-loi/:id" element={<PropositionLoiDetailPage />} />
            <Route path="/biographie" element={<BiographiePage />} />
            <Route
              path="/doleances"
              element={
                <ProtectedRoute>
                  <DoleancesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audience"
              element={
                <ProtectedRoute>
                  <AudiencePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
