
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsChart from "./StatsChart";

interface Actualite {
  id: string;
  title: string;
  category: string;
  published_at: string | null;
  created_at: string;
  published: boolean;
}

interface ActualiteStatsProps {
  actualites: Actualite[];
}

const ActualiteStats = ({ actualites }: ActualiteStatsProps) => {
  // Statistiques par catégorie
  const categoryMap = actualites.reduce((acc, actualite) => {
    const category = actualite.category || "Non catégorisé";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Statistiques par mois de publication
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
  actualites.forEach(actualite => {
    const date = new Date(actualite.published_at || actualite.created_at);
    
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

  // Statistiques de publication
  const publicationCount = {
    published: actualites.filter(a => a.published).length,
    draft: actualites.filter(a => !a.published).length,
  };

  const publicationData = [
    { name: "Publiées", value: publicationCount.published, color: "#4CAF50" },
    { name: "Brouillons", value: publicationCount.draft, color: "#FFC107" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{actualites.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Publiées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{publicationCount.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{publicationCount.draft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Object.keys(categoryMap).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsChart
          title="Statut de publication"
          data={publicationData}
          type="pie"
        />
        <StatsChart
          title="Tendance mensuelle"
          description="Publications ces derniers mois"
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

export default ActualiteStats;
