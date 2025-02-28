
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Calendar, FileText } from "lucide-react";
import BackButton from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";

interface CommissionEnquete {
  id: string;
  title: string;
  description: string;
  created_at: string;
  document_url?: string;
  status: string;
}

const CommissionEnqueteDetailPage = () => {
  const { id } = useParams();

  const { data: commission, isLoading } = useQuery({
    queryKey: ["commission-enquete", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("id", id)
        .eq("type", "commission_enquete")
        .single();

      if (error) {
        console.error("Error fetching commission:", error);
        throw error;
      }

      return data as CommissionEnquete;
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
      case "submitted": return "Proposée";
      case "in_progress": return "En cours";
      case "completed": return "Terminée";
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
          <BackButton to="/initiatives/commissions-enquete" />
        </div>
        {commission ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-assembly-blue p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">
                {commission.title}
              </h1>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Initiée le {formatDate(commission.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-assembly-blue mb-4">Objectifs de la commission</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                  {commission.description}
                </p>

                <h2 className="text-xl font-bold text-assembly-blue mb-4">État d'avancement</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['submitted', 'in_progress', 'completed'].includes(commission.status) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>1</div>
                    <div>
                      <h3 className="font-bold">Dépôt de la proposition</h3>
                      <p className="text-sm text-gray-500">Complété le {formatDate(commission.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['in_progress', 'completed'].includes(commission.status) 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>2</div>
                    <div>
                      <h3 className="font-bold">Examen en commission</h3>
                      <p className="text-sm text-gray-500">
                        {commission.status === 'in_progress' ? 'En cours' : 
                         commission.status === 'completed' ? 'Terminé' : 'À venir'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      commission.status === 'completed'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>3</div>
                    <div>
                      <h3 className="font-bold">Vote en séance plénière</h3>
                      <p className="text-sm text-gray-500">
                        {commission.status === 'completed' ? 'Terminé' : 'À venir'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    commission.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : commission.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    Statut: {getStatusDisplay(commission.status)}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-assembly-blue hover:underline text-sm">
                      Partager
                    </button>
                    {commission.document_url && (
                      <a 
                        href={commission.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-assembly-blue hover:underline text-sm"
                      >
                        Télécharger le dossier complet
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-500 mb-4">Commission non trouvée</h2>
            <p>La commission d'enquête que vous recherchez n'existe pas ou a été supprimée.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CommissionEnqueteDetailPage;
