
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

// Utiliser le nom correct du secret "gmsagna key" au lieu de "RESEND_API_KEY"
const resendApiKey = Deno.env.get("gmsagna key");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "audience" | "doleance";
  id: string;
  newStatus: string;
}

const translateStatus = (status: string): string => {
  switch (status) {
    case "pending":
      return "En attente";
    case "approved":
      return "Approuvée";
    case "rejected":
      return "Refusée";
    case "completed":
      return "Terminée";
    case "submitted":
      return "Soumise";
    case "in_progress":
      return "En cours de traitement";
    default:
      return status;
  }
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "Non définie";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Clé API Resend utilisée:", resendApiKey ? "Configurée" : "Non configurée");
    
    const { type, id, newStatus }: NotificationRequest = await req.json();
    console.log(`Notification demandée: ${type} ${id} avec statut ${newStatus}`);

    if (type === "audience") {
      // Récupérer les détails de la demande d'audience
      const { data: audience, error } = await supabase
        .from("audiences")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Erreur lors de la récupération de l'audience: ${error.message}`);
      }

      if (!audience) {
        throw new Error("Audience non trouvée");
      }

      console.log("Audience récupérée:", audience);

      // Préparer le contenu de l'email selon le statut
      let subject = `Mise à jour de votre demande d'audience - ${translateStatus(newStatus)}`;
      let html = `
        <h1>Mise à jour de votre demande d'audience</h1>
        <p>Bonjour ${audience.name},</p>
        <p>Nous vous informons que le statut de votre demande d'audience "${audience.subject}" a été mis à jour:</p>
        <p><strong>Nouveau statut:</strong> ${translateStatus(newStatus)}</p>
      `;

      // Ajouter des informations supplémentaires selon le statut
      if (newStatus === "approved") {
        html += `
          <p><strong>Date de rendez-vous:</strong> ${formatDate(audience.meeting_date)}</p>
          <p><strong>Message:</strong></p>
          <p>${audience.response || "Aucun message supplémentaire"}</p>
          <p>Nous vous invitons à vous présenter au bureau du député à l'heure convenue.</p>
        `;
      } else if (newStatus === "rejected") {
        html += `
          <p><strong>Motif:</strong></p>
          <p>${audience.response || "Aucun motif spécifié"}</p>
        `;
      } else if (newStatus === "completed") {
        html += `
          <p><strong>Résumé de la rencontre:</strong></p>
          <p>${audience.response || "Aucun résumé disponible"}</p>
        `;
      }

      html += `
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>Le bureau du député</p>
      `;

      console.log("Envoi d'email à:", audience.email);
      console.log("Contenu de l'email:", html);

      // Envoyer l'email
      const emailResponse = await resend.emails.send({
        from: "Bureau du Député <info@gmsagna.com>",
        to: [audience.email],
        subject: subject,
        html: html,
      });

      console.log("Email envoyé:", emailResponse);

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } else if (type === "doleance") {
      // Récupérer les détails de la question citoyenne
      const { data: doleance, error } = await supabase
        .from("doleances")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Erreur lors de la récupération de la doléance: ${error.message}`);
      }

      if (!doleance) {
        throw new Error("Doléance non trouvée");
      }

      console.log("Doléance récupérée:", doleance);

      // Préparer le contenu de l'email selon le statut
      let subject = `Mise à jour de votre question citoyenne - ${translateStatus(newStatus)}`;
      let html = `
        <h1>Mise à jour de votre question citoyenne</h1>
        <p>Bonjour ${doleance.name},</p>
        <p>Nous vous informons que le statut de votre question "${doleance.title}" a été mis à jour:</p>
        <p><strong>Nouveau statut:</strong> ${translateStatus(newStatus)}</p>
      `;

      // Ajouter des informations supplémentaires selon le statut
      if (newStatus === "completed") {
        html += `
          <p><strong>Réponse:</strong></p>
          <p>${doleance.response || "Aucune réponse disponible"}</p>
        `;
      } else if (newStatus === "in_progress") {
        html += `
          <p>Votre question est en cours de traitement. Nous reviendrons vers vous dès que possible.</p>
          <p>${doleance.response || ""}</p>
        `;
      } else if (newStatus === "rejected") {
        html += `
          <p><strong>Motif:</strong></p>
          <p>${doleance.response || "Aucun motif spécifié"}</p>
        `;
      }

      html += `
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>Le bureau du député</p>
      `;

      console.log("Envoi d'email à:", doleance.email);
      console.log("Contenu de l'email:", html);

      // Envoyer l'email
      const emailResponse = await resend.emails.send({
        from: "Bureau du Député <info@gmsagna.com>",
        to: [doleance.email],
        subject: subject,
        html: html,
      });

      console.log("Email envoyé:", emailResponse);

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "Type de notification non supporté" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erreur dans la fonction send-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
