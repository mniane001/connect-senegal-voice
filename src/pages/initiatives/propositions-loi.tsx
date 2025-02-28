
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BookOpen } from "lucide-react";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PropositionsLoiPage = () => {
  const [selectedTab, setSelectedTab] = useState("15");

  const propositions = {
    "15": [
      {
        id: 1,
        title: "Loi sur la transparence des industries extractives",
        description: "Proposition visant à renforcer la transparence dans la gestion des ressources...",
        date: "20 Décembre 2023",
        status: "En examen",
      },
      {
        id: 2,
        title: "Protection des lanceurs d'alerte",
        description: "Projet de loi pour la protection juridique des dénonciateurs...",
        date: "10 Décembre 2023",
        status: "En examen",
      },
    ],
    "14": [
      {
        id: 3,
        title: "Réforme du code de l'environnement",
        description: "Mise à jour des dispositions relatives à la protection environnementale...",
        date: "1 Décembre 2022",
        status: "Rejetée",
      },
      {
        id: 4,
        title: "Modernisation de la justice",
        description: "Proposition pour améliorer l'efficacité et l'accessibilité de la justice...",
        date: "20 Novembre 2022",
        status: "Adoptée",
      },
      {
        id: 5,
        title: "Droits des travailleurs",
        description: "Renforcement des protections sociales et des conditions de travail...",
        date: "10 Novembre 2021",
        status: "Adoptée partiellement",
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
            Propositions de Loi
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Textes législatifs proposés pour améliorer le cadre juridique
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
                Liste des propositions de loi soumises pendant la législature actuelle
              </p>
            </div>
          </TabsContent>

          <TabsContent value="14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                14e Législature (2017-2022)
              </h2>
              <p className="text-gray-600 mb-4">
                Liste des propositions de loi soumises pendant la législature précédente
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="overflow-hidden rounded-xl shadow-md bg-white mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propositions[selectedTab as keyof typeof propositions].map((proposition) => (
                <TableRow key={proposition.id}>
                  <TableCell className="font-medium">
                    {proposition.title}
                    <p className="text-sm text-gray-500 mt-1">{proposition.description}</p>
                  </TableCell>
                  <TableCell>{proposition.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      proposition.status === "Adoptée" ? "bg-green-100 text-green-800" :
                      proposition.status === "Rejetée" ? "bg-red-100 text-red-800" :
                      proposition.status === "Adoptée partiellement" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {proposition.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      to={`/initiatives/propositions-loi/${proposition.id}`}
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
            À propos des propositions de loi
          </h3>
          <p className="mb-4">
            Les propositions de loi sont des textes législatifs soumis par un ou plusieurs députés pour améliorer le cadre juridique existant. Contrairement aux projets de loi qui émanent du gouvernement, elles sont issues des membres de l'Assemblée nationale.
          </p>
          <p>
            Chaque proposition suit un processus législatif rigoureux : examen en commission, débat en séance plénière, vote, et éventuellement promulgation par le Président de la République.
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default PropositionsLoiPage;
