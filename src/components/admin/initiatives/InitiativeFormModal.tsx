
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Initiative } from "./InitiativesList";

interface InitiativeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative?: Initiative;
  onSuccess: () => void;
}

const INITIATIVE_TYPES = [
  { value: "question_ecrite", label: "Question écrite" },
  { value: "question_orale", label: "Question orale" },
  { value: "commission_enquete", label: "Commission d'enquête" },
  { value: "proposition_loi", label: "Proposition de loi" },
];

const STATUSES = [
  { value: "submitted", label: "Soumis" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Complété" },
  { value: "approved", label: "Approuvé" },
  { value: "rejected", label: "Rejeté" },
];

const LEGISLATURES = [
  { value: "15", label: "15e Législature (2022-2027)" },
  { value: "14", label: "14e Législature (2017-2022)" },
];

const InitiativeFormModal = ({ isOpen, onClose, initiative, onSuccess }: InitiativeFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "question_ecrite",
    legislature: "15",
    status: "submitted",
    ministry: "",
    response: "",
    published: true,
    video_url: "",
    document_url: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initiative) {
      // Charger les données de l'initiative pour l'édition
      const getInitiativeDetails = async () => {
        try {
          const { data, error } = await supabase
            .from("initiatives")
            .select("*")
            .eq("id", initiative.id)
            .single();

          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title || "",
              description: data.description || "",
              type: data.type || "question_ecrite",
              legislature: data.legislature || "15",
              status: data.status || "submitted",
              ministry: data.ministry || "",
              response: data.response || "",
              published: data.published ?? true,
              video_url: data.video_url || "",
              document_url: data.document_url || "",
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement des détails:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les détails de l'initiative",
          });
        }
      };

      getInitiativeDetails();
    } else {
      // Réinitialiser le formulaire pour une nouvelle initiative
      setFormData({
        title: "",
        description: "",
        type: "question_ecrite",
        legislature: "15",
        status: "submitted",
        ministry: "",
        response: "",
        published: true,
        video_url: "",
        document_url: "",
      });
    }
  }, [initiative, isOpen, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const initiativeData = {
        ...formData,
        // S'assurer que les données sont du bon type
        legislature: formData.legislature,
        published: Boolean(formData.published),
      };

      let result;
      
      if (initiative) {
        // Mise à jour d'une initiative existante
        result = await supabase
          .from("initiatives")
          .update(initiativeData)
          .eq("id", initiative.id);
      } else {
        // Création d'une nouvelle initiative
        result = await supabase
          .from("initiatives")
          .insert([initiativeData]);
      }

      if (result.error) throw result.error;

      toast({
        title: initiative ? "Initiative mise à jour" : "Initiative créée",
        description: initiative 
          ? "L'initiative a été mise à jour avec succès"
          : "Une nouvelle initiative a été créée",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'initiative",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initiative ? "Modifier l'initiative" : "Créer une nouvelle initiative"}
          </DialogTitle>
          <DialogDescription>
            {initiative 
              ? "Modifiez les détails de cette initiative parlementaire" 
              : "Remplissez le formulaire pour créer une nouvelle initiative parlementaire"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Titre de l'initiative"
              />
            </div>

            <div>
              <Label htmlFor="type">Type d'initiative</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INITIATIVE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="legislature">Législature</Label>
              <Select
                value={formData.legislature}
                onValueChange={(value) => handleSelectChange("legislature", value)}
              >
                <SelectTrigger id="legislature">
                  <SelectValue placeholder="Sélectionner une législature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LEGISLATURES.map((legislature) => (
                      <SelectItem key={legislature.value} value={legislature.value}>
                        {legislature.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ministry">Ministère concerné</Label>
              <Input
                id="ministry"
                name="ministry"
                value={formData.ministry}
                onChange={handleInputChange}
                placeholder="Ministère concerné (si applicable)"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Description détaillée de l'initiative"
                className="min-h-[100px]"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="response">Réponse (si applicable)</Label>
              <Textarea
                id="response"
                name="response"
                value={formData.response}
                onChange={handleInputChange}
                placeholder="Réponse du gouvernement ou résultat de l'initiative"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="video_url">URL de la vidéo</Label>
              <Input
                id="video_url"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                placeholder="Lien vers une vidéo (YouTube, etc.)"
              />
            </div>

            <div>
              <Label htmlFor="document_url">URL du document</Label>
              <Input
                id="document_url"
                name="document_url"
                value={formData.document_url}
                onChange={handleInputChange}
                placeholder="Lien vers un document officiel"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => handleToggleChange("published", checked)}
              />
              <Label htmlFor="published">Publier cette initiative</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? "Enregistrement..." 
                : initiative 
                  ? "Mettre à jour" 
                  : "Créer l'initiative"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InitiativeFormModal;
