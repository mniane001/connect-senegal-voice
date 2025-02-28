
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FileText } from "lucide-react";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";

const QuestionsEcritesPage = () => {
  const [selectedTab, setSelectedTab] = useState("15");

  const questions = {
    "15": [
      {
        id: 1,
        title: "Question sur l'accès aux soins dans les zones rurales",
        description: "Adressée au Ministre de la Santé concernant l'accès aux soins dans les zones rurales...",
        date: "15 Mars 2024",
        status: "En attente de réponse",
        ministry: "Ministère de la Santé",
      },
      {
        id: 2,
        title: "État des infrastructures scolaires",
        description: "Adressée au Ministre de l'Éducation concernant la rénovation des écoles...",
        date: "10 Mars 2024",
        status: "En attente de réponse",
        ministry: "Ministère de l'Éducation",
      },
      {
        id: 3,
        title: "Programme de développement agricole",
        description: "Adressée au Ministre de l'Agriculture concernant le soutien aux agriculteurs...",
        date: "5 Mars 2024",
        status: "Répondu",
        ministry: "Ministère de l'Agriculture",
      },
    ],
    "14": [
      {
        id: 4,
        title: "Transport public urbain",
        description: "Adressée au Ministre des Transports concernant la modernisation des transports...",
        date: "1 Mars 2022",
        status: "Répondu",
        ministry: "Ministère des Transports",
      },
      {
        id: 5,
        title: "Gestion des déchets urbains",
        description: "Adressée au Ministre de l'Environnement concernant le traitement des déchets...",
        date: "25 Février 2022",
        status: "Répondu",
        ministry: "Ministère de l'Environnement",
      },
      {
        id: 6,
        title: "Accès à l'eau potable",
        description: "Question concernant les infrastructures hydrauliques en zone rurale...",
        date: "15 Janvier 2022",
        status: "Sans réponse",
        ministry: "Ministère de l'Hydraulique",
      }
    ]
  };

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
        <div className="mb-6">
          <BackButton to="/initiatives" />
        </div>
        
        <Tabs defaultValue="15" onValueChange={setSelectedTab} className="mb-8">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="15">15e Législature (2022-2027)</TabsTrigger>
              <TabsTrigger value="14">14e Législature (2017-2022)</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="15">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                15e Législature (2022-2027)
              </h2>
              <p className="text-gray-600 mb-4">
                Questions écrites déposées pendant la législature actuelle
              </p>
            </div>
          </TabsContent>

          <TabsContent value="14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                14e Législature (2017-2022)
              </h2>
              <p className="text-gray-600 mb-4">
                Questions écrites déposées pendant la législature précédente
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="overflow-hidden rounded-xl shadow-md bg-white mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Question</TableHead>
                <TableHead>Ministère</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions[selectedTab as keyof typeof questions].map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">
                    {question.title}
                    <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                  </TableCell>
                  <TableCell>{question.ministry}</TableCell>
                  <TableCell>{question.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      question.status === "Répondu" ? "bg-green-100 text-green-800" :
                      question.status === "Sans réponse" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {question.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      to={`/initiatives/questions-ecrites/${question.id}`}
                      className="text-assembly-blue hover:underline"
                    >
                      Voir le détail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-assembly-blue/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-assembly-blue mb-4">
            À propos des questions écrites
          </h3>
          <p className="mb-4">
            Les questions écrites sont un moyen pour les députés d'interroger formellement les membres du gouvernement sur des sujets spécifiques. Le ministre concerné dispose généralement d'un délai pour fournir une réponse écrite.
          </p>
          <p>
            Ces questions constituent un outil important du contrôle parlementaire de l'action gouvernementale et permettent d'aborder des problématiques locales ou nationales qui préoccupent les citoyens.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionsEcritesPage;
