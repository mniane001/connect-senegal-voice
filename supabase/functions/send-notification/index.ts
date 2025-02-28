
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "doleance" | "audience"; // Type de notification
  id: string; // ID de la doleance ou audience
  newStatus: string; // Nouveau statut
}

// Check if RESEND_API_KEY is available
const resendApiKey = Deno.env.get("RESEND_API_KEY");
let resend: Resend | null = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.error("RESEND_API_KEY is not set in environment variables");
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: Request): Promise<Response> => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération des données de la requête
    const { type, id, newStatus }: NotificationRequest = await req.json();
    console.log(`Traitement de notification pour ${type} avec ID: ${id}, nouveau statut: ${newStatus}`);

    // Si la clé Resend n'est pas configurée, retourner une erreur appropriée
    if (!resend) {
      console.error("Impossible d'envoyer des emails: RESEND_API_KEY n'est pas configurée");
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: "RESEND_API_KEY n'est pas configurée" }
        }),
        {
          status: 200, // On retourne 200 pour permettre à l'UI de gérer l'erreur
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Variables qui seront définies selon le type
    let email = "";
    let name = "";
    let subject = "";
    let htmlContent = "";

    // Récupération des détails selon le type
    if (type === "doleance") {
      const { data: doleance, error: doleanceError } = await supabase
        .from("doleances")
        .select("email, name, title, response")
        .eq("id", id)
        .single();

      if (doleanceError) {
        console.error("Erreur lors de la récupération de la doléance:", doleanceError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { message: "Erreur lors de la récupération de la doléance", details: doleanceError } 
          }),
          { 
            status: 200, // On retourne 200 même en cas d'erreur pour que l'UI puisse gérer l'erreur
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      email = doleance.email;
      name = doleance.name;
      
      // Construction du sujet et du contenu selon le statut
      let statusText = "";
      switch (newStatus) {
        case "in_progress":
          statusText = "est en cours de traitement";
          break;
        case "completed":
          statusText = "a été traitée";
          break;
        case "rejected":
          statusText = "a été rejetée";
          break;
        default:
          statusText = "a été mise à jour";
      }
      
      subject = `Mise à jour de votre question citoyenne: "${doleance.title}"`;
      
      htmlContent = `
        <h1>Bonjour ${name},</h1>
        <p>Votre question citoyenne "${doleance.title}" ${statusText}.</p>
        ${doleance.response ? `<p><strong>Réponse:</strong> ${doleance.response}</p>` : ''}
        <p>Vous pouvez suivre l'évolution de votre question sur notre plateforme.</p>
        <p>Cordialement,<br>Le cabinet parlementaire</p>
      `;
      
    } else if (type === "audience") {
      const { data: audience, error: audienceError } = await supabase
        .from("audiences")
        .select("email, name, subject, response, meeting_date")
        .eq("id", id)
        .single();

      if (audienceError) {
        console.error("Erreur lors de la récupération de l'audience:", audienceError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: { message: "Erreur lors de la récupération de l'audience", details: audienceError } 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      email = audience.email;
      name = audience.name;

      // Construction du sujet et du contenu selon le statut
      let statusText = "";
      let additionalInfo = "";
      
      switch (newStatus) {
        case "approved":
          statusText = "a été approuvée";
          if (audience.meeting_date) {
            const date = new Date(audience.meeting_date);
            additionalInfo = `<p>Un rendez-vous a été programmé pour le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}.</p>`;
          }
          break;
        case "rejected":
          statusText = "a été rejetée";
          break;
        case "completed":
          statusText = "a été marquée comme complétée";
          break;
        default:
          statusText = "a été mise à jour";
      }
      
      subject = `Mise à jour de votre demande d'audience: "${audience.subject}"`;
      
      htmlContent = `
        <h1>Bonjour ${name},</h1>
        <p>Votre demande d'audience "${audience.subject}" ${statusText}.</p>
        ${additionalInfo}
        ${audience.response ? `<p><strong>Message:</strong> ${audience.response}</p>` : ''}
        <p>Cordialement,<br>Le cabinet parlementaire</p>
      `;
    } else {
      console.error("Type de notification non reconnu:", type);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: { message: "Type de notification non reconnu" } 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Envoi réel d'email avec Resend
    try {
      console.log("Envoi d'email à:", email);
      
      const emailResponse = await resend.emails.send({
        from: "Cabinet Parlementaire <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: htmlContent
      });

      console.log("Email envoyé avec succès:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, data: emailResponse }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      
      // Retourner une réponse avec l'erreur
      return new Response(
        JSON.stringify({ 
          success: false,
          error: emailError 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

  } catch (error) {
    console.error("Erreur générale dans la fonction send-notification:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: { message: "Erreur interne", details: error } 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);
