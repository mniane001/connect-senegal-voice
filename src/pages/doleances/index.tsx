
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const QuestionEcritePage = () => {
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
      const finalCategory = formData.category === "autre" ? formData.title : formData.category;
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("doleances")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            title: formData.title,
            category: finalCategory,
            description: formData.description,
            created_by: user?.id || null,
            status: "submitted",
          },
        ]);

      if (error) throw error;

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 mt-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Soumettre une question écrite</CardTitle>
            <CardDescription>
              Posez votre question à l'Assemblée nationale. Nous vous répondrons dans les meilleurs délais.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionEcritePage;
