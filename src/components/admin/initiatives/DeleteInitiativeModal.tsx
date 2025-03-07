
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Initiative } from "./InitiativesList";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface DeleteInitiativeModalProps {
  initiative: Initiative | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteInitiativeModal = ({ 
  initiative, 
  onClose, 
  onSuccess 
}: DeleteInitiativeModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!initiative) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("initiatives")
        .delete()
        .eq("id", initiative.id);
        
      if (error) throw error;
      
      toast({
        title: "Initiative supprimée",
        description: "L'initiative a été supprimée avec succès",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'initiative",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={!!initiative} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette initiative ? Cette action ne peut pas être annulée.
            <br /><br />
            <span className="font-medium">{initiative?.title}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInitiativeModal;
