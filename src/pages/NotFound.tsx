import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page non trouvée</h1>
        <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas.</p>
        <Link to="/" className="bg-assembly-blue hover:bg-assembly-blue/80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Retour à l'accueil
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
