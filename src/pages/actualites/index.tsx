
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Actualite {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
}

const ITEMS_PER_PAGE = 8;

const ActualitesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["actualites", currentPage, searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("actualites")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error, count } = await query
        .order("published_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      return {
        items: data as Actualite[],
        total: count || 0,
      };
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Actualités & activités
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Restez informé des dernières nouvelles et activités concernant le New Deal Technologique
            et la transformation digitale du Sénégal.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher une actualité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              <SelectItem value="politique">Politique</SelectItem>
              <SelectItem value="economie">Économie</SelectItem>
              <SelectItem value="technologie">Technologie</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des actualités */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg animate-pulse">
                <div className="w-full aspect-video bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data?.items.map((actualite) => (
                <div 
                  key={actualite.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  <img
                    src={actualite.image_url || "/placeholder.svg"}
                    alt={actualite.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-senegal-green/10 text-senegal-green">
                        {actualite.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(actualite.published_at)}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2 line-clamp-2">
                      {actualite.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {actualite.excerpt || actualite.content}
                    </p>
                    <Button
                      variant="link"
                      className="text-senegal-green p-0 hover:text-senegal-green/80"
                    >
                      Lire la suite
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ActualitesPage;
