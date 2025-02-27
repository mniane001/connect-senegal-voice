import React from 'react';
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

const BiographiePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 md:py-32" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`
        }}
      >
        <div className="container-custom text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Biographie
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Parcours et engagements de Guy Marius Sagna
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex h-3">
            <div className="w-1/3 bg-senegal-green"></div>
            <div className="w-1/3 bg-senegal-yellow"></div>
            <div className="w-1/3 bg-senegal-red"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar */}
            <div className="md:w-1/3">
              <div className="sticky top-24">
                {/* Photo */}
                <div className="flex justify-center">
                  <img 
                    src="https://i.ibb.co/kg2j04HQ/photo-guy.jpg" 
                    alt="Guy Marius Sagna" 
                    className="rounded-lg shadow-md mb-6 border-4 border-white max-w-full h-auto"
                    style={{ width: '320px', height: '400px', objectFit: 'cover', objectPosition: 'center top' }}
                  />
                </div>

                {/* Informations */}
                <div className="bg-assembly-blue/5 p-6 rounded-lg border border-assembly-blue/10 mb-6">
                  <h3 className="text-xl font-bold mb-4 text-assembly-blue">
                    Informations
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="font-medium">Fonction:</span>
                      <span>Député</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Circonscription:</span>
                      <span>Ziguinchor</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Parti:</span>
                      <span>PASTEF</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Mandat:</span>
                      <span>2022-2027</span>
                    </li>
                  </ul>
                </div>

                {/* Commissions */}
                <div className="bg-assembly-blue/5 p-6 rounded-lg border border-assembly-blue/10">
                  <h3 className="text-xl font-bold mb-4 text-assembly-blue">
                    Commissions
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-assembly-blue h-2 w-2 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>Commission des finances et du contrôle budgétaire</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-assembly-blue h-2 w-2 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>Commission des affaires sociales</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3">
              {/* Parcours personnel et professionnel */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-assembly-blue">
                  Parcours personnel et professionnel
                </h2>
                <div className="h-1 w-20 mt-4 bg-gradient-to-r from-assembly-blue to-assembly-gold"></div>
              </div>
              <div className="prose max-w-none mb-12">
                <p className="mb-4">
                  Guy Marius Sagna est né le 15 janvier 1975 à Dakar. Issu d'une famille modeste originaire de la région de Casamance, il a grandi avec des valeurs fortes de justice sociale et d'engagement communautaire qui ont façonné sa vision politique.
                </p>
                <p className="mb-4">
                  Après des études primaires et secondaires brillantes, il a poursuivi son parcours académique à l'Université Cheikh Anta Diop de Dakar où il a obtenu une licence en sociologie. Il a ensuite complété sa formation par un master en développement social à l'Université Gaston Berger de Saint-Louis.
                </p>
                <p className="mb-4">
                  Sa carrière professionnelle a débuté dans le secteur du développement social, où il a travaillé pour plusieurs organisations non gouvernementales, se concentrant sur les questions d'accès à l'éducation et aux soins de santé dans les zones rurales du Sénégal.
                </p>
              </div>

              {/* Engagement politique et social */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-assembly-blue">
                  Engagement politique et social
                </h2>
                <div className="h-1 w-20 mt-4 bg-gradient-to-r from-assembly-blue to-assembly-gold"></div>
              </div>
              <div className="prose max-w-none mb-12">
                <p className="mb-4">
                  L'engagement politique de Guy Marius Sagna s'est manifesté très tôt à travers son implication dans divers mouvements sociaux et citoyens. Il s'est fait connaître du grand public en tant que co-fondateur du Front pour une Révolution Anti-impérialiste Populaire et Panafricaine (FRAPP), une organisation qui milite pour la souveraineté économique et politique du Sénégal.
                </p>
                <p className="mb-4">
                  Son activisme l'a souvent placé en première ligne des luttes sociales, notamment contre la hausse des prix de l'électricité, pour l'accès à l'eau potable dans les zones rurales, et contre les accords de pêche jugés défavorables aux pêcheurs sénégalais.
                </p>
                <p className="mb-4">
                  En 2022, il a été élu député à l'Assemblée nationale du Sénégal sous la bannière de la coalition PASTEF, marquant ainsi son entrée officielle dans l'arène politique institutionnelle.
                </p>
              </div>

              {/* Vision et priorités */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-assembly-blue">
                  Vision et priorités
                </h2>
                <div className="h-1 w-20 mt-4 bg-gradient-to-r from-assembly-blue to-assembly-gold"></div>
              </div>
              <div className="prose max-w-none">
                <p className="mb-4">
                  En tant que député, Guy Marius Sagna s'est fixé plusieurs priorités qui guident son action parlementaire :
                </p>
                <ul className="mb-4">
                  <li className="mb-2">
                    <strong>Éducation :</strong> Œuvrer pour un système éducatif de qualité, accessible à tous les Sénégalais, indépendamment de leur origine sociale ou géographique.
                  </li>
                  <li className="mb-2">
                    <strong>Santé :</strong> Améliorer l'accès aux soins de santé, particulièrement dans les zones rurales, et renforcer le système sanitaire national.
                  </li>
                  <li className="mb-2">
                    <strong>Emploi des jeunes :</strong> Promouvoir des politiques favorisant la création d'emplois durables et soutenir l'entrepreneuriat des jeunes.
                  </li>
                  <li className="mb-2">
                    <strong>Justice sociale :</strong> Lutter contre les inégalités sociales et économiques, et promouvoir une répartition plus équitable des ressources nationales.
                  </li>
                  <li>
                    <strong>Souveraineté économique :</strong> Défendre les intérêts économiques du Sénégal dans les accords internationaux et promouvoir une gestion transparente des ressources naturelles.
                  </li>
                </ul>
                <p>
                  Sa vision politique est ancrée dans la conviction que le développement du Sénégal doit être inclusif, équitable et centré sur les besoins des populations les plus vulnérables. Il plaide pour une gouvernance transparente et participative, où les citoyens sont activement impliqués dans les décisions qui affectent leur vie quotidienne.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BiographiePage;
