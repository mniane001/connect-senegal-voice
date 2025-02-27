
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, MessageSquare, Calendar, BarChart } from "lucide-react";

const DashboardPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");

  // Récupérer les doléances
  const { data: doleances, isLoading: loadingDoleances } = useQuery({
    queryKey: ["doleances", statusFilter, themeFilter],
    queryFn: async () => {
      let query = supabase
        .from("doleances")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (themeFilter !== "all") {
        query = query.eq("theme", themeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Récupérer les demandes d'audience
  const { data: audiences, isLoading: loadingAudiences } = useQuery({
    queryKey: ["audiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audiences")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Calculer les statistiques
  const stats = {
    totalDoleances: doleances?.length || 0,
    totalAudiences: audiences?.length || 0,
    doleancesEnAttente: doleances?.filter(d => d.status === "submitted").length || 0,
    audiencesEnAttente: audiences?.filter(a => a.status === "pending").length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord administratif</h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Doléances
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDoleances}</div>
              <p className="text-xs text-muted-foreground">
                {stats.doleancesEnAttente} en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Demandes d'audience
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAudiences}</div>
              <p className="text-xs text-muted-foreground">
                {stats.audiencesEnAttente} en attente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Statut</SelectLabel>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={themeFilter} onValueChange={setThemeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Thème</SelectLabel>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="education">Éducation</SelectItem>
                <SelectItem value="sante">Santé</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="economie">Économie</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Table des doléances */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Doléances récentes</CardTitle>
            <CardDescription>
              Liste des doléances soumises par les citoyens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Thème</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doleances?.map((doleance) => (
                  <TableRow key={doleance.id}>
                    <TableCell>
                      {new Date(doleance.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{doleance.name}</TableCell>
                    <TableCell>{doleance.theme || "Non catégorisé"}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          doleance.status === "submitted"
                            ? "bg-yellow-100 text-yellow-800"
                            : doleance.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                        {doleance.status === "submitted"
                          ? "Soumis"
                          : doleance.status === "in_progress"
                          ? "En cours"
                          : "Complété"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Table des audiences */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes d'audience</CardTitle>
            <CardDescription>
              Liste des demandes de rencontre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audiences?.map((audience) => (
                  <TableRow key={audience.id}>
                    <TableCell>
                      {new Date(audience.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{audience.name}</TableCell>
                    <TableCell>{audience.subject}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          audience.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : audience.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {audience.status === "pending"
                          ? "En attente"
                          : audience.status === "approved"
                          ? "Approuvé"
                          : "Refusé"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
