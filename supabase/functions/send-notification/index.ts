
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  type: "doleance" | "audience";
  id: string;
  newStatus: string;
  adminEmail: string;
  replyToEmail: string;
  response?: string;
}

// Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: RequestBody = await req.json();
    console.log("Traitement de la notification:", requestBody);

    if (!requestBody.type || !requestBody.id || !requestBody.newStatus) {
      console.error("Données requises manquantes dans la requête");
      throw new Error("Les champs type, id et newStatus sont requis");
    }

    // Préparer les données pour l'email en fonction du type
    let emailData = null;
    let userEmail = "";
    const deputyName = "Guy Marius Sagna";
    const deputyLocation = "Ziguinchor";

    // Récupérer les données nécessaires en fonction du type de notification
    if (requestBody.type === "doleance") {
      console.log("Récupération des données de la doléance:", requestBody.id);
      const { data: doleance, error } = await supabase
        .from("doleances")
        .select("*")
        .eq("id", requestBody.id)
        .single();

      if (error || !doleance) {
        console.error("Erreur lors de la récupération de la doléance:", error);
        throw new Error("Erreur lors de la récupération de la doléance: " + (error?.message || "Données non trouvées"));
      }

      console.log("Doléance récupérée:", doleance);
      userEmail = doleance.email;

      // Définir le contenu de l'email en fonction du statut
      const statusMappings = {
        submitted: "soumise et est en attente d'examen",
        in_progress: "en cours de traitement",
        completed: "traitée",
        rejected: "rejetée",
      };

      const statusFrench = statusMappings[requestBody.newStatus as keyof typeof statusMappings] || requestBody.newStatus;

      emailData = {
        subject: `Mise à jour de votre question écrite - ${doleance.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #006400;">Mise à jour de votre question écrite</h2>
            </div>
            
            <p>Cher/Chère <strong>${doleance.name}</strong>,</p>
            
            <p>Le député <strong>${deputyName}</strong> vous informe que votre question écrite intitulée "<strong>${doleance.title}</strong>" a été <strong>${statusFrench}</strong>.</p>
            
            ${requestBody.response ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
              <h3 style="margin-top: 0;">Réponse du député :</h3>
              <p>${requestBody.response.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            <p>Vous pouvez suivre l'évolution de votre question sur notre plateforme.</p>
            
            <p>Bien cordialement,</p>
            <p><strong>Bureau du député ${deputyName}</strong><br>
            ${deputyLocation}</p>
          </div>
        `,
      };
    } else if (requestBody.type === "audience") {
      console.log("Récupération des données de l'audience:", requestBody.id);
      const { data: audience, error } = await supabase
        .from("audiences")
        .select("*")
        .eq("id", requestBody.id)
        .single();

      if (error || !audience) {
        console.error("Erreur lors de la récupération de l'audience:", error);
        throw new Error("Erreur lors de la récupération de audience: " + (error?.message || "Données non trouvées"));
      }

      console.log("Audience récupérée:", audience);
      userEmail = audience.email;

      // Définir le statut en français
      const statusMappings = {
        pending: "en attente d'examen",
        approved: "approuvée",
        rejected: "rejetée",
        completed: "terminée",
      };

      const statusFrench = statusMappings[requestBody.newStatus as keyof typeof statusMappings] || requestBody.newStatus;

      // Formater la date si elle existe
      let meetingDateFormatted = "";
      if (audience.meeting_date) {
        const meetingDate = new Date(audience.meeting_date);
        meetingDateFormatted = meetingDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      // Construire le contenu de l'email en fonction du statut
      let statusSpecificContent = "";
      if (requestBody.newStatus === "approved") {
        statusSpecificContent = `
          <p>Nous sommes heureux de vous informer que votre demande d'audience avec le député <strong>${deputyName}</strong> a été <strong>approuvée</strong>.</p>
          ${meetingDateFormatted ? `
          <div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0066cc;">Détails du rendez-vous :</h3>
            <p><strong>Date et heure :</strong> ${meetingDateFormatted}</p>
            <p><strong>Lieu :</strong> Bureau du député à ${deputyLocation}</p>
          </div>
          ` : ''}
        `;
      } else if (requestBody.newStatus === "rejected") {
        statusSpecificContent = `
          <p>Nous regrettons de vous informer que votre demande d'audience avec le député <strong>${deputyName}</strong> a été <strong>rejetée</strong>.</p>
          <p>Le député reçoit de nombreuses demandes et ne peut malheureusement pas répondre favorablement à toutes.</p>
        `;
      } else {
        statusSpecificContent = `
          <p>Nous vous informons que votre demande d'audience avec le député <strong>${deputyName}</strong> est actuellement <strong>${statusFrench}</strong>.</p>
        `;
      }

      emailData = {
        subject: `Mise à jour de votre demande d'audience - ${audience.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #006400;">Mise à jour de votre demande d'audience</h2>
            </div>
            
            <p>Cher/Chère <strong>${audience.name}</strong>,</p>
            
            ${statusSpecificContent}
            
            ${requestBody.response ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message du bureau du député :</h3>
              <p>${requestBody.response.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            <p>Pour toute question supplémentaire, n'hésitez pas à nous contacter.</p>
            
            <p>Bien cordialement,</p>
            <p><strong>Bureau du député ${deputyName}</strong><br>
            ${deputyLocation}</p>
          </div>
        `,
      };
    } else {
      throw new Error(`Type de notification non pris en charge: ${requestBody.type}`);
    }

    if (!emailData) {
      throw new Error("Impossible de générer les données de l'email");
    }

    // Envoyer l'email via l'API de Resend
    console.log("Envoi de l'email à:", userEmail);
    
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("Clé API Resend non configurée");
    }

    // Conversion du corps du message en payload pour l'API Resend
    const emailPayload = {
      from: `Député Guy Marius Sagna <${requestBody.adminEmail}>`,
      to: userEmail,
      reply_to: requestBody.replyToEmail, // Adresse de réponse
      subject: emailData.subject,
      html: emailData.html,
    };

    console.log("Préparation de l'envoi d'email avec payload:", {
      to: emailPayload.to,
      subject: emailPayload.subject,
      from: emailPayload.from,
      reply_to: emailPayload.reply_to,
    });

    // Appel à l'API Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();
    console.log("Réponse de l'API Resend:", resendData);

    if (!resendResponse.ok) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${JSON.stringify(resendData)}`);
    }

    // Retourner la réponse
    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification envoyée avec succès",
        emailSent: true,
        emailId: resendData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erreur dans la fonction send-notification:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Une erreur s'est produite",
        error: error.stack || String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
