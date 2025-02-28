
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/admin/DashboardStats";
import DetailedStats from "@/components/admin/DetailedStats";
import {
  TrendingUp,
  MessageSquare,
  Users,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminSection {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  count?: number;
}

const AdminDashboard = () => {
  const { data: questions } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doleances")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: rencontres } = useQuery({
    queryKey: ["admin-rencontres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audiences")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: initiatives } = useQuery({
    queryKey: ["admin-initiatives"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: actualites } = useQuery({
    queryKey: ["admin-actualites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const questionsPending = questions?.filter(q => q.status === "submitted").length || 0;
  const rencontresPending = rencontres?.filter(r => r.status === "pending").length || 0;
  const actualitesPublished = actualites?.filter(a => a.published).length || 0;

  const adminSections: AdminSection[] = [
    {
      title: "Initiatives parlementaires",
      description: "Gérer les propositions de loi, questions écrites et orales",
      path: "/admin/initiatives",
      icon: <TrendingUp className="h-5 w-5" />,
      count: initiatives?.length || 0,
    },
    {
      title: "Questions citoyennes",
      description: "Gérer les questions posées par les citoyens",
      path: "/admin/questions",
      icon: <MessageSquare className="h-5 w-5" />,
      count: questions?.length || 0,
    },
    {
      title: "Demandes d'audience",
      description: "Gérer les demandes de rencontre",
      path: "/admin/audiences",
      icon: <Users className="h-5 w-5" />,
      count: rencontres?.length || 0,
    },
    {
      title: "Actualités",
      description: "Gérer les actualités et médias",
      path: "/admin/actualites",
      icon: <Newspaper className="h-5 w-5" />,
      count: actualites?.length || 0,
    },
  ];

  // Statistics for detailed charts
  const initiativeStats = {
    total: initiatives?.length || 0,
    by_type: {
      question_ecrite: initiatives?.filter(i => i.type === 'question_ecrite').length || 0,
      question_orale: initiatives?.filter(i => i.type === 'question_orale').length || 0,
      commission_enquete: initiatives?.filter(i => i.type === 'commission_enquete').length || 0,
      proposition_loi: initiatives?.filter(i => i.type === 'proposition_loi').length || 0,
    },
    by_legislature: {
      "15": initiatives?.filter(i => i.legislature === '15').length || 0,
      "14": initiatives?.filter(i => i.legislature === '14').length || 0,
    },
    by_status: {
      submitted: initiatives?.filter(i => i.status === 'submitted').length || 0,
      in_progress: initiatives?.filter(i => i.status === 'in_progress').length || 0,
      completed: initiatives?.filter(i => i.status === 'completed').length || 0,
      approved: initiatives?.filter(i => i.status === 'approved').length || 0,
      rejected: initiatives?.filter(i => i.status === 'rejected').length || 0,
    }
  };

  const questionStats = {
    total: questions?.length || 0,
    by_status: {
      submitted: questions?.filter(q => q.status === 'submitted').length || 0,
      in_progress: questions?.filter(q => q.status === 'in_progress').length || 0,
      completed: questions?.filter(q => q.status === 'completed').length || 0,
      rejected: questions?.filter(q => q.status === 'rejected').length || 0,
    },
    by_category: questions?.reduce((acc: Record<string, number>, q) => {
      const cat = q.category || 'Non catégorisé';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {}) || {},
  };

  const audienceStats = {
    total: rencontres?.length || 0,
    by_status: {
      pending: rencontres?.filter(r => r.status === 'pending').length || 0,
      approved: rencontres?.filter(r => r.status === 'approved').length || 0,
      rejected: rencontres?.filter(r => r.status === 'rejected').length || 0,
      completed: rencontres?.filter(r => r.status === 'completed').length || 0,
    }
  };

  const actualiteStats = {
    total: actualites?.length || 0,
    by_category: actualites?.reduce((acc: Record<string, number>, a) => {
      const cat = a.category || 'Non catégorisé';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {}) || {},
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
        
        <DashboardStats 
          totalQuestions={questions?.length || 0}
          totalRencontres={rencontres?.length || 0}
          questionsEnAttente={questionsPending}
          rencontresEnAttente={rencontresPending}
          totalInitiatives={initiatives?.length || 0}
          totalActualites={actualites?.length || 0}
          actualitesPubliees={actualitesPublished}
        />

        <h2 className="text-2xl font-semibold mb-4">Sections administratives</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {adminSections.map((section, index) => (
            <Link to={section.path} key={index}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {section.title}
                  </CardTitle>
                  <div className="bg-primary/10 rounded-full p-2 text-primary">
                    {section.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground mb-2">
                    {section.description}
                  </CardDescription>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-lg font-semibold">
                      {section.count} entrées
                    </div>
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Statistiques détaillées</h2>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tendances et analyses</CardTitle>
            <CardDescription>
              Vue d'ensemble statistique des activités parlementaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetailedStats
              initiativeStats={initiativeStats}
              questionStats={questionStats}
              audienceStats={audienceStats}
              actualiteStats={actualiteStats}
            />
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
