
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user.id });

      if (error || !data) {
        console.error('Erreur de vérification admin:', error);
        navigate("/");
        return;
      }

      if (!data) {
        navigate("/");
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
};

export default AdminRoute;
