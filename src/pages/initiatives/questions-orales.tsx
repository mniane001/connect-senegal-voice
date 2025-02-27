
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MessageSquare } from "lucide-react";

const QuestionsOralesPage = () => {
  const questions = [
    {
      id: 1,
      title: "Interpellation sur l'accès à l'eau potable",
      description: "Question posée lors de la session plénière concernant la distribution d'eau...",
      date: "10 Février 2024",
    },
    {
      id: 2,
      title: "La situation de l'emploi des jeunes",
      description: "Session plénière sur les politiques d'emploi et l'insertion professionnelle...",
      date: "5 Février 2024",
    },
    {
      id: 3,
      title: "Débat sur la politique énergétique",
      description: "Question sur la transition énergétique et l'accès à l'électricité...",
      date: "1 Février 2024",
    },
    {
      id: 4,
      title: "Sécurité alimentaire",
      description: "Question sur les mesures pour assurer la sécurité alimentaire...",
      date: "25 Janvier 2024",
    },
    {
      id: 5,
      title: "Qualité de l'éducation",
      description: "Débat sur la qualité de l'enseignement et les conditions d'apprentissage...",
      date: "20 Janvier 2024",
    },
    {
      id: 6,
      title: "Infrastructure routière",
      description: "Question sur l'état des routes et les projets de développement...",
      date: "15 Janvier 2024",
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
            Questions Orales
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Questions posées directement aux membres du gouvernement lors des séances
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="space-y-6">
          {questions.map((question) => (
            <Link
              key={question.id}
              to={`/initiatives/questions-orales/${question.id}`}
              className="block card-official p-6 transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-start">
                <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                  <MessageSquare className="text-assembly-blue h-6 w-6" />
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
                    <span className="text-sm text-assembly-blue hover:underline">
                      Voir la vidéo →
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

export default QuestionsOralesPage;
