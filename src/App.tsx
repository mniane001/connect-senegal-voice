
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import IndexPage from "./pages/Index";
import BiographiePage from "./pages/biographie";
import QuestionsEcritesPage from "./pages/initiatives/questions-ecrites";
import QuestionsOralesPage from "./pages/initiatives/questions-orales";
import PropositionsLoiPage from "./pages/initiatives/propositions-loi";
import CommissionsEnquetePage from "./pages/initiatives/commissions-enquete";
import QuestionEcritePage from "./pages/doleances";
import QuestionEcriteDetailPage from "./pages/initiatives/questions-ecrites/[id]";
import QuestionOraleDetailPage from "./pages/initiatives/questions-orales/[id]";
import PropositionLoiDetailPage from "./pages/initiatives/propositions-loi/[id]";
import CommissionEnqueteDetailPage from "./pages/initiatives/commissions-enquete/[id]";
import InitiativesPage from "./pages/initiatives";
import AudiencePage from "./pages/audience";
import AdminRoute from "./components/AdminRoute";
import DashboardPage from "./pages/admin/dashboard";
import AdminInitiativesPage from "./pages/admin/initiatives";
import AdminQuestionsPage from "./pages/admin/questions";
import AdminAudiencesPage from "./pages/admin/audiences";
import AdminActualitesPage from "./pages/admin/actualites";
import AuthPage from "./pages/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/biographie" element={<BiographiePage />} />
        <Route path="/initiatives" element={<InitiativesPage />} />
        <Route path="/initiatives/questions-ecrites" element={<QuestionsEcritesPage />} />
        <Route path="/initiatives/questions-ecrites/:id" element={<QuestionEcriteDetailPage />} />
        <Route path="/initiatives/questions-orales" element={<QuestionsOralesPage />} />
        <Route path="/initiatives/questions-orales/:id" element={<QuestionOraleDetailPage />} />
        <Route path="/initiatives/propositions-loi" element={<PropositionsLoiPage />} />
        <Route path="/initiatives/propositions-loi/:id" element={<PropositionLoiDetailPage />} />
        <Route path="/initiatives/commissions-enquete" element={<CommissionsEnquetePage />} />
        <Route path="/initiatives/commissions-enquete/:id" element={<CommissionEnqueteDetailPage />} />
        <Route path="/doleances" element={<QuestionEcritePage />} />
        <Route path="/audience" element={<AudiencePage />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        } />
        <Route path="/admin/initiatives" element={
          <AdminRoute>
            <AdminInitiativesPage />
          </AdminRoute>
        } />
        <Route path="/admin/questions" element={
          <AdminRoute>
            <AdminQuestionsPage />
          </AdminRoute>
        } />
        <Route path="/admin/audiences" element={
          <AdminRoute>
            <AdminAudiencesPage />
          </AdminRoute>
        } />
        <Route path="/admin/actualites" element={
          <AdminRoute>
            <AdminActualitesPage />
          </AdminRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
