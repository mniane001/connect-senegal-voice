
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/admin/DashboardStats";
import QuestionFilters from "@/components/admin/QuestionFilters";
import RencontreFilters from "@/components/admin/RencontreFilters";
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
  const [questionStatusFilter, setQuestionStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [rencontreStatusFilter, setRencontreStatusFilter] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedRencontre, setSelectedRencontre] = useState<Rencontre | null>(null);
  const queryClient = useQueryClient();

  const { data: questions } = useQuery({
    queryKey: ["questions", questionStatusFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("doleances")
        .select("*");

      if (questionStatusFilter !== "all") {
        query = query.eq("status", questionStatusFilter);
      }
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Question[];
    },
  });

  const { data: rencontres } = useQuery({
    queryKey: ["rencontres", rencontreStatusFilter],
    queryFn: async () => {
      let query = supabase
        .from("audiences")
        .select("*");

      if (rencontreStatusFilter !== "all") {
        query = query.eq("status", rencontreStatusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Rencontre[];
    },
  });

  const handleQuestionStatusUpdate = async (questionId: string, newStatus: string) => {
    queryClient.setQueryData(["questions", questionStatusFilter, categoryFilter], (oldData: Question[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(question => 
        question.id === questionId 
          ? { ...question, status: newStatus }
          : question
      );
    });
  };

  const handleRencontreStatusUpdate = async (rencontreId: string, newStatus: string) => {
    queryClient.setQueryData(["rencontres", rencontreStatusFilter], (oldData: Rencontre[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(rencontre => 
        rencontre.id === rencontreId 
          ? { ...rencontre, status: newStatus }
          : rencontre
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

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Questions écrites</h2>
          <QuestionFilters
            statusFilter={questionStatusFilter}
            categoryFilter={categoryFilter}
            onStatusChange={setQuestionStatusFilter}
            onCategoryChange={setCategoryFilter}
          />

          <QuestionList 
            questions={questions || []} 
            onViewDetails={setSelectedQuestion}
            onStatusUpdate={handleQuestionStatusUpdate}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Demandes de rencontre</h2>
          <RencontreFilters
            statusFilter={rencontreStatusFilter}
            onStatusChange={setRencontreStatusFilter}
          />

          <RencontreList 
            rencontres={rencontres || []} 
            onViewDetails={setSelectedRencontre}
            onStatusUpdate={handleRencontreStatusUpdate}
          />
        </div>

        <QuestionDetailsModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onStatusUpdate={handleQuestionStatusUpdate}
        />

        <RencontreDetailsModal
          rencontre={selectedRencontre}
          onClose={() => setSelectedRencontre(null)}
          onStatusUpdate={handleRencontreStatusUpdate}
        />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
