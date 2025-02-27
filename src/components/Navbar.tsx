
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

          <div className="hidden md:block">
            <Button
              variant="default"
              className="bg-senegal-green hover:bg-senegal-green/90 text-white"
              asChild
            >
              <Link to="/audience">Demander une rencontre</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
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
            <div className="px-3 py-2">
              <Button
                variant="default"
                className="w-full bg-senegal-green hover:bg-senegal-green/90 text-white"
                asChild
              >
                <Link to="/audience">Demander une rencontre</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

