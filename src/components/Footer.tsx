
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-assembly-blue text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-assembly-gold">Guy Marius Sagna</h3>
            <p className="text-gray-300 mb-4">
              Député à l'Assemblée nationale du Sénégal, engagé pour la justice sociale et le développement équitable.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-assembly-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-assembly-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-assembly-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-assembly-gold transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-assembly-gold">Liens Rapides</h3>
            <ul className="space-y-2">
              {[
                { text: "Accueil", href: "/" },
                { text: "Biographie", href: "/biographie" },
                { text: "Initiatives parlementaires", href: "/initiatives" },
                { text: "Actualités", href: "/actualites" },
                { text: "Soumettre une doléance", href: "/doleances" },
                { text: "Demander une audience", href: "/audience" },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-gray-300 hover:text-assembly-gold transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-assembly-gold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-assembly-gold" />
                <span>Assemblée nationale du Sénégal, Place Soweto, Dakar</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-assembly-gold" />
                <span>+221 XX XXX XX XX</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-assembly-gold" />
                <span>contact@guymarissagna.sn</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-assembly-gold">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Inscrivez-vous pour recevoir les dernières actualités et mises à jour.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-assembly-gold focus:border-transparent"
                required
              />
              <Button 
                type="submit"
                className="w-full bg-assembly-gold text-assembly-blue hover:bg-assembly-gold/90 transition-colors font-medium"
              >
                S'inscrire
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 text-center text-gray-400">
          <p>© {currentYear} Guy Marius Sagna. Tous droits réservés.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/politique-confidentialite" className="hover:text-assembly-gold transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/conditions-utilisation" className="hover:text-assembly-gold transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
      <div className="flex h-2">
        <div className="w-1/3 bg-senegal-green"></div>
        <div className="w-1/3 bg-senegal-yellow"></div>
        <div className="w-1/3 bg-senegal-red"></div>
      </div>
    </footer>
  );
};

export default Footer;
