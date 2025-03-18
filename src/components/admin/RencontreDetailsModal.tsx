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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { sendNotificationEmail } from "@/services/emailService";

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
  response?: string;
}

interface RencontreDetailsModalProps {
  rencontre: Rencontre | null;
  onClose: () => void;
  onStatusUpdate: (rencontreId: string, newStatus: string) => void;
}

const RencontreDetailsModal = ({
  rencontre,
  onClose,
  onStatusUpdate,
}: RencontreDetailsModalProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [response, setResponse] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<string>("");

  useEffect(() => {
    if (rencontre) {
      setStatus(rencontre.status || "pending");
      setOriginalStatus(rencontre.status || "pending");
      setResponse(rencontre.response || "");
      if (rencontre.meeting_date) {
        setDate(new Date(rencontre.meeting_date));
      } else {
        setDate(undefined);
      }
    }
  }, [rencontre]);

  if (!rencontre) return null;

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

  const notifyUserViaEmail = async (rencontreId: string, newStatus: string) => {
    try {
      console.log("Préparation de la notification par email pour l'audience:", rencontreId);
      
      // Validation des données via la fonction Edge
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "audience",
          id: rencontreId,
          newStatus: newStatus,
          adminEmail: "nianemouhamed001@gmail.com",
          replyToEmail: "nianemouhamed001@gmail.com",
          response: response,
          userEmail: rencontre.email,
          userName: rencontre.name
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
        type: "audience",
        recipientEmail: rencontre.email,
        recipientName: rencontre.name,
        subject: `Mise à jour de votre demande d'audience`,
        status: newStatus,
        response: response,
        meetingDate: date ? date.toISOString() : null,
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
      
      console.log("Mise à jour de la demande d'audience:", {
        id: rencontre.id,
        status,
        meeting_date: date ? date.toISOString() : null,
        response,
      });
      
      const { error } = await supabase
        .from("audiences")
        .update({
          status,
          meeting_date: date ? date.toISOString() : null,
          response,
        })
        .eq("id", rencontre.id);

      if (error) {
        console.error("Erreur lors de la mise à jour:", error);
        throw error;
      }
      
      console.log("Demande d'audience mise à jour avec succès");
      
      // Si le statut a changé, envoyer une notification par email
      if (status !== originalStatus) {
        try {
          const emailResult = await notifyUserViaEmail(rencontre.id, status);
          if (emailResult.success) {
            toast({
              title: "Email de notification envoyé",
              description: `Un email a été envoyé à ${rencontre.email} pour l'informer du changement de statut.`,
            });
          } else {
            console.error("Erreur lors de l'envoi de l'email:", emailResult.error);
            toast({
              title: "Mise à jour réussie, mais échec de l'envoi d'email",
              description: "La demande a été mise à jour, mais l'email de notification n'a pas pu être envoyé.",
              variant: "destructive",
            });
          }
        } catch (emailError) {
          console.error("Erreur lors de l'envoi de l'email:", emailError);
          toast({
            title: "Mise à jour réussie, mais échec de l'envoi d'email",
            description: "La demande a été mise à jour, mais l'email de notification n'a pas pu être envoyé.",
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Demande mise à jour",
        description: "La demande d'audience a été mise à jour avec succès.",
      });
      
      onStatusUpdate(rencontre.id, status);
      onClose();
    } catch (error: any) {
      console.error("Error updating audience request:", error);
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
    <Dialog open={!!rencontre} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande d'audience</DialogTitle>
          <DialogDescription>
            Consultez les détails et mettez à jour la demande d'audience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-medium">{rencontre.subject}</h3>
            <p className="text-sm text-muted-foreground">
              Soumis le {formatDate(rencontre.created_at)} par {rencontre.name}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Message</h4>
            <Alert>
              <AlertDescription>
                {rencontre.message}
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Coordonnées</h4>
            <p><strong>Email:</strong> {rencontre.email}</p>
            {rencontre.phone && <p><strong>Téléphone:</strong> {rencontre.phone}</p>}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Statut</h4>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(status === "approved" || status === "completed") && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Date de rendez-vous</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

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

export default RencontreDetailsModal;
