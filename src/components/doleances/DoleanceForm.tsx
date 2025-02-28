
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// List of categories for doleances
export const CATEGORIES = [
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

const DoleanceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
      // Déterminer la catégorie finale
      const finalCategory = formData.category === "autre" ? formData.title : formData.category;
      
      console.log("Soumission de la doléance avec les données:", {
        name: formData.name,
        email: formData.email,
        title: formData.title,
        category: finalCategory,
        description: formData.description,
        status: "submitted"
      });

      // Using RPC instead of direct table insert to bypass RLS
      const { error, data } = await supabase.rpc('submit_doleance', {
        p_name: formData.name,
        p_email: formData.email,
        p_title: formData.title,
        p_category: finalCategory,
        p_description: formData.description
      });

      if (error) {
        console.error("Erreur lors de la soumission:", error);
        throw error;
      }

      console.log("Doléance soumise avec succès:", data);

      toast({
        title: "Question soumise avec succès",
        description: "Nous examinerons votre question dans les plus brefs délais.",
      });

      navigate("/initiatives/questions-ecrites");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre question.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
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
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre de la question
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        {formData.category === "autre" && (
          <p className="text-sm text-muted-foreground mt-1">
            Note : Pour une catégorie "Autre", le titre de votre question sera utilisé comme catégorie.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description détaillée
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Envoi en cours..." : "Soumettre la question"}
      </Button>
    </form>
  );
};

export default DoleanceForm;
