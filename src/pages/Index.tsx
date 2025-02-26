
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Users, Building, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Actualite {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
}

const Index = () => {
  const { data: actualites, isLoading } = useQuery({
    queryKey: ["actualites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Actualite[];
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
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-cover bg-center py-24 md:py-32" 
          style={{
            backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url('https://images.unsplash.com/photo-1576767968242-4f685d2a5187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
          }}>
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Guy Marius Sagna</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Député à l'Assemblée nationale du Sénégal, engagé pour la justice sociale et le développement équitable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-senegal-yellow hover:bg-senegal-yellow/90 text-assembly-blue font-medium">
                <Link to="/contact">Contactez-moi</Link>
              </Button>
              <Button asChild variant="outline" className="bg-white text-assembly-blue hover:bg-gray-100 font-medium">
                <Link to="/biographie">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Message de bienvenue */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="flex justify-center">
                  <img
                    src="https://i.ibb.co/kg2j04HQ/photo-guy.jpg"
                    alt="Guy Marius Sagna"
                    className="rounded-lg shadow-md border-4 border-white max-w-full h-auto object-cover"
                    style={{ width: '400px', height: '500px', objectPosition: 'center top' }}
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-assembly-blue">Message de bienvenue</h2>
                  <p className="text-gray-600">Ensemble pour un Sénégal plus juste et prospère</p>
                  <div className="h-1 w-20 mt-4 bg-gradient-to-r from-assembly-blue to-senegal-yellow"></div>
                </div>
                <div className="prose max-w-none">
                  <p className="mb-4">
                    Chers compatriotes, chers visiteurs, je vous souhaite la bienvenue sur mon site officiel. 
                    En tant que votre représentant à l'Assemblée nationale, je m'engage à porter votre voix 
                    et à défendre vos intérêts avec détermination et intégrité.
                  </p>
                  <p className="mb-4">
                    Mon engagement politique est ancré dans la conviction profonde que notre pays mérite 
                    un développement équitable, une justice sociale renforcée et une gouvernance transparente 
                    au service des citoyens.
                  </p>
                  <Button asChild>
                    <Link to="/biographie">Découvrir mon parcours</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Domaines d'action */}
        <section className="py-16 bg-assembly-blue/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-assembly-blue">
                Domaines d'action prioritaires
              </h2>
              <p className="text-gray-600">Mon engagement pour le développement du Sénégal</p>
              <div className="h-1 w-20 mt-4 mx-auto bg-gradient-to-r from-assembly-blue to-senegal-yellow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Éducation",
                  description: "Promouvoir un système éducatif de qualité, accessible à tous les Sénégalais.",
                  icon: Book
                },
                {
                  title: "Santé",
                  description: "Améliorer l'accès aux soins de santé et renforcer notre système sanitaire.",
                  icon: Users
                },
                {
                  title: "Emploi des jeunes",
                  description: "Créer des opportunités d'emploi et soutenir l'entrepreneuriat des jeunes.",
                  icon: Building
                },
                {
                  title: "Justice sociale",
                  description: "Lutter contre les inégalités et promouvoir une répartition équitable des ressources.",
                  icon: Shield
                }
              ].map((domain, index) => (
                <div key={index} className="p-6 text-center bg-white rounded-lg hover:shadow-lg transition-shadow">
                  <div className="bg-assembly-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <domain.icon className="h-7 w-7 text-assembly-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-assembly-blue">{domain.title}</h3>
                  <p className="text-gray-600">{domain.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actualités Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-assembly-blue">
                  Actualités récentes
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-assembly-blue to-senegal-yellow"></div>
              </div>
              <Link to="/actualites" className="btn btn-outline-assembly">
                Toutes les actualités
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg animate-pulse h-full">
                    <div className="relative h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : (
                actualites?.map((actualite) => (
                  <div key={actualite.id} className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={actualite.image_url || "/placeholder.svg"}
                        alt={actualite.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-0 right-0 bg-assembly-blue text-white px-3 py-1 text-sm font-medium">
                        {actualite.category}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="text-gray-500 text-sm mb-2">
                        {formatDate(actualite.published_at)}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-assembly-blue line-clamp-2">
                        {actualite.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                        {actualite.excerpt || actualite.content}
                      </p>
                      <Link
                        to={`/actualites/${actualite.id}`}
                        className="text-assembly-blue font-medium hover:underline self-start mt-auto flex items-center"
                      >
                        Lire la suite
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-assembly-blue to-assembly-blue/80 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Participez à la construction du Sénégal de demain</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Votre voix compte. Ensemble, nous pouvons bâtir un avenir meilleur pour tous les Sénégalais.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="bg-white text-assembly-blue hover:bg-gray-100">
                <Link to="/contact">Me contacter</Link>
              </Button>
              <Button asChild className="bg-senegal-yellow hover:bg-senegal-yellow/90 text-assembly-blue">
                <Link to="/initiatives">Voir mes travaux parlementaires</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
