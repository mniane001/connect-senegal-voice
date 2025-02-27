
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .rpc('is_admin', { user_id: user.id });
          
          if (error) {
            console.error('Erreur de vérification admin:', error);
            return;
          }
          setIsAdmin(!!data);
        } catch (error) {
          console.error('Erreur lors de la vérification admin:', error);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const menuItems = [
    { title: "Biographie", href: "/biographie" },
    { title: "Actualités", href: "/actualites" },
    { title: "Initiatives parlementaires", href: "/initiatives" },
    { title: "Soumettre une question écrite", href: "/doleances" },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-display font-bold text-senegal-green">
              GMS
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-gray-700 hover:text-senegal-green transition-colors duration-200"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex space-x-4">
            <Button
              variant="default"
              className="bg-senegal-green hover:bg-senegal-green/90 text-white"
              asChild
            >
              <Link to="/audience">Demander une rencontre</Link>
            </Button>

            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="border-assembly-blue text-assembly-blue hover:bg-assembly-blue/10"
                    asChild
                  >
                    <Link to="/admin/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-gray-600"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsAdmin(false);
                  }}
                >
                  <UserCircle className="mr-2 h-5 w-5" />
                  Se déconnecter
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="border-assembly-blue text-assembly-blue hover:bg-assembly-blue/10"
                asChild
              >
                <Link to="/auth">
                  <UserCircle className="mr-2 h-5 w-5" />
                  Se connecter
                </Link>
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu mobile */}
        {isOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 animate-fade-in">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-senegal-green transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <div className="px-3 py-2 space-y-2">
              <Button
                variant="default"
                className="w-full bg-senegal-green hover:bg-senegal-green/90 text-white"
                asChild
              >
                <Link to="/audience">Demander une rencontre</Link>
              </Button>

              {user ? (
                <>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue/10"
                      asChild
                    >
                      <Link to="/admin/dashboard">
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setIsAdmin(false);
                    }}
                  >
                    <UserCircle className="mr-2 h-5 w-5" />
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-assembly-blue text-assembly-blue hover:bg-assembly-blue/10"
                  asChild
                >
                  <Link to="/auth">
                    <UserCircle className="mr-2 h-5 w-5" />
                    Se connecter
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
