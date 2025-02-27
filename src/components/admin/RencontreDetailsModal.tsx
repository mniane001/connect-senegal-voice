
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Rencontre {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  meeting_date?: string;
}

interface RencontreDetailsModalProps {
  rencontre: Rencontre | null;
  onClose: () => void;
  onStatusUpdate: (rencontreId: string, newStatus: string) => void;
}

const RencontreDetailsModal = ({ rencontre, onClose, onStatusUpdate }: RencontreDetailsModalProps) => {
  const [status, setStatus] = useState(rencontre?.status || "pending");
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    if (!rencontre) return;

    try {
      const { error } = await supabase
        .from("audiences")
        .update({ status: newStatus })
        .eq("id", rencontre.id);

      if (error) throw error;

      setStatus(newStatus);
      onStatusUpdate(rencontre.id, newStatus);
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    }
  };

  return (
    <Dialog open={!!rencontre} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <DialogTitle>Demande de rencontre : {rencontre?.subject}</DialogTitle>
            <div className="min-w-[200px]">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Changer le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Refusé</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogDescription className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="font-semibold">Demandé par</p>
                <p>{rencontre?.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{rencontre?.email}</p>
              </div>
              {rencontre?.phone && (
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p>{rencontre.phone}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Date de la demande</p>
                <p>{rencontre?.created_at && new Date(rencontre.created_at).toLocaleDateString()}</p>
              </div>
              {rencontre?.meeting_date && (
                <div>
                  <p className="font-semibold">Date de rencontre proposée</p>
                  <p>{new Date(rencontre.meeting_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">Message</p>
              <p className="mt-2 whitespace-pre-wrap">{rencontre?.message}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RencontreDetailsModal;
