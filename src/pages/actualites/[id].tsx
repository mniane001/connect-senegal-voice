
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

interface Actualite {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  published_at: string | null;
}

const ActualitePage = () => {
  const { id } = useParams();

  const { data: actualite, isLoading } = useQuery({
    queryKey: ["actualite", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data as Actualite;
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 mt-10">
          <div className="animate-pulse bg-white rounded-lg shadow p-6">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded my-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12 mt-10">
        <div className="mb-4">
          <BackButton to="/actualites" />
        </div>
        
        {actualite ? (
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {actualite.image_url && (
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  src={actualite.image_url}
                  alt={actualite.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center mb-4 text-sm text-gray-500 gap-4">
                <span className="bg-assembly-blue text-white px-3 py-1 rounded-full text-xs">
                  {actualite.category}
                </span>
                {actualite.published_at && (
                  <time dateTime={actualite.published_at}>
                    {formatDate(actualite.published_at)}
                  </time>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                {actualite.title}
              </h1>

              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: actualite.content }}
              />
            </div>
          </article>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Actualité non trouvée</h2>
            <p>L'actualité que vous recherchez n'existe pas ou a été supprimée.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ActualitePage;
