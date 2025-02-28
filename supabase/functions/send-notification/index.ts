
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Configuration des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Configuration de l'instance Resend pour l'envoi d'email
const resend = Deno.env.get("RESEND_API_KEY") ? new Resend(Deno.env.get("RESEND_API_KEY")) : null;

// Interface pour la requête de notification
interface NotificationRequest {
  type: "doleance" | "audience"; // Type de notification
  id: string; // ID de la doleance ou audience
  newStatus: string; // Nouveau statut
  adminEmail?: string; // Email de l'administrateur à mettre en copie
  response?: string; // Contenu de la réponse
}

// Check if RESEND_API_KEY is available
if (!Deno.env.get("RESEND_API_KEY")) {
  console.error("RESEND_API_KEY is not available. Email sending is disabled.");
}

// Fonction principale pour le traitement des requêtes
const handler = async (req: Request): Promise<Response> => {
  // Gestion des requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  try {
    // Récupération des données de la requête
    const { type, id, newStatus, adminEmail, response }: NotificationRequest = await req.json();
    console.log(`Traitement de notification pour ${type} avec ID: ${id}, nouveau statut: ${newStatus}`);
    
    // Liste des destinataires en CC, uniquement si une réponse est fournie
    const ccRecipients: string[] = [];
    
    // Ajouter mniane6426@gmail.com en CC uniquement s'il y a une réponse
    if (response) {
      ccRecipients.push("mniane6426@gmail.com");
      console.log("Une réponse est fournie, ajout de mniane6426@gmail.com en CC");
    }
    
    // Ajouter l'email administrateur en CC s'il est fourni et différent de celui déjà présent
    if (adminEmail && !ccRecipients.includes(adminEmail)) {
      ccRecipients.push(adminEmail);
    }

    // Si la clé Resend n'est pas configurée, retourner une erreur appropriée
    if (!resend) {
      console.error("RESEND_API_KEY n'est pas configurée. Impossible d'envoyer des emails.");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuration de l'envoi d'email manquante",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Récupération des données depuis Supabase en fonction du type
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    const supabaseUrl = SUPABASE_URL;
    const supabaseKey = SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquants");
    }

    let tableName = "";
    if (type === "doleance") {
      tableName = "doleances";
    } else if (type === "audience") {
      tableName = "audiences";
    } else {
      throw new Error(`Type de notification non supporté: ${type}`);
    }

    // Récupération des données de la doleance ou audience depuis Supabase
    const response_data = await fetch(`${supabaseUrl}/rest/v1/${tableName}?id=eq.${id}&select=*`, {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        "Content-Type": "application/json",
      },
    });

    if (!response_data.ok) {
      const error = await response_data.text();
      throw new Error(`Erreur lors de la récupération des données: ${error}`);
    }

    const data = await response_data.json();
    if (!data || !data.length) {
      throw new Error(`Aucun enregistrement trouvé pour l'id ${id} dans la table ${tableName}`);
    }

    const record = data[0];
    const email = record.email;
    const name = record.name;

    if (!email) {
      throw new Error("Adresse email manquante dans l'enregistrement");
    }

    // Préparation du contenu de l'email en fonction du type et du statut
    let subject = "";
    let htmlContent = "";

    const getStatusLabel = (status: string): string => {
      switch (status) {
        case "submitted":
          return "Soumis";
        case "in_progress":
          return "En cours de traitement";
        case "completed":
          return "Complété";
        case "rejected":
          return "Rejeté";
        case "pending":
          return "En attente";
        case "approved":
          return "Approuvé";
        default:
          return status;
      }
    };

    const statusLabel = getStatusLabel(newStatus);

    if (type === "doleance") {
      subject = `Mise à jour de votre question écrite: ${statusLabel}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Mise à jour de votre question écrite</h2>
          <p>Bonjour ${name},</p>
          <p>Le statut de votre question écrite a été mis à jour à <strong>${statusLabel}</strong>.</p>
          ${record.title ? `<p><strong>Titre de la question:</strong> ${record.title}</p>` : ''}
          ${response ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #333;">Réponse du bureau:</h3>
              <p style="margin-bottom: 0;">${response}</p>
            </div>
          ` : ''}
          <p>Merci pour votre participation citoyenne.</p>
          <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #777;">
            Ce message est envoyé automatiquement, merci de ne pas y répondre directement.
          </p>
        </div>
      `;
    } else if (type === "audience") {
      subject = `Mise à jour de votre demande d'audience: ${statusLabel}`;
      
      let meetingInfo = "";
      if (newStatus === "approved" && record.meeting_date) {
        const meetingDate = new Date(record.meeting_date);
        meetingInfo = `
          <div style="background-color: #e7f5ea; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #28a745;">Audience programmée</h3>
            <p>Votre audience a été programmée pour le <strong>${meetingDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> à <strong>${meetingDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</strong>.</p>
          </div>
        `;
      }

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Mise à jour de votre demande d'audience</h2>
          <p>Bonjour ${name},</p>
          <p>Le statut de votre demande d'audience a été mis à jour à <strong>${statusLabel}</strong>.</p>
          ${record.subject ? `<p><strong>Sujet:</strong> ${record.subject}</p>` : ''}
          ${meetingInfo}
          ${response ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #333;">Réponse du bureau:</h3>
              <p style="margin-bottom: 0;">${response}</p>
            </div>
          ` : ''}
          <p>Merci pour votre participation citoyenne.</p>
          <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #777;">
            Ce message est envoyé automatiquement, merci de ne pas y répondre directement.
          </p>
        </div>
      `;
    }

    // Envoi réel d'email avec Resend
    try {
      console.log("Envoi d'email en PRODUCTION à:", email);
      
      if (ccRecipients.length > 0) {
        console.log("Avec CC à:", ccRecipients.join(", "));
      } else {
        console.log("Aucun destinataire en CC");
      }
      
      const emailConfig = {
        from: "Cabinet Parlementaire <contact@gmsagna.com>",
        to: [email],
        subject: subject,
        html: htmlContent
      };
      
      // Ajouter les destinataires en CC uniquement s'il y en a
      if (ccRecipients.length > 0) {
        emailConfig.cc = ccRecipients;
      }
      
      const emailResponse = await resend.emails.send(emailConfig);

      console.log("Réponse de l'envoi d'email:", emailResponse);

      return new Response(
        JSON.stringify({
          success: true,
          emailSent: true,
          data: emailResponse,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError) {
      console.error("Erreur lors de l'envoi d'email:", emailError);
      return new Response(
        JSON.stringify({
          success: false,
          error: emailError.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  } catch (error) {
    console.error("Erreur de traitement:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
