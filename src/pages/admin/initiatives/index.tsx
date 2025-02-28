
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InitiativesFilterBar from "@/components/admin/initiatives/InitiativesFilterBar";
import InitiativesList, { Initiative } from "@/components/admin/initiatives/InitiativesList";
import BackButton from "@/components/BackButton";
import InitiativeDetailsModal from "@/components/admin/initiatives/InitiativeDetailsModal";
import DeleteInitiativeModal from "@/components/admin/initiatives/DeleteInitiativeModal";
import InitiativeFormModal from "@/components/admin/initiatives/InitiativeFormModal";
import { useToast } from "@/components/ui/use-toast";

const AdminInitiativesPage = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [legislatureFilter, setLegislatureFilter] = useState<string>("all");
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [initiativeToDelete, setInitiativeToDelete] = useState<Initiative | null>(null);
  const [initiativeToEdit, setInitiativeToEdit] = useState<Initiative | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: initiatives, refetch } = useQuery({
    queryKey: ["initiatives", typeFilter, legislatureFilter],
    queryFn: async () => {
      let query = supabase.from("initiatives").select("*");

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      if (legislatureFilter !== "all") {
        query = query.eq("legislature", legislatureFilter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as Initiative[];
    },
  });

  const handleDeleteInitiative = async (id: string) => {
    try {
      const { error } = await supabase.from("initiatives").delete().eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Initiative supprimée",
        description: "L'initiative a été supprimée avec succès",
      });
      
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'initiative",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/admin/dashboard" label="Retour au tableau de bord" />
        </div>

        <h1 className="text-3xl font-bold mb-6">Gestion des initiatives parlementaires</h1>
        
        <InitiativesFilterBar
          typeFilter={typeFilter}
          legislatureFilter={legislatureFilter}
          onTypeChange={setTypeFilter}
          onLegislatureChange={setLegislatureFilter}
          onAddNew={() => setIsCreateModalOpen(true)}
          addButtonLabel="Nouvelle initiative"
        />
        
        <InitiativesList
          initiatives={initiatives || []}
          onView={(initiative) => setSelectedInitiative(initiative)}
          onEdit={(initiative) => setInitiativeToEdit(initiative)}
          onDelete={(initiative) => setInitiativeToDelete(initiative)}
        />
        
        <InitiativeDetailsModal
          isOpen={!!selectedInitiative}
          initiative={selectedInitiative}
          onClose={() => setSelectedInitiative(null)}
        />
        
        <DeleteInitiativeModal
          initiative={initiativeToDelete}
          onClose={() => setInitiativeToDelete(null)}
          onSuccess={() => {
            if (initiativeToDelete) {
              handleDeleteInitiative(initiativeToDelete.id);
              setInitiativeToDelete(null);
            }
          }}
        />
        
        <InitiativeFormModal
          isOpen={!!initiativeToEdit}
          onClose={() => setInitiativeToEdit(null)}
          initiative={initiativeToEdit || undefined}
          onSuccess={() => {
            refetch();
            setInitiativeToEdit(null);
          }}
        />
        
        <InitiativeFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            refetch();
            setIsCreateModalOpen(false);
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AdminInitiativesPage;
