
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import ActualiteStats from "@/components/admin/ActualiteStats";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActualiteFormModal from "@/components/admin/ActualiteFormModal";
import DeleteActualiteModal from "@/components/admin/DeleteActualiteModal";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Actualite {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  slug: string;
  image_url: string | null;
  created_at: string;
  published_at: string | null;
  published: boolean;
}

const AdminActualitesPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActualite, setSelectedActualite] = useState<Actualite | undefined>(undefined);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: actualites, isLoading } = useQuery({
    queryKey: ["actualites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Actualite[];
    },
  });

  const handleCreateActualite = () => {
    setSelectedActualite(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditActualite = (actualite: Actualite) => {
    setSelectedActualite(actualite);
    setIsFormModalOpen(true);
  };

  const handleDeleteActualite = (actualite: Actualite) => {
    setSelectedActualite(actualite);
    setIsDeleteModalOpen(true);
  };

  const handleActualiteChange = () => {
    queryClient.invalidateQueries({ queryKey: ["actualites"] });
  };

  const handlePublishStatusToggle = async (actualite: Actualite) => {
    try {
      const newStatus = !actualite.published;
      const published_at = newStatus ? new Date().toISOString() : null;
      
      const { error } = await supabase
        .from("actualites")
        .update({ 
          published: newStatus,
          published_at: published_at 
        })
        .eq("id", actualite.id);

      if (error) throw error;

      toast({
        title: newStatus ? "Actualité publiée" : "Actualité dépubliée",
        description: newStatus 
          ? "L'actualité est maintenant visible pour tous les utilisateurs"
          : "L'actualité n'est plus visible"
      });

      queryClient.invalidateQueries({ queryKey: ["actualites"] });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "politique": "Politique",
      "economie": "Économie",
      "social": "Social",
      "culture": "Culture",
      "environnement": "Environnement",
      "sante": "Santé",
      "education": "Éducation",
      "autre": "Autre"
    };
    return categories[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/admin/dashboard" label="Retour au tableau de bord" />
        </div>

        <h1 className="text-3xl font-bold mb-8">Actualités et médias</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">Liste des actualités</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Liste des actualités</h2>
              <Button onClick={handleCreateActualite}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle actualité
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Actualités</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Date de publication</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actualites?.length ? (
                        actualites.map((actualite) => (
                          <TableRow key={actualite.id}>
                            <TableCell className="font-medium">{actualite.title}</TableCell>
                            <TableCell>{getCategoryLabel(actualite.category)}</TableCell>
                            <TableCell>
                              {actualite.published_at 
                                ? new Date(actualite.published_at).toLocaleDateString() 
                                : "Non publié"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={actualite.published ? "default" : "secondary"}>
                                {actualite.published ? "Publié" : "Brouillon"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handlePublishStatusToggle(actualite)}
                                >
                                  {actualite.published ? "Dépublier" : "Publier"}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleEditActualite(actualite)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => handleDeleteActualite(actualite)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  asChild
                                >
                                  <a href={`/actualites/${actualite.id}`} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Aucune actualité trouvée
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            {actualites && <ActualiteStats actualites={actualites} />}
          </TabsContent>
        </Tabs>

        <ActualiteFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          actualite={selectedActualite}
          onActualiteCreated={handleActualiteChange}
        />

        {selectedActualite && (
          <DeleteActualiteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            actualiteId={selectedActualite.id}
            actualiteTitle={selectedActualite.title}
            onActualiteDeleted={handleActualiteChange}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminActualitesPage;
