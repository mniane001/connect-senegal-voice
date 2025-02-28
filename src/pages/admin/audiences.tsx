
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RencontreFilters from "@/components/admin/RencontreFilters";
import RencontreList from "@/components/admin/RencontreList";
import RencontreDetailsModal from "@/components/admin/RencontreDetailsModal";
import BackButton from "@/components/BackButton";

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

const AdminAudiencesPage = () => {
  const [rencontreStatusFilter, setRencontreStatusFilter] = useState<string>("all");
  const [selectedRencontre, setSelectedRencontre] = useState<Rencontre | null>(null);
  const queryClient = useQueryClient();

  const { data: rencontres } = useQuery({
    queryKey: ["rencontres", rencontreStatusFilter],
    queryFn: async () => {
      let query = supabase
        .from("audiences")
        .select("*");

      if (rencontreStatusFilter !== "all") {
        query = query.eq("status", rencontreStatusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Rencontre[];
    },
  });

  const handleRencontreStatusUpdate = async (rencontreId: string, newStatus: string) => {
    queryClient.setQueryData(["rencontres", rencontreStatusFilter], (oldData: Rencontre[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.map(rencontre => 
        rencontre.id === rencontreId 
          ? { ...rencontre, status: newStatus }
          : rencontre
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/admin/dashboard" label="Retour au tableau de bord" />
        </div>

        <h1 className="text-3xl font-bold mb-8">Demandes d'audience</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Demandes de rencontre</h2>
          <RencontreFilters
            statusFilter={rencontreStatusFilter}
            onStatusChange={setRencontreStatusFilter}
          />

          <RencontreList 
            rencontres={rencontres || []} 
            onViewDetails={setSelectedRencontre}
            onStatusUpdate={handleRencontreStatusUpdate}
          />
        </div>

        <RencontreDetailsModal
          rencontre={selectedRencontre}
          onClose={() => setSelectedRencontre(null)}
          onStatusUpdate={handleRencontreStatusUpdate}
        />
      </div>

      <Footer />
    </div>
  );
};

export default AdminAudiencesPage;
