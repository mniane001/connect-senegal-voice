
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/admin/DashboardStats";
import DetailedStats from "@/components/admin/DetailedStats";
import { Link } from "react-router-dom";
import { FileText, Users, BookOpen, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: questions } = useQuery({
    queryKey: ["dashboard_questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doleances")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: rencontres } = useQuery({
    queryKey: ["dashboard_rencontres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audiences")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: initiatives } = useQuery({
    queryKey: ["initiatives_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: actualites } = useQuery({
    queryKey: ["actualites_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const initiativesStats = {
    total: initiatives?.length || 0,
    by_type: {
      question_ecrite: initiatives?.filter(i => i.type === "question_ecrite").length || 0,
      question_orale: initiatives?.filter(i => i.type === "question_orale").length || 0,
      commission_enquete: initiatives?.filter(i => i.type === "commission_enquete").length || 0,
      proposition_loi: initiatives?.filter(i => i.type === "proposition_loi").length || 0,
    },
    by_legislature: {
      "15": initiatives?.filter(i => i.legislature === "15").length || 0,
      "14": initiatives?.filter(i => i.legislature === "14").length || 0,
    },
    by_status: {
      submitted: initiatives?.filter(i => i.status === "submitted").length || 0,
      in_progress: initiatives?.filter(i => i.status === "in_progress").length || 0,
      completed: initiatives?.filter(i => i.status === "completed").length || 0,
      approved: initiatives?.filter(i => i.status === "approved").length || 0,
      rejected: initiatives?.filter(i => i.status === "rejected").length || 0,
    }
  };

  // Calculer les statistiques des questions citoyennes
  const questionCategories = questions 
    ? [...new Set(questions.map(q => q.category))]
    : [];
  
  const questionStatsData = {
    total: questions?.length || 0,
    by_status: {
      submitted: questions?.filter(q => q.status === "submitted").length || 0,
      in_progress: questions?.filter(q => q.status === "in_progress").length || 0,
      completed: questions?.filter(q => q.status === "completed").length || 0,
      rejected: questions?.filter(q => q.status === "rejected").length || 0,
    },
    by_category: questionCategories.reduce((acc, category) => {
      acc[category] = questions?.filter(q => q.category === category).length || 0;
      return acc;
    }, {} as Record<string, number>)
  };

  // Calculer les statistiques des audiences
  const audienceStatsData = {
    total: rencontres?.length || 0,
    by_status: {
      pending: rencontres?.filter(r => r.status === "pending").length || 0,
      approved: rencontres?.filter(r => r.status === "approved").length || 0,
      rejected: rencontres?.filter(r => r.status === "rejected").length || 0,
      completed: rencontres?.filter(r => r.status === "completed").length || 0,
    }
  };

  // Calculer les statistiques des actualités
  const actualiteCategories = actualites 
    ? [...new Set(actualites.map(a => a.category))]
    : [];
  
  const actualiteStatsData = {
    total: actualites?.length || 0,
    by_category: actualiteCategories.reduce((acc, category) => {
      acc[category] = actualites?.filter(a => a.category === category).length || 0;
      return acc;
    }, {} as Record<string, number>)
  };

  const stats = {
    totalQuestions: questions?.length || 0,
    totalRencontres: rencontres?.length || 0,
    questionsEnAttente: questions?.filter(d => d.status === "submitted").length || 0,
    rencontresEnAttente: rencontres?.filter(a => a.status === "pending").length || 0,
    totalInitiatives: initiatives?.length || 0,
    totalActualites: actualites?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administratif</h1>

        <DashboardStats {...stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques détaillées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
                        {initiativesStats.by_type.question_ecrite} Questions écrites
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {initiativesStats.by_type.question_orale} Questions orales
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {initiativesStats.by_type.commission_enquete} Commissions d'enquête
                      </span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                        {initiativesStats.by_type.proposition_loi} Propositions de loi
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link 
                to="/admin/questions" 
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
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {stats.totalQuestions} au total
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link 
                to="/admin/audiences" 
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
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {stats.totalRencontres} au total
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link 
                to="/admin/actualites" 
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
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {stats.totalActualites} publications
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="statistics">
            <DetailedStats
              initiativeStats={initiativesStats}
              questionStats={questionStatsData}
              audienceStats={audienceStatsData}
              actualiteStats={actualiteStatsData}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
