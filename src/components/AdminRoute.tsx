
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
        console.log("No user found, redirecting to auth page");
        navigate("/auth");
        return;
      }

      try {
        // Check if the email is in the admin list
        const adminEmails = ['mniane6426@gmail.com', 'nianemouhamed100@gmail.com'];
        
        console.log("Current user email:", user.email);
        
        if (user.email && adminEmails.includes(user.email)) {
          console.log("Admin email confirmed:", user.email);
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // If not an admin email, check with RPC function
        console.log("Checking admin status for user ID:", user.id);
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });

        if (error) {
          console.error('Admin verification error:', error);
          setCheckingAdmin(false);
          navigate("/");
          return;
        }

        console.log("Admin verification result:", data);

        if (!data) {
          console.log("User is not an administrator");
          setCheckingAdmin(false);
          navigate("/");
          return;
        }

        console.log("User confirmed as administrator");
        setIsAdmin(true);
        setCheckingAdmin(false);
      } catch (error) {
        console.error('Error during admin verification:', error);
        setCheckingAdmin(false);
        navigate("/");
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
