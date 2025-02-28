
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log("Utilisateur non authentifié, redirection vers /auth");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="spinner h-12 w-12 border-4 border-t-assembly-blue rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Chargement...</p>
      </div>
    </div>;
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
