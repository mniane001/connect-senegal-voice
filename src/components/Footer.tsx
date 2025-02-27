
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-assembly-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne À propos */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-senegal-yellow">Guy Marius Sagna</h3>
            <p className="text-gray-300 mb-4">
              Député à l'Assemblée nationale du Sénégal, engagé pour la justice sociale et le développement équitable.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Youtube, href: "https://youtube.com" }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-senegal-yellow transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne Liens Rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-senegal-yellow">Liens Rapides</h3>
            <ul className="space-y-2">
              {[
                { text: "Accueil", href: "/" },
                { text: "Biographie", href: "/biographie" },
                { text: "Initiatives parlementaires", href: "/initiatives" },
                { text: "Actualités", href: "/actualites" },
                { text: "Soumettre une doléance", href: "/doleances" },
                { text: "Demander une audience", href: "/audience" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-senegal-yellow transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-senegal-yellow">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-senegal-yellow" />
                <span>Assemblée nationale du Sénégal, Place Soweto, Dakar</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-senegal-yellow" />
                <span>+221 XX XXX XX XX</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-senegal-yellow" />
                <span>contact@guymarissagna.sn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-white/20 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Guy Marius Sagna. Tous droits réservés.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/politique-confidentialite" className="hover:text-senegal-yellow transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/conditions-utilisation" className="hover:text-senegal-yellow transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bandes du drapeau sénégalais */}
      <div className="flex h-2">
        <div className="w-1/3 bg-senegal-green"></div>
        <div className="w-1/3 bg-senegal-yellow"></div>
        <div className="w-1/3 bg-senegal-red"></div>
      </div>
    </footer>
  );
};

export default Footer;
