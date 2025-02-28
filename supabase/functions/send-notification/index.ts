
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface EmailPayload {
  type: "doleance" | "audience";
  id: string;
  newStatus: string;
  adminEmail?: string;
  replyToEmail?: string;
  response?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  try {
    const requestData: EmailPayload = await req.json();
    const { type, id, newStatus, adminEmail, replyToEmail, response } = requestData;
    
    console.log("Données de la requête:", requestData);
    
    // Récupérer les détails de la doléance ou audience
    const { data: itemData, error: itemError } = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/${type === "doleance" ? "doleances" : "audiences"}?id=eq.${id}&select=*`,
      {
        headers: {
          "Content-Type": "application/json",
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
        }
      }
    ).then(res => res.json());
    
    if (itemError || !itemData || itemData.length === 0) {
      console.error(`Erreur lors de la récupération de ${type}:`, itemError);
      throw new Error(`Erreur lors de la récupération de ${type}: ${itemError?.message || "Données non trouvées"}`);
    }
    
    const item = itemData[0];
    console.log(`${type} récupéré:`, item);
    
    // Préparer le contenu de l'email en fonction du type et du statut
    let emailSubject = "";
    let emailHtml = "";
    
    // Pour le test, nous envoyons toujours à l'adresse vérifiée
    // En production, il faudra vérifier un domaine dans Resend
    const recipientEmail = "nianemouhamed100@gmail.com"; // Utilisation de l'adresse vérifiée
    
    const getStatusLabel = (status: string) => {
      switch (status) {
        case "submitted": return "Soumise";
        case "in_progress": return "En cours de traitement";
        case "completed": return "Complétée";
        case "rejected": return "Rejetée";
        case "pending": return "En attente";
        case "approved": return "Approuvée";
        default: return status;
      }
    };
    
    if (type === "doleance") {
      emailSubject = `Mise à jour de votre question - ${item.title}`;
      emailHtml = `
        <h1>Mise à jour de votre question</h1>
        <p>Bonjour ${item.name},</p>
        <p>Votre question "${item.title}" a été mise à jour avec le statut: <strong>${getStatusLabel(newStatus)}</strong>.</p>
        ${response ? `<p><strong>Réponse:</strong></p><p>${response}</p>` : ""}
        <p>Si vous avez des questions supplémentaires, n'hésitez pas à nous contacter en répondant directement à cet email.</p>
        <p>Cordialement,<br>L'administration de Guédiawaye</p>
      `;
    } else if (type === "audience") {
      emailSubject = `Mise à jour de votre demande d'audience - ${item.subject}`;
      
      let meetingInfo = "";
      if (newStatus === "approved" && item.meeting_date) {
        const meetingDate = new Date(item.meeting_date);
        meetingInfo = `
          <p>Nous avons le plaisir de vous informer que votre audience a été programmée pour le:</p>
          <p><strong>${meetingDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></p>
        `;
      }
      
      emailHtml = `
        <h1>Mise à jour de votre demande d'audience</h1>
        <p>Bonjour ${item.name},</p>
        <p>Votre demande d'audience concernant "${item.subject}" a été mise à jour avec le statut: <strong>${getStatusLabel(newStatus)}</strong>.</p>
        ${meetingInfo}
        ${response ? `<p><strong>Message:</strong></p><p>${response}</p>` : ""}
        <p>Si vous avez des questions, n'hésitez pas à nous contacter en répondant directement à cet email.</p>
        <p>Cordialement,<br>L'administration de Guédiawaye</p>
      `;
    }
    
    // Configurer l'adresse de réponse (Reply-To)
    const userReplyTo = replyToEmail || "nianemouhamed100@gmail.com"; // Utiliser l'adresse vérifiée
    
    // Envoyer l'email avec les options Resend conformes à la restriction de test
    const emailOptions = {
      from: "onboarding@resend.dev", // Utilisation de l'adresse par défaut de Resend pour les tests
      to: [recipientEmail], // Toujours envoyer à l'adresse vérifiée en test
      subject: emailSubject,
      html: emailHtml,
      reply_to: userReplyTo,
    };
    
    console.log("Envoi de l'email avec options:", emailOptions);
    
    const { data: emailData, error: emailError } = await resend.emails.send(emailOptions);
    
    if (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      throw emailError;
    }
    
    console.log("Email envoyé avec succès:", emailData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification envoyée avec succès à ${recipientEmail}`,
        data: emailData
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Erreur dans la fonction send-notification:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Une erreur s'est produite lors de l'envoi de la notification",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
