
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { FileText } from "lucide-react";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";

interface Initiative {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
  ministry?: string;
  legislature: string;
}

const QuestionsEcritesPage = () => {
  const [selectedTab, setSelectedTab] = useState("15");

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions-ecrites", selectedTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("type", "question_ecrite")
        .eq("legislature", selectedTab)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des questions:", error);
        return [];
      }

      return data as Initiative[];
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "submitted":
        return { label: "En attente de réponse", class: "bg-yellow-100 text-yellow-800" };
      case "in_progress":
        return { label: "En cours de traitement", class: "bg-blue-100 text-blue-800" };
      case "completed":
        return { label: "Répondu", class: "bg-green-100 text-green-800" };
      case "rejected":
        return { label: "Sans réponse", class: "bg-red-100 text-red-800" };
      default:
        return { label: status, class: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 md:py-32" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url("https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`
        }}
      >
        <div className="container-custom text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Questions Écrites
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Interrogations formelles adressées au gouvernement sur des sujets spécifiques
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="mb-6">
          <BackButton to="/initiatives" />
        </div>
        
        <Tabs defaultValue="15" onValueChange={setSelectedTab} className="mb-8">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="15">15e Législature (2022-2027)</TabsTrigger>
              <TabsTrigger value="14">14e Législature (2017-2022)</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="15">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                15e Législature (2022-2027)
              </h2>
              <p className="text-gray-600 mb-4">
                Questions écrites déposées pendant la législature actuelle
              </p>
            </div>
          </TabsContent>

          <TabsContent value="14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                14e Législature (2017-2022)
              </h2>
              <p className="text-gray-600 mb-4">
                Questions écrites déposées pendant la législature précédente
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="overflow-hidden rounded-xl shadow-md bg-white mb-8">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-10 w-10 border-4 border-assembly-blue border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des questions...</p>
            </div>
          ) : questions && questions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Question</TableHead>
                  <TableHead>Ministère</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => {
                  const statusDisplay = getStatusDisplay(question.status);
                  return (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        {question.title}
                        <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                      </TableCell>
                      <TableCell>{question.ministry || "Non spécifié"}</TableCell>
                      <TableCell>{formatDate(question.created_at)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${statusDisplay.class}`}>
                          {statusDisplay.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link 
                          to={`/initiatives/questions-ecrites/${question.id}`}
                          className="text-assembly-blue hover:underline"
                        >
                          Voir le détail
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600">Aucune question écrite disponible pour cette législature.</p>
            </div>
          )}
        </div>

        <div className="bg-assembly-blue/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-assembly-blue mb-4">
            À propos des questions écrites
          </h3>
          <p className="mb-4">
            Les questions écrites sont un moyen pour les députés d'interroger formellement les membres du gouvernement sur des sujets spécifiques. Le ministre concerné dispose généralement d'un délai pour fournir une réponse écrite.
          </p>
          <p>
            Ces questions constituent un outil important du contrôle parlementaire de l'action gouvernementale et permettent d'aborder des problématiques locales ou nationales qui préoccupent les citoyens.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionsEcritesPage;
