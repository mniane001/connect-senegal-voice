
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface Actualite {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  slug: string;
  image_url: string;
  published_at: string | null;
  published: boolean;
}

interface ActualiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  actualite?: Actualite;
  onActualiteCreated: () => void;
}

const CATEGORIES = [
  { value: "politique", label: "Politique" },
  { value: "economie", label: "Économie" },
  { value: "social", label: "Social" },
  { value: "culture", label: "Culture" },
  { value: "environnement", label: "Environnement" },
  { value: "sante", label: "Santé" },
  { value: "education", label: "Éducation" },
  { value: "autre", label: "Autre" },
];

const ActualiteFormModal = ({
  isOpen,
  onClose,
  actualite,
  onActualiteCreated,
}: ActualiteFormModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Actualite>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    slug: "",
    image_url: "",
    published_at: null,
    published: false,
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (actualite) {
      setFormData({
        ...actualite,
      });
      if (actualite.published_at) {
        setDate(new Date(actualite.published_at));
      } else {
        setDate(undefined);
      }
    } else {
      resetForm();
    }
  }, [actualite, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      slug: "",
      image_url: "",
      published_at: null,
      published: false,
    });
    setDate(undefined);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour effectuer cette action");

      const actualiteData = {
        ...formData,
        published_at: formData.published ? (date ? date.toISOString() : new Date().toISOString()) : null,
        created_by: user.id,
      };

      if (actualite?.id) {
        // Update existing actualite
        const { error } = await supabase
          .from("actualites")
          .update(actualiteData)
          .eq("id", actualite.id);

        if (error) throw error;

        toast({
          title: "Actualité mise à jour",
          description: "L'actualité a été mise à jour avec succès",
        });
      } else {
        // Create new actualite
        const { error } = await supabase.from("actualites").insert([actualiteData]);

        if (error) throw error;

        toast({
          title: "Actualité créée",
          description: "L'actualité a été créée avec succès",
        });
      }

      onActualiteCreated();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {actualite?.id ? "Modifier l'actualité" : "Créer une nouvelle actualité"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les champs ci-dessous pour {actualite?.id ? "modifier" : "créer"} une actualité.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug
            </label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              L'URL sera: /actualites/{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Catégorie
            </label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-medium">
              Extrait
            </label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Contenu
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-medium">
              URL de l'image
            </label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  published: checked as boolean,
                })
              }
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publier cette actualité
            </label>
          </div>

          {formData.published && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date de publication
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Si aucune date n'est sélectionnée, la date actuelle sera utilisée.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Traitement en cours..."
                : actualite?.id
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActualiteFormModal;
