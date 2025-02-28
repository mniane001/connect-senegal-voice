
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
import CreateQuestionModal from "@/components/admin/CreateQuestionModal";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const { data: initiativesStats } = useQuery({
    queryKey: ["initiatives_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("type, legislature");
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        by_type: {
          question_ecrite: data.filter(i => i.type === "question_ecrite").length,
          question_orale: data.filter(i => i.type === "question_orale").length,
          commission_enquete: data.filter(i => i.type === "commission_enquete").length,
          proposition_loi: data.filter(i => i.type === "proposition_loi").length,
        },
        by_legislature: {
          "15": data.filter(i => i.legislature === "15").length,
          "14": data.filter(i => i.legislature === "14").length,
        }
      };
      
      return stats;
    },
    enabled: false // Ne chargera pas automatiquement si la table n'existe pas encore
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

        {/* Sections d'administration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/admin/initiatives" 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-assembly-blue/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-assembly-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Initiatives parlementaires</h3>
                <p className="text-gray-600">
                  Gérer les questions écrites, orales, commissions d'enquête et propositions de loi
                </p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Questions écrites
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Questions orales
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Commissions d'enquête
                  </span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                    Propositions de loi
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/dashboard" 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-assembly-blue/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-assembly-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Questions citoyennes</h3>
                <p className="text-gray-600">
                  Gérer les doléances et questions soumises par les citoyens
                </p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {stats.questionsEnAttente} en attente
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/dashboard" 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-assembly-blue/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-assembly-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Demandes d'audience</h3>
                <p className="text-gray-600">
                  Gérer les demandes de rencontre des citoyens
                </p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {stats.rencontresEnAttente} en attente
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/dashboard" 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-assembly-blue/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-assembly-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Actualités et médias</h3>
                <p className="text-gray-600">
                  Gérer les articles et contenus média du site
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Doléances et Audiences */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions écrites citoyennes</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle question
            </Button>
          </div>
          
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

        <CreateQuestionModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onQuestionCreated={() => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
          }}
        />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
