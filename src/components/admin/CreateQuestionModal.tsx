import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated: () => void;
}

const CATEGORIES = [
  { value: "education", label: "Éducation" },
  { value: "sante", label: "Santé" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "economie", label: "Économie" },
  { value: "environnement", label: "Environnement" },
  { value: "agriculture", label: "Agriculture" },
  { value: "securite", label: "Sécurité" },
  { value: "justice", label: "Justice" },
  { value: "culture", label: "Culture" },
  { value: "sport", label: "Sport" },
  { value: "transport", label: "Transport" },
  { value: "emploi", label: "Emploi" },
  { value: "autre", label: "Autre" }
];

const CreateQuestionModal = ({ isOpen, onClose, onQuestionCreated }: CreateQuestionModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    category: "",
    customCategory: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      const finalCategory = formData.category === "autre" ? formData.customCategory : formData.category;

      const { error } = await supabase
        .from("doleances")
        .insert({
          name: formData.name,
          email: formData.email,
          title: formData.title,
          category: finalCategory,
          description: formData.description,
          status: "submitted",
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Question créée",
        description: "La question a été créée avec succès.",
      });

      onQuestionCreated();
      onClose();
      setFormData({
        name: "",
        email: "",
        title: "",
        category: "",
        customCategory: "",
        description: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la question.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle question</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire pour créer une nouvelle question écrite.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name">Nom complet</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="title">Titre de la question</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category">Catégorie</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formData.category === "autre" && (
                <div className="mt-2">
                  <Input
                    placeholder="Précisez la catégorie"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer la question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionModal;
