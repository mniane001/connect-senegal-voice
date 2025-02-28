
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Calendar, FileText, Users, BookOpen } from "lucide-react";

interface DashboardStatsProps {
  totalQuestions: number;
  totalRencontres: number;
  questionsEnAttente: number;
  rencontresEnAttente: number;
  totalInitiatives: number;
  totalActualites: number;
}

const DashboardStats = ({ 
  totalQuestions, 
  totalRencontres, 
  questionsEnAttente, 
  rencontresEnAttente,
  totalInitiatives,
  totalActualites
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Questions Écrites
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <p className="text-xs text-muted-foreground">
            {questionsEnAttente} en attente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Demandes de rencontre
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRencontres}</div>
          <p className="text-xs text-muted-foreground">
            {rencontresEnAttente} en attente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Initiatives Parlementaires
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInitiatives}</div>
          <p className="text-xs text-muted-foreground">
            Interventions parlementaires
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Actualités
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActualites}</div>
          <p className="text-xs text-muted-foreground">
            Publications
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
