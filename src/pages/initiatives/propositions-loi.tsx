
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BookOpen } from "lucide-react";

const PropositionsLoiPage = () => {
  const propositions = [
    {
      id: 1,
      title: "Loi sur la transparence des industries extractives",
      description: "Proposition visant à renforcer la transparence dans la gestion des ressources...",
      date: "20 Décembre 2023",
    },
    {
      id: 2,
      title: "Protection des lanceurs d'alerte",
      description: "Projet de loi pour la protection juridique des dénonciateurs...",
      date: "10 Décembre 2023",
    },
    {
      id: 3,
      title: "Réforme du code de l'environnement",
      description: "Mise à jour des dispositions relatives à la protection environnementale...",
      date: "1 Décembre 2023",
    },
    {
      id: 4,
      title: "Modernisation de la justice",
      description: "Proposition pour améliorer l'efficacité et l'accessibilité de la justice...",
      date: "20 Novembre 2023",
    },
    {
      id: 5,
      title: "Droits des travailleurs",
      description: "Renforcement des protections sociales et des conditions de travail...",
      date: "10 Novembre 2023",
    }
  ];

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
            Propositions de Loi
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Textes législatifs proposés pour améliorer le cadre juridique
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="space-y-6">
          {propositions.map((proposition) => (
            <Link
              key={proposition.id}
              to={`/initiatives/propositions-loi/${proposition.id}`}
              className="block card-official p-6 transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-start">
                <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                  <BookOpen className="text-assembly-blue h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-assembly-blue mb-2">
                    {proposition.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {proposition.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{proposition.date}</span>
                    <span className="text-sm text-assembly-blue hover:underline">
                      Lire le projet →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropositionsLoiPage;
