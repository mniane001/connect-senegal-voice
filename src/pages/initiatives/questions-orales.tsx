
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MessageSquare, Video } from "lucide-react";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuestionsOralesPage = () => {
  const [selectedTab, setSelectedTab] = useState("15");

  const questions = {
    "15": [
      {
        id: 1,
        title: "Interpellation sur l'accès à l'eau potable",
        description: "Question posée lors de la session plénière concernant la distribution d'eau...",
        date: "10 Février 2024",
        hasVideo: true,
        ministry: "Ministère de l'Hydraulique",
      },
      {
        id: 2,
        title: "La situation de l'emploi des jeunes",
        description: "Session plénière sur les politiques d'emploi et l'insertion professionnelle...",
        date: "5 Février 2024",
        hasVideo: true,
        ministry: "Ministère de l'Emploi",
      },
      {
        id: 3,
        title: "Débat sur la politique énergétique",
        description: "Question sur la transition énergétique et l'accès à l'électricité...",
        date: "1 Février 2024",
        hasVideo: true,
        ministry: "Ministère de l'Énergie",
      },
    ],
    "14": [
      {
        id: 4,
        title: "Sécurité alimentaire",
        description: "Question sur les mesures pour assurer la sécurité alimentaire...",
        date: "25 Janvier 2022",
        hasVideo: true,
        ministry: "Ministère de l'Agriculture",
      },
      {
        id: 5,
        title: "Qualité de l'éducation",
        description: "Débat sur la qualité de l'enseignement et les conditions d'apprentissage...",
        date: "20 Janvier 2022",
        hasVideo: false,
        ministry: "Ministère de l'Éducation",
      },
      {
        id: 6,
        title: "Infrastructure routière",
        description: "Question sur l'état des routes et les projets de développement...",
        date: "15 Janvier 2022",
        hasVideo: true,
        ministry: "Ministère des Infrastructures",
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
            Questions Orales
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Questions posées directement aux membres du gouvernement lors des séances
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
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
                Questions orales posées pendant la législature actuelle
              </p>
            </div>
          </TabsContent>

          <TabsContent value="14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                14e Législature (2017-2022)
              </h2>
              <p className="text-gray-600 mb-4">
                Questions orales posées pendant la législature précédente
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
                <TableHead>Vidéo</TableHead>
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
                    {question.hasVideo ? (
                      <span className="flex items-center text-green-600">
                        <Video className="w-4 h-4 mr-1" />
                        Disponible
                      </span>
                    ) : (
                      <span className="text-gray-500">Non disponible</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      to={`/initiatives/questions-orales/${question.id}`}
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
            À propos des questions orales
          </h3>
          <p className="mb-4">
            Les questions orales sont posées directement en séance plénière aux membres du gouvernement. Elles permettent un débat direct et public sur des sujets d'actualité ou d'importance nationale.
          </p>
          <p>
            Ces sessions sont généralement retransmises et constituent un moment important de la vie parlementaire, permettant aux citoyens de suivre les échanges entre leurs représentants et le gouvernement.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionsOralesPage;
