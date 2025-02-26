
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
          <article className="space-y-8">
            <Button
              variant="ghost"
              className="mb-8"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-senegal-green/10 text-senegal-green">
                  {actualite.category}
                </span>
                <time className="text-sm text-gray-500">
                  {formatDate(actualite.published_at)}
                </time>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                {actualite.title}
              </h1>
            </div>

            {actualite.image_url && (
              <img
                src={actualite.image_url}
                alt={actualite.title}
                className="w-full aspect-video object-cover rounded-xl"
              />
            )}

            <div className="prose prose-lg max-w-none">
              {actualite.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
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
