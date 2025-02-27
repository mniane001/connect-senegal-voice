
import { FileText, MessageSquare, Users, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/initiatives/HeroSection";
import InitiativeCard from "@/components/initiatives/InitiativeCard";

const InitiativesPage = () => {
  const questionsEcrites = {
    title: "Questions Écrites",
    description: "Interrogations formelles adressées au gouvernement sur des sujets spécifiques",
    icon: FileText,
    items: [
      {
        title: "Question sur l'accès aux soins dans les zones rurales",
        description: "Adressée au Ministre de la Santé - Manque de personnel médical",
        date: "15 Mars 2024",
        linkText: "Lire la suite →",
        linkUrl: "/initiatives/questions-ecrites/1"
      },
      {
        title: "État des infrastructures scolaires",
        description: "Adressée au Ministre de l'Éducation - Rénovation des écoles",
        date: "10 Mars 2024",
        linkText: "Lire la suite →",
        linkUrl: "/initiatives/questions-ecrites/2"
      },
      {
        title: "Programme de développement agricole",
        description: "Adressée au Ministre de l'Agriculture - Soutien aux agriculteurs",
        date: "5 Mars 2024",
        linkText: "Lire la suite →",
        linkUrl: "/initiatives/questions-ecrites/3"
      }
    ],
    viewAllLink: "/initiatives/questions-ecrites",
    viewAllText: "Voir toutes les questions écrites"
  };

  const questionsOrales = {
    title: "Questions Orales",
    description: "Questions posées directement aux membres du gouvernement lors des séances",
    icon: MessageSquare,
    items: [
      {
        title: "Interpellation sur l'accès à l'eau potable",
        description: "Session plénière - Débat sur la distribution d'eau",
        date: "10 Février 2024",
        linkText: "Voir la vidéo →",
        linkUrl: "/initiatives/questions-orales/1"
      },
      {
        title: "La situation de l'emploi des jeunes",
        description: "Session plénière - Politique de l'emploi",
        date: "5 Février 2024",
        linkText: "Voir la vidéo →",
        linkUrl: "/initiatives/questions-orales/2"
      },
      {
        title: "Débat sur la politique énergétique",
        description: "Session plénière - Transition énergétique",
        date: "1 Février 2024",
        linkText: "Voir la vidéo →",
        linkUrl: "/initiatives/questions-orales/3"
      }
    ],
    viewAllLink: "/initiatives/questions-orales",
    viewAllText: "Voir toutes les questions orales"
  };

  const commissionsEnquete = {
    title: "Propositions de Commission d'Enquête",
    description: "Initiatives pour la création de commissions d'investigation parlementaire",
    icon: Users,
    items: [
      {
        title: "Commission sur la gestion des ressources minières",
        description: "Transparence et équité dans le secteur minier",
        date: "5 Janvier 2024",
        linkText: "Voir le dossier →",
        linkUrl: "/initiatives/commissions-enquete/1"
      },
      {
        title: "Enquête sur la gestion des fonds COVID-19",
        description: "Utilisation des ressources pendant la pandémie",
        date: "15 Décembre 2023",
        linkText: "Voir le dossier →",
        linkUrl: "/initiatives/commissions-enquete/2"
      }
    ],
    viewAllLink: "/initiatives/commissions-enquete",
    viewAllText: "Voir toutes les commissions d'enquête"
  };

  const propositionsLoi = {
    title: "Propositions de Loi",
    description: "Textes législatifs proposés pour améliorer le cadre juridique",
    icon: BookOpen,
    items: [
      {
        title: "Loi sur la transparence des industries extractives",
        description: "Renforcement du cadre de gouvernance",
        date: "20 Décembre 2023",
        linkText: "Lire le projet →",
        linkUrl: "/initiatives/propositions-loi/1"
      },
      {
        title: "Protection des lanceurs d'alerte",
        description: "Cadre juridique pour la protection des dénonciateurs",
        date: "10 Décembre 2023",
        linkText: "Lire le projet →",
        linkUrl: "/initiatives/propositions-loi/2"
      }
    ],
    viewAllLink: "/initiatives/propositions-loi",
    viewAllText: "Voir toutes les propositions de loi"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InitiativeCard {...questionsEcrites} />
          <InitiativeCard {...questionsOrales} />
          <InitiativeCard {...commissionsEnquete} />
          <InitiativeCard {...propositionsLoi} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InitiativesPage;
