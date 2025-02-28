
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

      // Vérifier d'abord si l'email est dans la liste des administrateurs
      const adminEmails = ['mniane6426@gmail.com', 'nianemouhamed100@gmail.com'];
      if (adminEmails.includes(user.email || '')) {
        setIsAdmin(true);
        setCheckingAdmin(false);
        return;
      }

      // Si ce n'est pas un email admin, vérifier avec la fonction RPC
      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });

        if (error) {
          console.error('Erreur de vérification admin:', error);
          navigate("/");
          return;
        }

        if (!data) {
          navigate("/");
          return;
        }

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
    return <div>Chargement...</div>;
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminRoute;
