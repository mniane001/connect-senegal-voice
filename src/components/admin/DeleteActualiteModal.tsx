
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface DeleteActualiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  actualiteId: string;
  actualiteTitle: string;
  onActualiteDeleted: () => void;
}

const DeleteActualiteModal = ({
  isOpen,
  onClose,
  actualiteId,
  actualiteTitle,
  onActualiteDeleted,
}: DeleteActualiteModalProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("actualites")
        .delete()
        .eq("id", actualiteId);

      if (error) throw error;

      toast({
        title: "Actualité supprimée",
        description: "L'actualité a été supprimée avec succès",
      });
      onActualiteDeleted();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer l'actualité "{actualiteTitle}". 
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteActualiteModal;
