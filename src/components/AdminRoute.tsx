
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // Vérifier d'abord si l'email est dans la liste des administrateurs
        const adminEmails = ['mniane6426@gmail.com', 'nianemouhamed100@gmail.com'];
        if (user.email && adminEmails.includes(user.email)) {
          console.log("Admin email confirmé:", user.email);
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // Si ce n'est pas un email admin, vérifier avec la fonction RPC
        console.log("Vérification du statut d'administrateur pour:", user.id);
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });

        if (error) {
          console.error('Erreur de vérification admin:', error);
          navigate("/");
          return;
        }

        console.log("Résultat de la vérification admin:", data);

        if (!data) {
          console.log("L'utilisateur n'est pas administrateur");
          navigate("/");
          return;
        }

        console.log("Utilisateur confirmé comme administrateur");
        setIsAdmin(true);
      } catch (error) {
        console.error('Erreur lors de la vérification admin:', error);
        navigate("/");
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  if (loading || checkingAdmin) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="spinner h-12 w-12 border-4 border-t-assembly-blue rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Vérification des droits administrateur...</p>
      </div>
    </div>;
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminRoute;
