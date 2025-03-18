
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Définition du schéma de validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }),
  category: z.string({ required_error: "Veuillez sélectionner une catégorie" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
});

type FormValues = z.infer<typeof formSchema>;

interface DoleanceFormProps {
  onSubmitSuccess?: (name: string, email: string) => Promise<boolean>;
}

const DoleanceForm = ({ onSubmitSuccess }: DoleanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialisation du formulaire avec react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      category: "",
      description: "",
    },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Récupérer l'utilisateur actuel (si connecté)
      const { data: { user } } = await supabase.auth.getUser();

      // Insérer la doléance dans la base de données
      const { error } = await supabase.from("doleances").insert({
        name: data.name,
        email: data.email,
        title: data.title,
        category: data.category,
        description: data.description,
        status: "submitted",
        created_by: user?.id || null,
      });

      if (error) throw error;

      // Envoyer un email de confirmation si la fonction est fournie
      if (onSubmitSuccess) {
        const emailSent = await onSubmitSuccess(data.name, data.email);
        if (emailSent) {
          console.log("Email de confirmation envoyé avec succès");
        } else {
          console.warn("L'email de confirmation n'a pas pu être envoyé");
        }
      }

      // Afficher un message de succès
      toast({
        title: "Doléance soumise avec succès",
        description: "Nous avons bien reçu votre question et vous répondrons dans les meilleurs délais.",
      });

      // Réinitialiser le formulaire
      form.reset();
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission de votre doléance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre nom complet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Entrez votre email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la question</FormLabel>
              <FormControl>
                <Input placeholder="Entrez le titre de votre question" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="sante">Santé</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="economie">Économie</SelectItem>
                  <SelectItem value="environnement">Environnement</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="securite">Sécurité</SelectItem>
                  <SelectItem value="justice">Justice</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="emploi">Emploi</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez en détail votre question ou préoccupation..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Soumission en cours..." : "Soumettre ma question"}
        </Button>
      </form>
    </Form>
  );
};

export default DoleanceForm;
