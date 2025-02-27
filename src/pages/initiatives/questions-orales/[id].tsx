import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MessageSquare, Calendar, User, Video } from "lucide-react";
import Footer from "@/components/Footer";

const QuestionOraleDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container-custom py-12 mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-assembly-blue p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              Interpellation sur l'accès à l'eau potable
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Session du 10 Février 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Guy Marius Sagna</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Intervention parlementaire"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <h2 className="text-xl font-bold text-assembly-blue mb-4">Transcription</h2>
              <p className="text-gray-600 mb-6">
                "Monsieur le Ministre,
                <br /><br />
                La question de l'accès à l'eau potable reste cruciale dans plusieurs régions de notre pays. Les populations font face quotidiennement à des difficultés d'approvisionnement...
                [Suite de la transcription]"
              </p>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  Vidéo disponible
                </span>
                <div className="flex gap-2">
                  <button className="text-assembly-blue hover:underline text-sm">
                    Partager
                  </button>
                  <button className="text-assembly-blue hover:underline text-sm">
                    Télécharger la transcription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionOraleDetailPage;
