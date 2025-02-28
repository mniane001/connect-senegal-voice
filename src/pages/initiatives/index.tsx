
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
        date: "15 Mars 2024 | 15e Législature",
        linkText: "Lire la suite →",
        linkUrl: "/initiatives/questions-ecrites/1"
      },
      {
        title: "État des infrastructures scolaires",
        description: "Adressée au Ministre de l'Éducation - Rénovation des écoles",
        date: "10 Mars 2024 | 15e Législature",
        linkText: "Lire la suite →",
        linkUrl: "/initiatives/questions-ecrites/2"
      },
      {
        title: "Transport public urbain",
        description: "Adressée au Ministre des Transports - Modernisation",
        date: "1 Mars 2022 | 14e Législature",
        linkText: "Lire la suite →",
        linkUrl: "/initiatives/questions-ecrites/4"
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
        date: "10 Février 2024 | 15e Législature",
        linkText: "Voir la vidéo →",
        linkUrl: "/initiatives/questions-orales/1"
      },
      {
        title: "La situation de l'emploi des jeunes",
        description: "Session plénière - Politique de l'emploi",
        date: "5 Février 2024 | 15e Législature",
        linkText: "Voir la vidéo →",
        linkUrl: "/initiatives/questions-orales/2"
      },
      {
        title: "Sécurité alimentaire",
        description: "Question sur les mesures pour assurer la sécurité alimentaire",
        date: "25 Janvier 2022 | 14e Législature",
        linkText: "Voir la vidéo →",
        linkUrl: "/initiatives/questions-orales/4"
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
        date: "5 Janvier 2024 | 15e Législature",
        linkText: "Voir le dossier →",
        linkUrl: "/initiatives/commissions-enquete/1"
      },
      {
        title: "Enquête sur la gestion des fonds COVID-19",
        description: "Utilisation des ressources pendant la pandémie",
        date: "15 Décembre 2023 | 15e Législature",
        linkText: "Voir le dossier →",
        linkUrl: "/initiatives/commissions-enquete/2"
      },
      {
        title: "Audit des marchés publics",
        description: "Transparence des processus d'attribution",
        date: "1 Décembre 2021 | 14e Législature",
        linkText: "Voir le dossier →",
        linkUrl: "/initiatives/commissions-enquete/3"
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
        date: "20 Décembre 2023 | 15e Législature",
        linkText: "Lire le projet →",
        linkUrl: "/initiatives/propositions-loi/1"
      },
      {
        title: "Protection des lanceurs d'alerte",
        description: "Cadre juridique pour la protection des dénonciateurs",
        date: "10 Décembre 2023 | 15e Législature",
        linkText: "Lire le projet →",
        linkUrl: "/initiatives/propositions-loi/2"
      },
      {
        title: "Réforme du code de l'environnement",
        description: "Mise à jour des dispositions environnementales",
        date: "1 Décembre 2022 | 14e Législature",
        linkText: "Lire le projet →",
        linkUrl: "/initiatives/propositions-loi/3"
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
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-assembly-blue">
            Travaux parlementaires par législature
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Retrouvez l'ensemble de mes initiatives parlementaires pour les 14e et 15e législatures
          </p>
        </div>
        
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
