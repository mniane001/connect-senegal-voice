
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Calendar, User, Video, Building2 } from "lucide-react";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";

interface QuestionOrale {
  id: string;
  title: string;
  description: string;
  created_at: string;
  ministry?: string;
  video_url?: string;
  status: string;
  response?: string;
}

const QuestionOraleDetailPage = () => {
  const { id } = useParams();

  const { data: question, isLoading } = useQuery({
    queryKey: ["question-orale", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("id", id)
        .eq("type", "question_orale")
        .single();

      if (error) {
        console.error("Error fetching question:", error);
        throw error;
      }

      return data as QuestionOrale;
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
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
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
          <BackButton to="/initiatives/questions-orales" />
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
                  <span>Session du {formatDate(question.created_at)}</span>
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
                {question.video_url && (
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                    <iframe 
                      className="w-full h-full"
                      src={question.video_url}
                      title="Intervention parlementaire"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                <h2 className="text-xl font-bold text-assembly-blue mb-4">Question</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                  {question.description}
                </p>

                {question.response && (
                  <>
                    <h2 className="text-xl font-bold text-assembly-blue mb-4">Réponse</h2>
                    <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                      {question.response}
                    </p>
                  </>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    question.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {question.status === 'completed' 
                      ? 'Répondu' 
                      : question.status === 'in_progress' 
                        ? 'En cours de traitement' 
                        : 'En attente'}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-assembly-blue hover:underline text-sm">
                      Partager
                    </button>
                    {question.video_url && (
                      <a 
                        href={question.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-assembly-blue hover:underline text-sm"
                      >
                        Voir la vidéo
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

export default QuestionOraleDetailPage;
