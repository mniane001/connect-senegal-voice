
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const tableName = type === "doleance" ? "doleances" : "audiences";
    
    console.log(`Tentative de récupération depuis la table ${tableName} pour l'ID: ${id}`);
    
    const res = await fetch(
      `${supabaseUrl}/rest/v1/${tableName}?id=eq.${id}&select=*`,
      {
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        }
      }
    );
    
    if (!res.ok) {
      console.error(`Erreur HTTP lors de la récupération depuis ${tableName}:`, res.status, res.statusText);
      throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
    }
    
    const itemData = await res.json();
    
    if (!itemData || itemData.length === 0) {
      console.error(`Aucune donnée trouvée dans ${tableName} pour l'ID: ${id}`);
      throw new Error(`Erreur lors de la récupération de ${type}: Données non trouvées pour l'ID ${id}`);
    }
    
    const item = itemData[0];
    console.log(`${type} récupéré:`, item);
    
    // Préparer le contenu de l'email en fonction du type et du statut
    let emailSubject = "";
    let emailHtml = "";
    let recipientEmail = item.email;
    
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
    
    const deputyName = "Guy Marius SAGNA";
    const deputyTitle = "Député à l'Assemblée Nationale du Sénégal";
    
    if (type === "doleance") {
      emailSubject = `[IMPORTANT] Mise à jour de votre doléance - ${item.title}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 5px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a5276; margin: 0;">Mise à jour de votre doléance</h1>
            <p style="color: #777; font-style: italic;">Bureau du Député ${deputyName}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>Cher(e) ${item.name},</p>
            <p>Nous vous informons que votre doléance concernant "<strong>${item.title}</strong>" a été mise à jour.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1a5276; margin: 15px 0;">
              <p style="margin: 0;"><strong>Nouveau statut:</strong> ${getStatusLabel(newStatus)}</p>
            </div>
          </div>
          
          ${response ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #1a5276; font-size: 18px; border-bottom: 1px solid #e1e1e1; padding-bottom: 8px;">Réponse du bureau du député:</h2>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p>${response.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; border-top: 1px solid #e1e1e1; padding-top: 20px;">
            <p>Si vous avez des questions supplémentaires, n'hésitez pas à nous contacter en répondant directement à cet email.</p>
            <p>Cordialement,</p>
            <p>
              <strong>${deputyName}</strong><br>
              ${deputyTitle}<br>
              <em>Bureau de la Circonscription de Guédiawaye</em>
            </p>
          </div>
        </div>
      `;
    } else if (type === "audience") {
      emailSubject = `[IMPORTANT] Mise à jour de votre demande d'audience avec ${deputyName}`;
      
      let meetingInfo = "";
      if (newStatus === "approved" && item.meeting_date) {
        const meetingDate = new Date(item.meeting_date);
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit'
        };
        const formattedDate = meetingDate.toLocaleDateString('fr-FR', options as Intl.DateTimeFormatOptions);
        
        meetingInfo = `
          <div style="background-color: #e8f4fc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #1a5276; font-size: 18px; margin-top: 0;">Confirmation de la date d'audience</h2>
            <p>Nous avons le plaisir de vous informer que votre audience a été programmée pour:</p>
            <p style="font-size: 18px; text-align: center; font-weight: bold; color: #1a5276; margin: 15px 0;">
              ${formattedDate}
            </p>
            <p style="font-style: italic; color: #666;">Lieu: Bureau de la circonscription de Guédiawaye</p>
            <p>Merci de vous présenter 15 minutes avant l'heure prévue avec une pièce d'identité.</p>
          </div>
        `;
      }
      
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 5px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a5276; margin: 0;">Mise à jour de votre demande d'audience</h1>
            <p style="color: #777; font-style: italic;">Bureau du Député ${deputyName}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p>Cher(e) ${item.name},</p>
            <p>Nous vous informons que votre demande d'audience concernant "<strong>${item.subject}</strong>" a été mise à jour.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #1a5276; margin: 15px 0;">
              <p style="margin: 0;"><strong>Nouveau statut:</strong> ${getStatusLabel(newStatus)}</p>
            </div>
          </div>
          
          ${meetingInfo}
          
          ${response ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #1a5276; font-size: 18px; border-bottom: 1px solid #e1e1e1; padding-bottom: 8px;">Message du bureau du député:</h2>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p>${response.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; border-top: 1px solid #e1e1e1; padding-top: 20px;">
            <p>Si vous avez des questions, n'hésitez pas à nous contacter en répondant directement à cet email.</p>
            <p>Cordialement,</p>
            <p>
              <strong>${deputyName}</strong><br>
              ${deputyTitle}<br>
              <em>Bureau de la Circonscription de Guédiawaye</em>
            </p>
          </div>
        </div>
      `;
    }
    
    // Configurer l'adresse de réponse (Reply-To)
    const userReplyTo = replyToEmail || "mniane6426@gmail.com"; // Utiliser mniane6426@gmail.com par défaut
    
    // Envoyer l'email à l'utilisateur
    const emailOptions = {
      from: "Bureau de Guy Marius SAGNA <contact@gmsagna.com>",
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
      reply_to: userReplyTo, // S'assurer que toutes les réponses vont à mniane6426@gmail.com
    };
    
    // Si une adresse admin est fournie, envoyer une copie à l'admin
    if (adminEmail) {
      // Toujours envoyer une copie à mniane6426@gmail.com
      emailOptions.cc = [adminEmail];
    }
    
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
