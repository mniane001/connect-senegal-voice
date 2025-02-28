
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Calendar, User, FileCheck } from "lucide-react";
import BackButton from "@/components/BackButton";

const PropositionLoiDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-custom py-12 mt-16">
        <div className="mb-4">
          <BackButton to="/initiatives/propositions-loi" />
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-assembly-blue p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              Proposition de loi sur la transparence des industries extractives
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Déposée le 20 Décembre 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Guy Marius Sagna</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>N° 2024-001</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold text-assembly-blue mb-4">Exposé des motifs</h2>
              <p className="text-gray-600 mb-6">
                La présente proposition de loi vise à renforcer la transparence dans le secteur des industries extractives au Sénégal. Dans un contexte de développement des activités minières et pétrolières, il est crucial d'assurer une gestion transparente et équitable des ressources naturelles...
              </p>

              <h2 className="text-xl font-bold text-assembly-blue mb-4">Articles principaux</h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">Article 1 - Objet de la loi</h3>
                  <p className="text-gray-600">
                    La présente loi fixe les règles de transparence applicables à l'ensemble des activités extractives...
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">Article 2 - Champ d'application</h3>
                  <p className="text-gray-600">
                    Les dispositions de la présente loi s'appliquent à toutes les entreprises extractives...
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-assembly-blue mb-4">État d'avancement</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">1</div>
                  <div>
                    <h3 className="font-bold">Dépôt</h3>
                    <p className="text-sm text-gray-500">20 décembre 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">2</div>
                  <div>
                    <h3 className="font-bold">Examen en commission</h3>
                    <p className="text-sm text-gray-500">En cours</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Statut: En commission
                </span>
                <div className="flex gap-2">
                  <button className="text-assembly-blue hover:underline text-sm">
                    Partager
                  </button>
                  <button className="text-assembly-blue hover:underline text-sm">
                    Télécharger le texte intégral
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropositionLoiDetailPage;
