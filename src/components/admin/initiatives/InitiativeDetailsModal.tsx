
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Initiative } from "./InitiativesList";
import { ExternalLink, Video, File } from "lucide-react";

interface InitiativeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: Initiative | null;
}

interface InitiativeDetails extends Initiative {
  description: string;
  ministry?: string;
  response?: string;
  video_url?: string;
  document_url?: string;
}

const InitiativeDetailsModal = ({ isOpen, onClose, initiative }: InitiativeDetailsModalProps) => {
  const [details, setDetails] = useState<InitiativeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initiative && isOpen) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("initiatives")
            .select("*")
            .eq("id", initiative.id)
            .single();
          
          if (error) throw error;
          setDetails(data as InitiativeDetails);
        } catch (error) {
          console.error("Erreur lors du chargement des détails:", error);
          setDetails(null);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [initiative, isOpen]);

  const getInitiativeTypeLabel = (type: string) => {
    switch(type) {
      case "question_ecrite": return "Question écrite";
      case "question_orale": return "Question orale";
      case "commission_enquete": return "Commission d'enquête";
      case "proposition_loi": return "Proposition de loi";
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "submitted": return "Soumis";
      case "in_progress": return "En cours";
      case "completed": return "Complété";
      case "approved": return "Approuvé";
      case "rejected": return "Rejeté";
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center">
            <p>Chargement des détails...</p>
          </div>
        ) : details ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{details.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                <span className="badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {getInitiativeTypeLabel(details.type)}
                </span>
                <span className="badge bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                  {details.legislature}e Législature
                </span>
                <span className={`badge px-2 py-1 rounded-full text-xs 
                  ${details.status === "rejected" 
                    ? "bg-red-100 text-red-800" 
                    : details.status === "approved" || details.status === "completed"
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"}`}
                >
                  {getStatusLabel(details.status)}
                </span>
                <span className="badge bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                  {new Date(details.created_at).toLocaleDateString()}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-2">
              {details.ministry && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ministère concerné</h3>
                  <p>{details.ministry}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="whitespace-pre-wrap mt-1">{details.description}</p>
              </div>

              {details.response && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Réponse</h3>
                  <p className="whitespace-pre-wrap mt-1">{details.response}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {details.video_url && (
                  <a
                    href={details.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    <Video className="h-4 w-4" />
                    Regarder la vidéo
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}

                {details.document_url && (
                  <a
                    href={details.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    <File className="h-4 w-4" />
                    Consulter le document
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onClose}>Fermer</Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-10 text-center">
            <p>Impossible de charger les détails de l'initiative.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InitiativeDetailsModal;
