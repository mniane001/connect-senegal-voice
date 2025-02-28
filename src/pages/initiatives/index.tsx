
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InitiativeCard from "@/components/initiatives/InitiativeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";

const InitiativesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-24 bg-assembly-blue text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Initiatives Parlementaires</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Découvrez les actions et initiatives portées par votre député à l'Assemblée nationale
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="mb-6">
          <BackButton to="/" />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto mb-8">
            <TabsTrigger value="all" className="text-base py-3">Toutes les initiatives</TabsTrigger>
            <TabsTrigger value="written" className="text-base py-3">Questions écrites</TabsTrigger>
            <TabsTrigger value="oral" className="text-base py-3">Questions orales</TabsTrigger>
            <TabsTrigger value="laws" className="text-base py-3">Propositions de loi</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InitiativeCard 
                title="Questions écrites" 
                description="Questions posées par écrit aux ministres pour obtenir des explications sur la politique du gouvernement"
                icon="FileText"
                href="/initiatives/questions-ecrites"
                count={18}
              />
              <InitiativeCard 
                title="Questions orales" 
                description="Questions posées en séance publique aux membres du gouvernement"
                icon="MessageSquare"
                href="/initiatives/questions-orales"
                count={12}
              />
              <InitiativeCard 
                title="Propositions de loi" 
                description="Textes législatifs soumis pour améliorer le cadre juridique existant"
                icon="BookOpen"
                href="/initiatives/propositions-loi"
                count={5}
              />
              <InitiativeCard 
                title="Commissions d'enquête" 
                description="Initiatives pour la création de commissions d'investigation parlementaire"
                icon="Users"
                href="/initiatives/commissions-enquete"
                count={2}
              />
            </div>
          </TabsContent>

          <TabsContent value="written">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InitiativeCard 
                title="Questions écrites" 
                description="Questions posées par écrit aux ministres pour obtenir des explications sur la politique du gouvernement"
                icon="FileText"
                href="/initiatives/questions-ecrites"
                count={18}
              />
            </div>
          </TabsContent>

          <TabsContent value="oral">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InitiativeCard 
                title="Questions orales" 
                description="Questions posées en séance publique aux membres du gouvernement"
                icon="MessageSquare"
                href="/initiatives/questions-orales"
                count={12}
              />
            </div>
          </TabsContent>

          <TabsContent value="laws">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InitiativeCard 
                title="Propositions de loi" 
                description="Textes législatifs soumis pour améliorer le cadre juridique existant"
                icon="BookOpen"
                href="/initiatives/propositions-loi"
                count={5}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-assembly-blue/5 rounded-xl">
          <h2 className="text-2xl font-bold text-assembly-blue mb-4">À propos des initiatives parlementaires</h2>
          <p className="mb-4">
            Les initiatives parlementaires sont des actions que les députés peuvent entreprendre pour exercer leur double mission de représentation et de contrôle. Elles comprennent notamment les questions écrites et orales, les propositions de loi, et les demandes de commissions d'enquête.
          </p>
          <p>
            Votre député s'engage à utiliser activement ces outils pour porter vos préoccupations au plus haut niveau de l'État et contribuer à l'amélioration des politiques publiques.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InitiativesPage;
