
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Calendar, FileCheck } from "lucide-react";
import BackButton from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";

interface PropositionLoi {
  id: string;
  title: string;
  description: string;
  created_at: string;
  document_url?: string;
  status: string;
}

const PropositionLoiDetailPage = () => {
  const { id } = useParams();

  const { data: proposition, isLoading } = useQuery({
    queryKey: ["proposition-loi", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("id", id)
        .eq("type", "proposition_loi")
        .single();

      if (error) {
        console.error("Error fetching proposition:", error);
        throw error;
      }

      return data as PropositionLoi;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "submitted": return "Déposée";
      case "in_progress": return "En commission";
      case "completed": return "Votée";
      case "approved": return "Adoptée";
      case "rejected": return "Rejetée";
      default: return status;
    }
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
          <BackButton to="/initiatives/propositions-loi" />
        </div>
        {proposition ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-assembly-blue p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">
                {proposition.title}
              </h1>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Déposée le {formatDate(proposition.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>Statut: {getStatusDisplay(proposition.status)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-assembly-blue mb-4">Exposé des motifs</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                  {proposition.description}
                </p>

                <h2 className="text-xl font-bold text-assembly-blue mb-4">État d'avancement</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['submitted', 'in_progress', 'completed', 'approved', 'rejected'].includes(proposition.status) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>1</div>
                    <div>
                      <h3 className="font-bold">Dépôt</h3>
                      <p className="text-sm text-gray-500">{formatDate(proposition.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['in_progress', 'completed', 'approved', 'rejected'].includes(proposition.status) 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>2</div>
                    <div>
                      <h3 className="font-bold">Examen en commission</h3>
                      <p className="text-sm text-gray-500">
                        {proposition.status === 'in_progress' ? 'En cours' : 
                         ['completed', 'approved', 'rejected'].includes(proposition.status) ? 'Terminé' : 'À venir'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['completed', 'approved', 'rejected'].includes(proposition.status) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>3</div>
                    <div>
                      <h3 className="font-bold">Vote en séance plénière</h3>
                      <p className="text-sm text-gray-500">
                        {proposition.status === 'completed' ? 'Vote effectué' :
                         proposition.status === 'approved' ? 'Proposition adoptée' :
                         proposition.status === 'rejected' ? 'Proposition rejetée' : 'À venir'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    proposition.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : proposition.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getStatusDisplay(proposition.status)}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-assembly-blue hover:underline text-sm">
                      Partager
                    </button>
                    {proposition.document_url && (
                      <a 
                        href={proposition.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-assembly-blue hover:underline text-sm"
                      >
                        Télécharger le texte intégral
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-500 mb-4">Proposition non trouvée</h2>
            <p>La proposition de loi que vous recherchez n'existe pas ou a été supprimée.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PropositionLoiDetailPage;
