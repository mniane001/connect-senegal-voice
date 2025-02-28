
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/admin/DashboardStats";
import { Link } from "react-router-dom";
import { FileText, Users, BookOpen, MessageSquare } from "lucide-react";

const DashboardPage = () => {
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
  });

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
              </div>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
