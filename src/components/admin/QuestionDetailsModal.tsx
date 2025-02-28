
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  id: string;
  created_at: string;
  name: string;
  email: string;
  category: string;
  status: string;
  title: string;
  description: string;
  response?: string;
}

interface QuestionDetailsModalProps {
  question: Question | null;
  onClose: () => void;
  onStatusUpdate: (questionId: string, newStatus: string) => void;
}

const QuestionDetailsModal = ({
  question,
  onClose,
  onStatusUpdate,
}: QuestionDetailsModalProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Update status and response when question changes
  useState(() => {
    if (question) {
      setStatus(question.status);
      setResponse(question.response || "");
    }
  });

  if (!question) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from("doleances")
        .update({
          status,
          response,
        })
        .eq("id", question.id);

      if (error) throw error;
      
      toast({
        title: "Réponse enregistrée",
        description: "La réponse a été enregistrée avec succès.",
      });
      
      onStatusUpdate(question.id, status);
      onClose();
    } catch (error: any) {
      console.error("Error updating question:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={!!question} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la question</DialogTitle>
          <DialogDescription>
            Consultez les détails et répondez à la question
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-medium">{question.title}</h3>
            <p className="text-sm text-muted-foreground">
              Soumis le {formatDate(question.created_at)} par {question.name}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Catégorie</h4>
            <p>{question.category}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <Alert>
              <AlertDescription>
                {question.description}
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Email du citoyen</h4>
            <p>{question.email}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Statut</h4>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Réponse</h4>
            <Textarea
              placeholder="Écrivez votre réponse ici..."
              value={response}
              onChange={handleResponseChange}
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDetailsModal;
