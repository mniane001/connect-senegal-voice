
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsChart from "./StatsChart";

interface Question {
  id: string;
  status: string;
  category: string;
  title: string;
  created_at: string;
}

interface QuestionStatsProps {
  questions: Question[];
}

const QuestionStats = ({ questions }: QuestionStatsProps) => {
  // Statistiques par statut
  const statusCount = {
    submitted: questions.filter((q) => q.status === "submitted").length,
    in_progress: questions.filter((q) => q.status === "in_progress").length,
    completed: questions.filter((q) => q.status === "completed").length,
    rejected: questions.filter((q) => q.status === "rejected").length,
  };

  const statusData = [
    { name: "Soumises", value: statusCount.submitted, color: "#FFC107" },
    { name: "En cours", value: statusCount.in_progress, color: "#03A9F4" },
    { name: "Complétées", value: statusCount.completed, color: "#4CAF50" },
    { name: "Rejetées", value: statusCount.rejected, color: "#F44336" },
  ];

  // Statistiques par catégorie
  const categoryMap = questions.reduce((acc, question) => {
    const category = question.category || "Non catégorisé";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Statistiques par mois
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const monthlyData: Record<string, number> = {};
  
  // Initialiser les 6 derniers mois avec 0
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
    monthlyData[monthName] = 0;
  }

  // Remplir avec des données réelles
  questions.forEach(question => {
    const date = new Date(question.created_at);
    
    // Ne compter que les 6 derniers mois
    if (date >= sixMonthsAgo) {
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      monthlyData[monthName] = (monthlyData[monthName] || 0) + 1;
    }
  });

  // Convertir en format pour le graphique
  const monthlyChartData = Object.entries(monthlyData)
    .map(([name, value]) => ({ name, value }))
    .reverse(); // Pour avoir l'ordre chronologique

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{questions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCount.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCount.in_progress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCount.completed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Répartition par statut"
          data={statusData}
          type="pie"
        />
        <StatsChart
          title="Tendance mensuelle"
          description="Questions reçues ces derniers mois"
          data={monthlyChartData}
          type="bar"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <StatsChart
          title="Répartition par catégorie"
          data={categoryData}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
};

export default QuestionStats;
