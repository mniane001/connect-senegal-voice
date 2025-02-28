
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionFilters from "@/components/admin/QuestionFilters";
import QuestionList from "@/components/admin/QuestionList";
import QuestionDetailsModal from "@/components/admin/QuestionDetailsModal";
import CreateQuestionModal from "@/components/admin/CreateQuestionModal";
import QuestionStats from "@/components/admin/QuestionStats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const AdminQuestionsPage = () => {
  const [questionStatusFilter, setQuestionStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/admin/dashboard" label="Retour au tableau de bord" />
        </div>

        <h1 className="text-3xl font-bold mb-8">Questions citoyennes</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">Liste des questions</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
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
          </TabsContent>
          
          <TabsContent value="stats">
            {questions && <QuestionStats questions={questions} />}
          </TabsContent>
        </Tabs>

        <QuestionDetailsModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onStatusUpdate={handleQuestionStatusUpdate}
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

export default AdminQuestionsPage;
