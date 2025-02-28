
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsChart from "../StatsChart";

interface InitiativesStatsProps {
  initiatives: {
    id: string;
    title: string;
    type: string;
    legislature: string;
    status: string;
    created_at: string;
    published: boolean;
  }[];
}

const InitiativesStats = ({ initiatives }: InitiativesStatsProps) => {
  // Statistiques par type
  const typeCount = {
    question_ecrite: initiatives.filter((i) => i.type === "question_ecrite").length,
    question_orale: initiatives.filter((i) => i.type === "question_orale").length,
    commission_enquete: initiatives.filter((i) => i.type === "commission_enquete").length,
    proposition_loi: initiatives.filter((i) => i.type === "proposition_loi").length,
  };

  const typeData = [
    { name: "Questions écrites", value: typeCount.question_ecrite, color: "#0088FE" },
    { name: "Questions orales", value: typeCount.question_orale, color: "#00C49F" },
    { name: "Commissions d'enquête", value: typeCount.commission_enquete, color: "#FFBB28" },
    { name: "Propositions de loi", value: typeCount.proposition_loi, color: "#FF8042" },
  ];

  // Statistiques par législature
  const legislatureCount = {
    "15": initiatives.filter((i) => i.legislature === "15").length,
    "14": initiatives.filter((i) => i.legislature === "14").length,
  };

  const legislatureData = [
    { name: "15e législature", value: legislatureCount["15"] },
    { name: "14e législature", value: legislatureCount["14"] },
  ];

  // Statistiques par statut
  const statusCount = {
    submitted: initiatives.filter((i) => i.status === "submitted").length,
    in_progress: initiatives.filter((i) => i.status === "in_progress").length,
    completed: initiatives.filter((i) => i.status === "completed").length,
    approved: initiatives.filter((i) => i.status === "approved").length,
    rejected: initiatives.filter((i) => i.status === "rejected").length,
  };

  const statusData = [
    { name: "Soumis", value: statusCount.submitted, color: "#FFC107" },
    { name: "En cours", value: statusCount.in_progress, color: "#03A9F4" },
    { name: "Complété", value: statusCount.completed, color: "#4CAF50" },
    { name: "Approuvé", value: statusCount.approved, color: "#8BC34A" },
    { name: "Rejeté", value: statusCount.rejected, color: "#F44336" },
  ];

  // Statistiques de publication
  const publishedCount = {
    published: initiatives.filter((i) => i.published).length,
    unpublished: initiatives.filter((i) => !i.published).length,
  };

  const publishedData = [
    { name: "Publiées", value: publishedCount.published, color: "#4CAF50" },
    { name: "Non publiées", value: publishedCount.unpublished, color: "#F44336" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{initiatives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Questions écrites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{typeCount.question_ecrite}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Questions orales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{typeCount.question_orale}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Propositions de loi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{typeCount.proposition_loi}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Répartition par type"
          data={typeData}
          type="pie"
        />
        <StatsChart
          title="Répartition par législature"
          data={legislatureData}
          type="bar"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Répartition par statut"
          data={statusData}
          type="pie"
        />
        <StatsChart
          title="État de publication"
          data={publishedData}
          type="pie"
        />
      </div>
    </div>
  );
};

export default InitiativesStats;
