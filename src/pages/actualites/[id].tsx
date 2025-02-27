import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Share2,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const ActualitePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: actualite, isLoading } = useQuery({
    queryKey: ["actualite", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ["related-actualites", id, actualite?.category],
    enabled: !!actualite,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .eq("category", actualite?.category)
        .neq("id", id)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareUrls = actualite ? {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(actualite.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    sms: `sms:?body=${encodeURIComponent(actualite.title + " " + window.location.href)}`
  } : null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: actualite?.title,
          url: window.location.href
        });
      } catch (err) {
        console.error("Erreur lors du partage:", err);
      }
    }
  };

  // Mise à jour uniquement de la structure JSX pour le thème
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-24">
        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ) : actualite ? (
          <article className="card-official p-8">
            <Button
              variant="ghost"
              className="mb-8"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux actualités
            </Button>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-assembly-blue text-white">
                  {actualite.category}
                </span>
                <time className="text-sm text-gray-500">
                  {formatDate(actualite.published_at)}
                </time>
              </div>
              <h1 className="font-display text-4xl font-bold text-assembly-blue">
                {actualite.title}
              </h1>
            </div>

            {actualite.image_url && (
              <img
                src={actualite.image_url}
                alt={actualite.title}
                className="w-full rounded-xl mb-8"
              />
            )}

            {/* Boutons de partage */}
            <div className="flex flex-wrap items-center gap-3 py-4 border-y mb-8">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Partager :
              </span>
              
              {shareUrls && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={shareUrls.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={shareUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:text-sky-600"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={shareUrls.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={shareUrls.sms}
                      className="text-green-600 hover:text-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      SMS
                    </a>
                  </Button>
                </>
              )}

              {'share' in navigator && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              {actualite.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Articles similaires */}
            {relatedArticles && relatedArticles.length > 0 && (
              <section className="mt-16 pt-16 border-t">
                <h2 className="text-2xl font-bold text-assembly-blue mb-8">
                  Articles similaires
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                    >
                      <img
                        src={article.image_url || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-senegal-green/10 text-senegal-green">
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(article.published_at)}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt || article.content}
                        </p>
                        <Button
                          variant="link"
                          className="text-senegal-green p-0 hover:text-senegal-green/80"
                          asChild
                        >
                          <a href={`/actualites/${article.id}`}>
                            Lire la suite
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        ) : (
          <div className="text-center card-official p-8">
            <h2 className="text-2xl font-bold text-assembly-blue mb-4">
              Article non trouvé
            </h2>
            <Button onClick={() => navigate("/actualites")}>
              Retourner aux actualités
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ActualitePage;
