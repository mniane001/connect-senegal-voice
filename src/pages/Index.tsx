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
                <a href="/auth">
                  Commencer
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

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative animate-fade-in">
            <iframe
              className="w-full aspect-video rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Guy Marius Sagna - Vision pour le Sénégal"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-display text-3xl font-bold text-gray-900">
              Une mission guidée par l'écoute
            </h2>
            <p className="text-lg text-gray-600">
              Notre engagement commence par une écoute attentive des préoccupations de chaque citoyen. 
              En tant que représentant du peuple, nous croyons fermement que chaque voix compte et mérite 
              d'être entendue. Cette écoute active nous permet d'identifier les vrais besoins et aspirations 
              des habitants du Sénégal – particulièrement ceux de Ziguinchor.
            </p>
            <Button
              size="lg"
              className="bg-senegal-green hover:bg-senegal-green/90 text-white"
              asChild
            >
              <a href="/audience">
                Rencontrer votre député
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
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

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative animate-fade-in">
            <img
              src="/placeholder.svg"
              alt="Vision pour le Sénégal"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold">
              Aux côtés du Président pour un Sénégal souverain, juste et prospère
            </h2>
            <p className="text-lg text-gray-600">
              Aux côtés du Président de la République, nous travaillons à concrétiser 
              <em>La Vision Sénégal 2050</em> : un pays souverain, juste et prospère. 
              Chaque action entreprise vise à construire un avenir meilleur, fondé sur 
              la justice sociale, le développement durable et la souveraineté nationale.
            </p>
            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <a href="/engagements">
                Découvrez nos engagements
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Actualités & activités
            </h2>
            <div className="w-24 h-1 bg-senegal-green mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <img
                  src="/placeholder.svg"
                  alt="Actualité"
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2">
                    Titre de l'actualité
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Description courte de l'actualité...
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>25 février 2025</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4">GMS</h3>
              <p className="text-gray-400">Député de la XVe législature</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Plan du site</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Accueil</a></li>
                <li><a href="/biographie" className="text-gray-400 hover:text-white">Biographie</a></li>
                <li><a href="/initiatives" className="text-gray-400 hover:text-white">Initiatives parlementaires</a></li>
                <li><a href="/actualites" className="text-gray-400 hover:text-white">Actualités</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens utiles</h4>
              <ul className="space-y-2">
                <li><a href="https://www.assemblee-nationale.sn" target="_blank" className="text-gray-400 hover:text-white">Assemblée nationale</a></li>
                <li><a href="https://www.presidence.sn" target="_blank" className="text-gray-400 hover:text-white">Présidence</a></li>
                <li><a href="https://www.primature.sn" target="_blank" className="text-gray-400 hover:text-white">Primature</a></li>
                <li><a href="https://investinsenegal.com" target="_blank" className="text-gray-400 hover:text-white">Investir au Sénégal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <address className="text-gray-400 not-italic">
                Ziguinchor, Sénégal<br />
                <a href="mailto:contact@guymariussagna.sn" className="hover:text-white">contact@guymariussagna.sn</a><br />
                <a href="tel:+221777777777" className="hover:text-white">+221 77 777 77 77</a>
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 - Tous droits réservés</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
