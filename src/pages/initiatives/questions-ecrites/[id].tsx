
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FileText, Calendar, User, Building2 } from "lucide-react";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

const QuestionEcriteDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-custom py-12 mt-16">
        <div className="mb-4">
          <BackButton to="/initiatives/questions-ecrites" />
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-assembly-blue p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              Question sur la politique de santé rurale
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Déposée le 15 Mars 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Guy Marius Sagna</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Ministère de la Santé</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold text-assembly-blue mb-4">Question</h2>
              <p className="text-gray-600 mb-6">
                Monsieur le Ministre de la Santé,
                <br /><br />
                La situation des infrastructures de santé dans les zones rurales du Sénégal soulève de nombreuses préoccupations. Dans ma circonscription, plusieurs localités font face à des défis majeurs en matière d'accès aux soins de base.
                <br /><br />
                1. Quelles mesures concrètes comptez-vous prendre pour améliorer la couverture sanitaire dans les zones rurales ?
                <br /><br />
                2. Quel est le plan d'action pour le recrutement et la rétention du personnel médical dans ces zones ?
                <br /><br />
                3. Quel budget sera alloué à la rénovation et à l'équipement des centres de santé ruraux pour l'année 2024 ?
              </p>

              <h2 className="text-xl font-bold text-assembly-blue mb-4">Réponse du Ministre</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 italic">En attente de réponse</p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  En attente de réponse
                </span>
                <div className="flex gap-2">
                  <button className="text-assembly-blue hover:underline text-sm">
                    Partager
                  </button>
                  <button className="text-assembly-blue hover:underline text-sm">
                    Télécharger le PDF
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

export default QuestionEcriteDetailPage;
