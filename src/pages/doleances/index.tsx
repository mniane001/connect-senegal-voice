
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoleanceForm from "@/components/doleances/DoleanceForm";
import DoleanceCard from "@/components/doleances/DoleanceCard";
import { sendSubmissionConfirmationEmail } from "@/services/emailService";

// Configuration pour l'envoi d'emails de confirmation
export const sendDoleanceConfirmationEmail = async (name: string, email: string) => {
  try {
    const result = await sendSubmissionConfirmationEmail({
      type: 'doleance',
      recipientEmail: email, // Email de l'utilisateur qui a soumis le formulaire
      recipientName: name,   // Nom de l'utilisateur
      replyTo: "nianemouhamed001@gmail.com",
      fromName: "Guy Marius SAGNA"
    });
    
    if (!result.success) {
      console.warn("L'email de confirmation de doléance n'a pas pu être envoyé:", result.error);
      return false;
    }
    
    console.log("Email de confirmation de doléance envoyé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation de doléance:", error);
    return false;
  }
};

const QuestionEcritePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 mt-16">
        <DoleanceCard 
          title="Soumettre une question écrite"
          description="Posez votre question à l'Assemblée nationale. Nous vous répondrons dans les meilleurs délais."
        >
          <DoleanceForm onSubmitSuccess={sendDoleanceConfirmationEmail} />
        </DoleanceCard>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionEcritePage;
