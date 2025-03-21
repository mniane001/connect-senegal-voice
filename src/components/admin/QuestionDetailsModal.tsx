import { useState, useEffect } from "react";
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
import { sendNotificationEmail } from "@/services/emailService";

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
  const [originalStatus, setOriginalStatus] = useState<string>("");

  useEffect(() => {
    if (question) {
      setStatus(question.status);
      setOriginalStatus(question.status);
      setResponse(question.response || "");
    }
  }, [question]);

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

  const notifyUserViaEmail = async (questionId: string, newStatus: string) => {
    try {
      console.log("Préparation de la notification par email pour la question:", questionId);
      
      // Validation des données via la fonction Edge
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "doleance",
          id: questionId,
          newStatus: newStatus,
          adminEmail: "nianemouhamed001@gmail.com",
          replyToEmail: "nianemouhamed001@gmail.com",
          response: response,
          userEmail: question.email,
          userName: question.name
        }
      });
      
      if (error) {
        console.error("Erreur lors de l'appel de la fonction send-notification:", error);
        return { success: false, error };
      }
      
      console.log("Réponse de la fonction de validation:", data);
      
      if (!data.success) {
        console.error("Erreur lors de la validation des données:", data.error);
        return { success: false, error: data.error };
      }
      
      // Envoi de l'email via EmailJS
      const emailResult = await sendNotificationEmail({
        type: "doleance",
        recipientEmail: question.email,
        recipientName: question.name,
        subject: `Mise à jour de votre doléance - ${question.title}`,
        status: newStatus,
        response: response,
        replyTo: "nianemouhamed001@gmail.com",
        fromName: "Guy Marius SAGNA"
      });
      
      if (!emailResult.success) {
        console.error("Erreur lors de l'envoi de l'email:", emailResult.error);
        return { success: false, error: emailResult.error };
      }
      
      console.log("Notification envoyée avec succès:", emailResult);
      return { success: true, data: emailResult };
    } catch (error) {
      console.error("Erreur d'envoi de notification:", error);
      return { success: false, error };
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      
      // Mise à jour de la question dans Supabase
      const { error } = await supabase
        .from("doleances")
        .update({
          status,
          response,
        })
        .eq("id", question.id);

      if (error) throw error;
      
      // Si le statut a changé, essayer d'envoyer une notification par email
      let emailSuccess = true;
      let emailError = null;
      
      if (status !== originalStatus) {
        const emailResult = await notifyUserViaEmail(question.id, status);
        
        if (!emailResult.success) {
          console.error("Erreur lors de l'envoi de la notification:", emailResult.error);
          emailSuccess = false;
          emailError = emailResult.error;
        }
      }
      
      if (emailSuccess) {
        toast({
          title: "Réponse enregistrée",
          description: "La réponse a été enregistrée et une notification a été envoyée.",
        });
      } else {
        toast({
          title: "Réponse enregistrée",
          description: "La réponse a été enregistrée, mais l'envoi de la notification a échoué. Veuillez vérifier les logs.",
          variant: "destructive",
        });
        console.error("Détails de l'erreur d'envoi d'email:", emailError);
      }
      
      onStatusUpdate(question.id, status);
      onClose();
    } catch (error: any) {
      console.error("Error updating question:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour de la question",
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
