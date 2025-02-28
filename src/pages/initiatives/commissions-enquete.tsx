
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Users } from "lucide-react";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";

const CommissionsEnquetePage = () => {
  const [selectedTab, setSelectedTab] = useState("15");

  const commissions = {
    "15": [
      {
        id: 1,
        title: "Commission sur la gestion des ressources minières",
        description: "Proposition de création d'une commission d'enquête sur la gestion des ressources...",
        date: "5 Janvier 2024",
        status: "En cours d'examen",
        result: null,
      },
      {
        id: 2,
        title: "Enquête sur la gestion des fonds COVID-19",
        description: "Commission d'enquête sur l'utilisation des ressources pendant la pandémie...",
        date: "15 Décembre 2023",
        status: "En cours d'examen",
        result: null,
      },
    ],
    "14": [
      {
        id: 3,
        title: "Audit des marchés publics",
        description: "Commission d'enquête sur la transparence des processus d'attribution...",
        date: "1 Décembre 2021",
        status: "Terminée",
        result: "Rapport publié",
      },
      {
        id: 4,
        title: "Gestion des terres agricoles",
        description: "Enquête sur l'attribution et la gestion des terres agricoles...",
        date: "15 Novembre 2021",
        status: "Terminée",
        result: "Rapport confidentiel",
      },
      {
        id: 5,
        title: "Privatisation des entreprises publiques",
        description: "Enquête sur les conditions de cession des actifs de l'État...",
        date: "10 Octobre 2021",
        status: "Rejetée",
        result: null,
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
            Commissions d'Enquête
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Initiatives pour la création de commissions d'investigation parlementaire
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
                Commissions d'enquête proposées pendant la législature actuelle
              </p>
            </div>
          </TabsContent>

          <TabsContent value="14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-assembly-blue mb-4">
                14e Législature (2017-2022)
              </h2>
              <p className="text-gray-600 mb-4">
                Commissions d'enquête proposées pendant la législature précédente
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="overflow-hidden rounded-xl shadow-md bg-white mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Commission</TableHead>
                <TableHead>Date de proposition</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Résultat</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions[selectedTab as keyof typeof commissions].map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">
                    {commission.title}
                    <p className="text-sm text-gray-500 mt-1">{commission.description}</p>
                  </TableCell>
                  <TableCell>{commission.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      commission.status === "Terminée" ? "bg-green-100 text-green-800" :
                      commission.status === "Rejetée" ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {commission.status}
                    </span>
                  </TableCell>
                  <TableCell>{commission.result || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Link 
                      to={`/initiatives/commissions-enquete/${commission.id}`}
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
            À propos des commissions d'enquête
          </h3>
          <p className="mb-4">
            Les commissions d'enquête parlementaire sont des outils puissants de contrôle de l'action gouvernementale. Elles permettent à l'Assemblée nationale d'investiguer sur des sujets d'intérêt public majeur.
          </p>
          <p>
            Dotées de pouvoirs spéciaux, ces commissions peuvent convoquer des témoins, accéder à des documents confidentiels et produire des rapports détaillés qui peuvent conduire à des réformes législatives ou à des poursuites judiciaires.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommissionsEnquetePage;
