
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Calendar, User, FileText } from "lucide-react";
import BackButton from "@/components/BackButton";

const CommissionEnqueteDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-custom py-12 mt-16">
        <div className="mb-4">
          <BackButton to="/initiatives/commissions-enquete" />
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-assembly-blue p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              Commission d'enquête sur la gestion des ressources minières
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Initiée le 5 Janvier 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Guy Marius Sagna</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold text-assembly-blue mb-4">Objectifs de la commission</h2>
              <p className="text-gray-600 mb-6">
                Cette commission d'enquête vise à faire la lumière sur la gestion des ressources minières au Sénégal, notamment :
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>L'attribution des permis d'exploitation</li>
                <li>La transparence des contrats miniers</li>
                <li>L'impact environnemental des activités minières</li>
                <li>La redistribution des revenus aux communautés locales</li>
              </ul>

              <h2 className="text-xl font-bold text-assembly-blue mb-4">Composition de la commission</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">Président</h3>
                  <p>M. Guy Marius Sagna</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">Rapporteur</h3>
                  <p>À désigner</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-assembly-blue mb-4">État d'avancement</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">1</div>
                  <div>
                    <h3 className="font-bold">Dépôt de la proposition</h3>
                    <p className="text-sm text-gray-500">Complété le 5 janvier 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">2</div>
                  <div>
                    <h3 className="font-bold">Examen en commission</h3>
                    <p className="text-sm text-gray-500">En cours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center">3</div>
                  <div>
                    <h3 className="font-bold">Vote en séance plénière</h3>
                    <p className="text-sm text-gray-500">À venir</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Statut: En cours d'examen
                </span>
                <div className="flex gap-2">
                  <button className="text-assembly-blue hover:underline text-sm">
                    Partager
                  </button>
                  <button className="text-assembly-blue hover:underline text-sm">
                    Télécharger le dossier complet
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

export default CommissionEnqueteDetailPage;
