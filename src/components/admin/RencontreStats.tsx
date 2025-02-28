
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsChart from "./StatsChart";

interface Rencontre {
  id: string;
  created_at: string;
  status: string;
  subject: string;
  meeting_date?: string;
}

interface RencontreStatsProps {
  rencontres: Rencontre[];
}

const RencontreStats = ({ rencontres }: RencontreStatsProps) => {
  // Statistiques par statut
  const statusCount = {
    pending: rencontres.filter((r) => r.status === "pending").length,
    approved: rencontres.filter((r) => r.status === "approved").length,
    rejected: rencontres.filter((r) => r.status === "rejected").length,
    completed: rencontres.filter((r) => r.status === "completed").length,
  };

  const statusData = [
    { name: "En attente", value: statusCount.pending, color: "#FFC107" },
    { name: "Approuvées", value: statusCount.approved, color: "#4CAF50" },
    { name: "Rejetées", value: statusCount.rejected, color: "#F44336" },
    { name: "Complétées", value: statusCount.completed, color: "#03A9F4" },
  ];

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
  rencontres.forEach(rencontre => {
    const date = new Date(rencontre.created_at);
    
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

  // Audiences programmées par jour de la semaine
  const weekdayMap: Record<string, number> = {
    "Lundi": 0,
    "Mardi": 0,
    "Mercredi": 0,
    "Jeudi": 0,
    "Vendredi": 0,
    "Samedi": 0,
    "Dimanche": 0,
  };

  rencontres.forEach(rencontre => {
    if (rencontre.meeting_date) {
      const date = new Date(rencontre.meeting_date);
      const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      weekdayMap[weekday] = (weekdayMap[weekday] || 0) + 1;
    }
  });

  const weekdayData = Object.entries(weekdayMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{rencontres.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCount.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCount.approved}</p>
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
          description="Demandes reçues ces derniers mois"
          data={monthlyChartData}
          type="bar"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <StatsChart
          title="Répartition par jour de la semaine"
          description="Jours des audiences programmées"
          data={weekdayData}
          type="bar"
        />
      </div>
    </div>
  );
};

export default RencontreStats;
