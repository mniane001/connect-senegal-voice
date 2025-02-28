
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AudiencePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Soumission d'une demande d'audience avec les données:", {
        name,
        email,
        phone,
        subject,
        message,
        status: "pending"
      });

      // Using RPC instead of direct table insert to bypass RLS
      const { error, data } = await supabase.rpc('submit_audience_request', {
        p_name: name,
        p_email: email,
        p_phone: phone,
        p_subject: subject,
        p_message: message
      });

      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }

      console.log("Demande d'audience soumise avec succès:", data);

      toast({
        title: "Demande d'audience envoyée",
        description: "Nous vous contacterons pour confirmer la date et l'heure",
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission de votre demande",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Mic className="mx-auto h-12 w-12 text-senegal-green" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Demander une audience
            </h1>
            <p className="mt-2 text-gray-600">
              Rencontrez votre député pour discuter de vos préoccupations
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Téléphone (optionnel)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Sujet de l'audience
                </label>
                <Input
                  id="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message détaillé
                </label>
                <Textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 h-32"
                  placeholder="Veuillez expliquer en détail l'objet de votre demande d'audience..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Demander une audience"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AudiencePage;
