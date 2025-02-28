
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InitiativesFilterBar from "@/components/admin/initiatives/InitiativesFilterBar";
import InitiativesList, { Initiative } from "@/components/admin/initiatives/InitiativesList";
import InitiativeFormModal from "@/components/admin/initiatives/InitiativeFormModal";
import InitiativeDetailsModal from "@/components/admin/initiatives/InitiativeDetailsModal";
import DeleteInitiativeModal from "@/components/admin/initiatives/DeleteInitiativeModal";
import AdminRoute from "@/components/AdminRoute";
import BackButton from "@/components/BackButton";

const InitiativesAdminPage = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [legislatureFilter, setLegislatureFilter] = useState("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const queryClient = useQueryClient();

  const { data: initiatives, isLoading } = useQuery({
    queryKey: ["initiatives", typeFilter, legislatureFilter],
    queryFn: async () => {
      let query = supabase
        .from("initiatives")
        .select("*")
        .order("created_at", { ascending: false });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      if (legislatureFilter !== "all") {
        query = query.eq("legislature", legislatureFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Initiative[];
    },
  });

  const handleCreateInitiative = () => {
    setSelectedInitiative(null);
    setIsFormModalOpen(true);
  };

  const handleEditInitiative = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setIsFormModalOpen(true);
  };

  const handleViewInitiative = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteInitiative = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setIsDeleteModalOpen(true);
  };

  const handleSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ["initiatives"] });
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <BackButton to="/admin/dashboard" label="Retour au tableau de bord" />
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Gestion des initiatives parlementaires</h1>
          
          <InitiativesFilterBar
            typeFilter={typeFilter}
            legislatureFilter={legislatureFilter}
            onTypeChange={setTypeFilter}
            onLegislatureChange={setLegislatureFilter}
            onAddNew={handleCreateInitiative}
            addButtonLabel="Ajouter une initiative"
          />
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p>Chargement des initiatives...</p>
            </div>
          ) : (
            <InitiativesList
              initiatives={initiatives || []}
              onView={handleViewInitiative}
              onEdit={handleEditInitiative}
              onDelete={handleDeleteInitiative}
            />
          )}
          
          <InitiativeFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            initiative={selectedInitiative || undefined}
            onSuccess={handleSuccessAction}
          />
          
          <InitiativeDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            initiative={selectedInitiative}
          />
          
          <DeleteInitiativeModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            initiative={selectedInitiative}
            onSuccess={handleSuccessAction}
          />
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default InitiativesAdminPage;
