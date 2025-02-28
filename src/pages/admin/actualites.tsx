
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

interface Actualite {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  slug: string;
  image_url: string;
  created_at: string;
  published_at: string;
}

const AdminActualitesPage = () => {
  const { data: actualites } = useQuery({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/admin/dashboard" label="Retour au tableau de bord" />
        </div>

        <h1 className="text-3xl font-bold mb-8">Actualités et médias</h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Liste des actualités</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle actualité
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actualités</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date de publication</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actualites?.length ? (
                  actualites.map((actualite) => (
                    <TableRow key={actualite.id}>
                      <TableCell className="font-medium">{actualite.title}</TableCell>
                      <TableCell>{actualite.category}</TableCell>
                      <TableCell>
                        {actualite.published_at 
                          ? new Date(actualite.published_at).toLocaleDateString() 
                          : "Non publié"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Éditer
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Aucune actualité trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminActualitesPage;
