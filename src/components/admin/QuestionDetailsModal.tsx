
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

interface Question {
  id: string;
  created_at: string;
  name: string;
  email: string;
  category: string;
  status: string;
  title: string;
  description: string;
}

interface QuestionDetailsModalProps {
  question: Question | null;
  onClose: () => void;
  onStatusUpdate: (questionId: string, newStatus: string) => void;
}

const QuestionDetailsModal = ({ question, onClose, onStatusUpdate }: QuestionDetailsModalProps) => {
  const [status, setStatus] = useState(question?.status || "submitted");
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    if (!question) return;

    try {
      const { error } = await supabase
        .from("doleances")
        .update({ status: newStatus })
        .eq("id", question.id);

      if (error) throw error;

      setStatus(newStatus);
      onStatusUpdate(question.id, newStatus);
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la question a été mis à jour avec succès.",
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
    <Dialog open={!!question} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <DialogTitle>{question?.title}</DialogTitle>
            <div className="min-w-[200px]">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Changer le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="submitted">Soumis</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="completed">Complété</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogDescription className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="font-semibold">Soumis par</p>
                <p>{question?.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{question?.email}</p>
              </div>
              <div>
                <p className="font-semibold">Catégorie</p>
                <p>{question?.category}</p>
              </div>
              <div>
                <p className="font-semibold">Date de soumission</p>
                <p>{question?.created_at && new Date(question.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="mt-2 whitespace-pre-wrap">{question?.description}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDetailsModal;
