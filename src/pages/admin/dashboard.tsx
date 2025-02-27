
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Users, MessageSquare, Calendar } from "lucide-react";

interface Question {
  id: string;
  created_at: string;
  name: string;
  email: string;
  category: string;
  status: string;
  title: string;
  description: string;
}

interface Rencontre {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  meeting_date?: string;
}

const DashboardPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedRencontre, setSelectedRencontre] = useState<Rencontre | null>(null);

  // Récupérer les questions écrites
  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ["questions", statusFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("doleances")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Question[];
    },
  });

  // Récupérer les demandes de rencontre
  const { data: rencontres, isLoading: loadingRencontres } = useQuery({
    queryKey: ["rencontres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audiences")
        .select("*");
      if (error) throw error;
      return data as Rencontre[];
    },
  });

  // Calculer les statistiques
  const stats = {
    totalQuestions: questions?.length || 0,
    totalRencontres: rencontres?.length || 0,
    questionsEnAttente: questions?.filter(d => d.status === "submitted").length || 0,
    rencontresEnAttente: rencontres?.filter(a => a.status === "pending").length || 0,
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
                Total Questions Écrites
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.questionsEnAttente} en attente
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
              <div className="text-2xl font-bold">{stats.totalRencontres}</div>
              <p className="text-xs text-muted-foreground">
                {stats.rencontresEnAttente} en attente
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

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Catégorie</SelectLabel>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="education">Éducation</SelectItem>
                <SelectItem value="sante">Santé</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="economie">Économie</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Table des questions écrites */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Questions écrites récentes</CardTitle>
            <CardDescription>
              Liste des questions écrites soumises par les citoyens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions?.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      {new Date(question.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{question.name}</TableCell>
                    <TableCell>{question.category || "Non catégorisé"}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          question.status === "submitted"
                            ? "bg-yellow-100 text-yellow-800"
                            : question.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                        {question.status === "submitted"
                          ? "Soumis"
                          : question.status === "in_progress"
                          ? "En cours"
                          : "Complété"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Table des rencontres */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes de rencontre</CardTitle>
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
                {rencontres?.map((rencontre) => (
                  <TableRow key={rencontre.id}>
                    <TableCell>
                      {new Date(rencontre.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{rencontre.name}</TableCell>
                    <TableCell>{rencontre.subject}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          rencontre.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : rencontre.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {rencontre.status === "pending"
                          ? "En attente"
                          : rencontre.status === "approved"
                          ? "Approuvé"
                          : "Refusé"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRencontre(rencontre)}
                      >
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal pour les détails d'une question */}
        <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedQuestion?.title}</DialogTitle>
              <DialogDescription className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="font-semibold">Soumis par</p>
                    <p>{selectedQuestion?.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>{selectedQuestion?.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Catégorie</p>
                    <p>{selectedQuestion?.category}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Date de soumission</p>
                    <p>{selectedQuestion?.created_at && new Date(selectedQuestion.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Description</p>
                  <p className="mt-2 whitespace-pre-wrap">{selectedQuestion?.description}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Modal pour les détails d'une rencontre */}
        <Dialog open={!!selectedRencontre} onOpenChange={() => setSelectedRencontre(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Demande de rencontre : {selectedRencontre?.subject}</DialogTitle>
              <DialogDescription className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="font-semibold">Demandé par</p>
                    <p>{selectedRencontre?.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>{selectedRencontre?.email}</p>
                  </div>
                  {selectedRencontre?.phone && (
                    <div>
                      <p className="font-semibold">Téléphone</p>
                      <p>{selectedRencontre.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">Date de la demande</p>
                    <p>{selectedRencontre?.created_at && new Date(selectedRencontre.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedRencontre?.meeting_date && (
                    <div>
                      <p className="font-semibold">Date de rencontre proposée</p>
                      <p>{new Date(selectedRencontre.meeting_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">Message</p>
                  <p className="mt-2 whitespace-pre-wrap">{selectedRencontre?.message}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
