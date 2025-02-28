
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoleanceForm from "@/components/doleances/DoleanceForm";
import DoleanceCard from "@/components/doleances/DoleanceCard";

const QuestionEcritePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 mt-16">
        <DoleanceCard 
          title="Soumettre une question écrite"
          description="Posez votre question à l'Assemblée nationale. Nous vous répondrons dans les meilleurs délais."
        >
          <DoleanceForm />
        </DoleanceCard>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionEcritePage;
