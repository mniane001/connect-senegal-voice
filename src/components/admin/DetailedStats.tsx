
import StatsChart from "./StatsChart";

interface InitiativeStats {
  total: number;
  by_type: {
    question_ecrite: number;
    question_orale: number;
    commission_enquete: number;
    proposition_loi: number;
  };
  by_legislature: {
    "15": number;
    "14": number;
  };
  by_status: {
    submitted: number;
    in_progress: number;
    completed: number;
    approved: number;
    rejected: number;
  };
}

interface QuestionStats {
  total: number;
  by_status: {
    submitted: number;
    in_progress: number;
    completed: number;
    rejected: number;
  };
  by_category: Record<string, number>;
}

interface AudienceStats {
  total: number;
  by_status: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
  };
}

interface ActualiteStats {
  total: number;
  by_category: Record<string, number>;
}

interface DetailedStatsProps {
  initiativeStats: InitiativeStats;
  questionStats: QuestionStats;
  audienceStats: AudienceStats;
  actualiteStats: ActualiteStats;
}

const DetailedStats = ({
  initiativeStats,
  questionStats,
  audienceStats,
  actualiteStats,
}: DetailedStatsProps) => {
  // Données pour graphique des initiatives par type
  const initiativesByTypeData = [
    { name: "Questions écrites", value: initiativeStats.by_type.question_ecrite, color: "#0088FE" },
    { name: "Questions orales", value: initiativeStats.by_type.question_orale, color: "#00C49F" },
    { name: "Commissions d'enquête", value: initiativeStats.by_type.commission_enquete, color: "#FFBB28" },
    { name: "Propositions de loi", value: initiativeStats.by_type.proposition_loi, color: "#FF8042" },
  ];

  // Données pour graphique des initiatives par législature
  const initiativesByLegislatureData = [
    { name: "15e législature", value: initiativeStats.by_legislature["15"] },
    { name: "14e législature", value: initiativeStats.by_legislature["14"] },
  ];

  // Données pour graphique des initiatives par statut
  const initiativesByStatusData = [
    { name: "Soumis", value: initiativeStats.by_status.submitted, color: "#FFC107" },
    { name: "En cours", value: initiativeStats.by_status.in_progress, color: "#03A9F4" },
    { name: "Complété", value: initiativeStats.by_status.completed, color: "#4CAF50" },
    { name: "Approuvé", value: initiativeStats.by_status.approved, color: "#8BC34A" },
    { name: "Rejeté", value: initiativeStats.by_status.rejected, color: "#F44336" },
  ];

  // Données pour graphique des questions citoyennes par statut
  const questionsByStatusData = [
    { name: "Soumis", value: questionStats.by_status.submitted, color: "#FFC107" },
    { name: "En cours", value: questionStats.by_status.in_progress, color: "#03A9F4" },
    { name: "Complété", value: questionStats.by_status.completed, color: "#4CAF50" },
    { name: "Rejeté", value: questionStats.by_status.rejected, color: "#F44336" },
  ];

  // Données pour graphique des questions citoyennes par catégorie
  const questionsByCategoryData = Object.entries(questionStats.by_category).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  // Données pour graphique des audiences par statut
  const audiencesByStatusData = [
    { name: "En attente", value: audienceStats.by_status.pending, color: "#FFC107" },
    { name: "Approuvé", value: audienceStats.by_status.approved, color: "#4CAF50" },
    { name: "Rejeté", value: audienceStats.by_status.rejected, color: "#F44336" },
    { name: "Complété", value: audienceStats.by_status.completed, color: "#03A9F4" },
  ];

  // Données pour graphique des actualités par catégorie
  const actualitesByCategoryData = Object.entries(actualiteStats.by_category).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Initiatives par type"
          description="Répartition des initiatives parlementaires par type"
          data={initiativesByTypeData}
          type="pie"
        />
        <StatsChart
          title="Initiatives par législature"
          description="Répartition des initiatives parlementaires par législature"
          data={initiativesByLegislatureData}
          type="bar"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Initiatives par statut"
          description="Répartition des initiatives parlementaires par statut"
          data={initiativesByStatusData}
          type="pie"
        />
        <StatsChart
          title="Questions citoyennes par statut"
          description="Répartition des questions citoyennes par statut"
          data={questionsByStatusData}
          type="pie"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Questions citoyennes par catégorie"
          description="Répartition des questions citoyennes par catégorie"
          data={questionsByCategoryData}
          type="bar"
          height={400}
        />
        <StatsChart
          title="Audiences par statut"
          description="Répartition des demandes d'audience par statut"
          data={audiencesByStatusData}
          type="pie"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StatsChart
          title="Actualités par catégorie"
          description="Répartition des actualités par catégorie"
          data={actualitesByCategoryData}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
};

export default DetailedStats;
