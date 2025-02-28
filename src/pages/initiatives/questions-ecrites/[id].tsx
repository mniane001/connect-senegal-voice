
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { FileText, Calendar, Building2 } from "lucide-react";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";

interface QuestionEcrite {
  id: string;
  title: string;
  description: string;
  created_at: string;
  ministry?: string;
  document_url?: string;
  status: string;
  response?: string;
}

const QuestionEcriteDetailPage = () => {
  const { id } = useParams();

  const { data: question, isLoading } = useQuery({
    queryKey: ["question-ecrite", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("id", id)
        .eq("type", "question_ecrite")
        .single();

      if (error) {
        console.error("Error fetching question:", error);
        throw error;
      }

      return data as QuestionEcrite;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container-custom py-12 mt-16">
          <div className="animate-pulse bg-white rounded-lg shadow-lg p-6">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-custom py-12 mt-16">
        <div className="mb-4">
          <BackButton to="/initiatives/questions-ecrites" />
        </div>
        {question ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-assembly-blue p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">
                {question.title}
              </h1>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Déposée le {formatDate(question.created_at)}</span>
                </div>
                {question.ministry && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{question.ministry}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-assembly-blue mb-4">Question</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                  {question.description}
                </p>

                <h2 className="text-xl font-bold text-assembly-blue mb-4">Réponse du Ministre</h2>
                {question.response ? (
                  <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                    {question.response}
                  </p>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 italic">En attente de réponse</p>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    question.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {question.status === 'completed' 
                      ? 'Répondu' 
                      : 'En attente de réponse'}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-assembly-blue hover:underline text-sm">
                      Partager
                    </button>
                    {question.document_url && (
                      <a 
                        href={question.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-assembly-blue hover:underline text-sm"
                      >
                        Télécharger le PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-500 mb-4">Question non trouvée</h2>
            <p>La question que vous recherchez n'existe pas ou a été supprimée.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default QuestionEcriteDetailPage;
