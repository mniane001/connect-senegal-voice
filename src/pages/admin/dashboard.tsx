
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/admin/DashboardStats";
import QuestionFilters from "@/components/admin/QuestionFilters";
import QuestionList from "@/components/admin/QuestionList";
import RencontreList from "@/components/admin/RencontreList";
import QuestionDetailsModal from "@/components/admin/QuestionDetailsModal";
import RencontreDetailsModal from "@/components/admin/RencontreDetailsModal";

interface Question {
  id: string;
  created_at: string;
  name: string;
  email: string;
  category: string;
  status: string;
  title: string;
  description: string;
}

interface Rencontre {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  meeting_date?: string;
}

const DashboardPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedRencontre, setSelectedRencontre] = useState<Rencontre | null>(null);
  const queryClient = useQueryClient();

  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions", statusFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("doleances")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Question[];
    },
  });

  const { data: rencontres, isLoading: loadingRencontres } = useQuery({
    queryKey: ["rencontres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audiences")
        .select("*");
      if (error) throw error;
      return data as Rencontre[];
    },
  });

  const handleStatusUpdate = async (questionId: string, newStatus: string) => {
    // Mettre à jour le cache de React Query avec la nouvelle valeur
    queryClient.setQueryData(["questions", statusFilter, categoryFilter], (oldData: Question[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(question => 
        question.id === questionId 
          ? { ...question, status: newStatus }
          : question
      );
    });
  };

  const stats = {
    totalQuestions: questions?.length || 0,
    totalRencontres: rencontres?.length || 0,
    questionsEnAttente: questions?.filter(d => d.status === "submitted").length || 0,
    rencontresEnAttente: rencontres?.filter(a => a.status === "pending").length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administratif</h1>

        <DashboardStats {...stats} />

        <QuestionFilters
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          onStatusChange={setStatusFilter}
          onCategoryChange={setCategoryFilter}
        />

        <QuestionList 
          questions={questions || []} 
          onViewDetails={setSelectedQuestion}
          onStatusUpdate={handleStatusUpdate}
        />

        <RencontreList 
          rencontres={rencontres || []} 
          onViewDetails={setSelectedRencontre}
        />

        <QuestionDetailsModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onStatusUpdate={handleStatusUpdate}
        />

        <RencontreDetailsModal
          rencontre={selectedRencontre}
          onClose={() => setSelectedRencontre(null)}
        />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
