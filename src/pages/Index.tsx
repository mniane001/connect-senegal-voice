
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Votre voix pour un Sénégal numérique et connecté
            </h1>
            <p className="text-lg text-gray-600">
              Engagé dans la transformation digitale du Sénégal à travers le New Deal Technologique,
              pour un avenir connecté et inclusif.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-senegal-green hover:bg-senegal-green/90 text-white"
                asChild
              >
                <a href="/audience">
                  Demander une Audience
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <a href="/doleances">Soumettre une doléance</a>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-senegal-green/10 rounded-xl -rotate-6"></div>
            <img
              src="/placeholder.svg"
              alt="Guy Marius Sagna"
              className="relative rounded-xl shadow-lg w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Votre espace E-député
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un pont digital entre vous et votre représentant, pour une démocratie plus participative
              et transparente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "New Deal Technologique",
                description: "Découvrez notre vision pour un Sénégal digital et innovant",
                link: "/newdeal"
              },
              {
                title: "Doléances citoyennes",
                description: "Partagez vos préoccupations et suggestions pour améliorer notre communauté",
                link: "/doleances"
              },
              {
                title: "Ziguinchor en action",
                description: "Suivez les projets et initiatives pour le développement de notre département",
                link: "/ziguinchor"
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow duration-200 animate-fade-up"
              >
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button
                  variant="link"
                  className="text-senegal-green p-0 hover:text-senegal-green/80"
                  asChild
                >
                  <a href={feature.link}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
