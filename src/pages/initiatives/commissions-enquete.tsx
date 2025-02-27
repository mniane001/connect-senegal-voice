
import Navbar from "@/components/Navbar";
import { Users } from "lucide-react";

const CommissionsEnquetePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 md:py-32" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url("https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`
        }}
      >
        <div className="container-custom text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Commissions d'Enquête
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Initiatives pour la création de commissions d'investigation parlementaire
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="space-y-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="card-official p-6">
              <div className="flex items-start">
                <div className="bg-assembly-blue/10 p-3 rounded-full mr-4">
                  <Users className="text-assembly-blue h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-assembly-blue mb-2">
                    Commission sur la gestion des ressources minières
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Proposition de création d'une commission d'enquête sur la gestion des ressources...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">5 Janvier 2024</span>
                    <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      En cours d'examen
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommissionsEnquetePage;
