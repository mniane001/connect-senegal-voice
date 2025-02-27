
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FileText, MessageSquare, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const InitiativesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 md:py-32" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url("https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`
        }}
      >
        <div className="container-custom text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Initiatives Parlementaires
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Découvrez mes activités et contributions à l'Assemblée nationale
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
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Questions Écrites */}
          <div className="card-official p-6">
            <div className="flex items-start">
              <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                <FileText className="text-assembly-blue h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                  Questions Écrites
                </h2>
                <p className="text-gray-600 mb-6">
                  Interrogations formelles adressées au gouvernement sur des sujets spécifiques
                </p>
                <div className="space-y-4 mb-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="border-l-4 border-assembly-blue p-4 bg-gray-50">
                      <h3 className="font-bold text-assembly-blue">
                        Question sur la politique de santé rurale
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Adressée au Ministre de la Santé
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">15 Mars 2024</span>
                        <Link to="#" className="text-assembly-blue hover:underline">
                          Lire la suite →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue hover:text-white"
                  asChild
                >
                  <Link to="/initiatives/questions-ecrites">
                    Voir toutes les questions écrites
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Questions Orales */}
          <div className="card-official p-6">
            <div className="flex items-start">
              <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                <MessageSquare className="text-assembly-blue h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                  Questions Orales
                </h2>
                <p className="text-gray-600 mb-6">
                  Questions posées directement aux membres du gouvernement lors des séances
                </p>
                <div className="space-y-4 mb-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="border-l-4 border-assembly-blue p-4 bg-gray-50">
                      <h3 className="font-bold text-assembly-blue">
                        Interpellation sur l'accès à l'eau
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Session plénière du 10 février 2024
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">10 Février 2024</span>
                        <Link to="#" className="text-assembly-blue hover:underline">
                          Voir la vidéo →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue hover:text-white"
                  asChild
                >
                  <Link to="/initiatives/questions-orales">
                    Voir toutes les questions orales
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Commissions d'Enquête */}
          <div className="card-official p-6">
            <div className="flex items-start">
              <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                <Users className="text-assembly-blue h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                  Propositions de Commission d'Enquête
                </h2>
                <p className="text-gray-600 mb-6">
                  Initiatives pour la création de commissions d'investigation parlementaire
                </p>
                <div className="space-y-4 mb-6">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="border-l-4 border-assembly-blue p-4 bg-gray-50">
                      <h3 className="font-bold text-assembly-blue">
                        Commission sur la gestion des ressources minières
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Proposition déposée le 5 janvier 2024
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">5 Janvier 2024</span>
                        <Link to="#" className="text-assembly-blue hover:underline">
                          Voir le dossier →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue hover:text-white"
                  asChild
                >
                  <Link to="/initiatives/commissions-enquete">
                    Voir toutes les commissions d'enquête
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Propositions de Loi */}
          <div className="card-official p-6">
            <div className="flex items-start">
              <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                <BookOpen className="text-assembly-blue h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                  Propositions de Loi
                </h2>
                <p className="text-gray-600 mb-6">
                  Textes législatifs proposés pour améliorer le cadre juridique
                </p>
                <div className="space-y-4 mb-6">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="border-l-4 border-assembly-blue p-4 bg-gray-50">
                      <h3 className="font-bold text-assembly-blue">
                        Loi sur la transparence des industries extractives
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        En cours d'examen en commission
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">20 Décembre 2023</span>
                        <Link to="#" className="text-assembly-blue hover:underline">
                          Lire le projet →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue hover:text-white"
                  asChild
                >
                  <Link to="/initiatives/propositions-loi">
                    Voir toutes les propositions de loi
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativesPage;
