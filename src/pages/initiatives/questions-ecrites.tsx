import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FileText } from "lucide-react";
import Footer from "@/components/Footer";

const QuestionsEcritesPage = () => {
  const questions = [
    {
      id: 1,
      title: "Question sur l'accès aux soins dans les zones rurales",
      description: "Adressée au Ministre de la Santé concernant l'accès aux soins dans les zones rurales...",
      date: "15 Mars 2024",
      status: "En attente de réponse",
    },
    {
      id: 2,
      title: "État des infrastructures scolaires",
      description: "Adressée au Ministre de l'Éducation concernant la rénovation des écoles...",
      date: "10 Mars 2024",
      status: "En attente de réponse",
    },
    {
      id: 3,
      title: "Programme de développement agricole",
      description: "Adressée au Ministre de l'Agriculture concernant le soutien aux agriculteurs...",
      date: "5 Mars 2024",
      status: "Répondu",
    },
    {
      id: 4,
      title: "Transport public urbain",
      description: "Adressée au Ministre des Transports concernant la modernisation des transports...",
      date: "1 Mars 2024",
      status: "En attente de réponse",
    },
    {
      id: 5,
      title: "Gestion des déchets urbains",
      description: "Adressée au Ministre de l'Environnement concernant le traitement des déchets...",
      date: "25 Février 2024",
      status: "En attente de réponse",
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
            Questions Écrites
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Interrogations formelles adressées au gouvernement sur des sujets spécifiques
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="space-y-6">
          {questions.map((question) => (
            <Link
              key={question.id}
              to={`/initiatives/questions-ecrites/${question.id}`}
              className="block card-official p-6 transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-start">
                <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                  <FileText className="text-assembly-blue h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-assembly-blue mb-2">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {question.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{question.date}</span>
                    <span className="text-sm px-3 py-1 bg-assembly-blue/10 text-assembly-blue rounded-full">
                      {question.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionsEcritesPage;
