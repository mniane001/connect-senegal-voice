
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

interface NotificationRequest {
  type: "doleance" | "audience";
  id: string;
  newStatus: string;
  response?: string;
}

async function getDoleanceDetails(id: string) {
  console.log("Récupération des détails de la doléance:", id);
  const { data, error } = await supabase
    .from("doleances")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la doléance:", error);
    throw new Error(`Erreur lors de la récupération de la doléance: ${error.message}`);
  }

  console.log("Détails de la doléance récupérés:", data);
  return data;
}

async function getAudienceDetails(id: string) {
  console.log("Récupération des détails de l'audience:", id);
  const { data, error } = await supabase
    .from("audiences")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de l'audience:", error);
    throw new Error(`Erreur lors de la récupération de l'audience: ${error.message}`);
  }

  console.log("Détails de l'audience récupérés:", data);
  return data;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "submitted":
      return "Soumise";
    case "in_progress":
      return "En cours de traitement";
    case "completed":
      return "Traitée";
    case "rejected":
      return "Rejetée";
    case "pending":
      return "En attente";
    case "scheduled":
      return "Programmée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
}

function getDoleanceEmailSubject(status: string): string {
  switch (status) {
    case "in_progress":
      return "Votre doléance est en cours de traitement";
    case "completed":
      return "Votre doléance a été traitée";
    case "rejected":
      return "Mise à jour concernant votre doléance";
    default:
      return "Mise à jour de votre doléance";
  }
}

function getAudienceEmailSubject(status: string): string {
  switch (status) {
    case "scheduled":
      return "Votre demande d'audience a été acceptée";
    case "cancelled":
      return "Votre demande d'audience a été annulée";
    case "in_progress":
      return "Votre demande d'audience est en cours de traitement";
    default:
      return "Mise à jour de votre demande d'audience";
  }
}

function getFormattedDate(dateString: string | null): string {
  if (!dateString) return "À déterminer";
  
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendDoleanceEmail(doleance: any, newStatus: string, response?: string) {
  console.log("Préparation de l'email pour la doléance:", doleance.id);
  
  const subject = getDoleanceEmailSubject(newStatus);
  
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #006400; margin-bottom: 10px;">Bureau du Député Guy Marius Sagna</h1>
        <h2 style="color: #006400; margin-top: 0;">Ziguinchor, Sénégal</h2>
      </div>
      
      <p>Cher/Chère ${doleance.name},</p>
      
      <p>Nous vous informons que le statut de votre doléance concernant "${doleance.title}" a été mis à jour.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
        <p><strong>Statut actuel :</strong> ${getStatusLabel(newStatus)}</p>
        <p><strong>Catégorie :</strong> ${doleance.category}</p>
        <p><strong>Date de soumission :</strong> ${getFormattedDate(doleance.created_at)}</p>
      </div>
  `;
  
  if (response) {
    htmlContent += `
      <div style="margin: 20px 0;">
        <h3 style="color: #006400;">Réponse du député :</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${response}</p>
      </div>
    `;
  }
  
  htmlContent += `
      <p>Si vous avez des questions supplémentaires, n'hésitez pas à nous contacter.</p>
      
      <p style="margin-top: 30px;">Cordialement,</p>
      <p>
        <strong>Guy Marius Sagna</strong><br>
        Député à l'Assemblée nationale du Sénégal
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
        <p>Ceci est un message automatique, merci de ne pas y répondre directement.</p>
      </div>
    </div>
  `;
  
  console.log(`Envoi d'email à ${doleance.email} avec le sujet "${subject}"`);
  
  const emailResult = await resend.emails.send({
    from: "Assemblée Nationale du Sénégal <onboarding@resend.dev>",
    to: [doleance.email],
    subject: subject,
    html: htmlContent,
  });
  
  console.log("Résultat de l'envoi d'email:", emailResult);
  return emailResult;
}

async function sendAudienceEmail(audience: any, newStatus: string) {
  console.log("Préparation de l'email pour l'audience:", audience.id);
  
  const subject = getAudienceEmailSubject(newStatus);
  
  let meetingDetails = "";
  if (newStatus === "scheduled" && audience.meeting_date) {
    meetingDetails = `
      <div style="background-color: #eaf6ea; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #006400; margin-top: 0;">Détails de votre audience</h3>
        <p><strong>Date et heure :</strong> ${getFormattedDate(audience.meeting_date)}</p>
        <p><strong>Lieu :</strong> Bureau du député, Ziguinchor</p>
        <p>Veuillez vous présenter 15 minutes avant l'heure prévue.</p>
      </div>
    `;
  }
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #006400; margin-bottom: 10px;">Bureau du Député Guy Marius Sagna</h1>
        <h2 style="color: #006400; margin-top: 0;">Ziguinchor, Sénégal</h2>
      </div>
      
      <p>Cher/Chère ${audience.name},</p>
      
      <p>Nous vous informons que le statut de votre demande d'audience concernant "${audience.subject}" a été mis à jour.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #006400; margin: 20px 0;">
        <p><strong>Statut actuel :</strong> ${getStatusLabel(newStatus)}</p>
        <p><strong>Date de soumission :</strong> ${getFormattedDate(audience.created_at)}</p>
      </div>
      
      ${meetingDetails}
      
      ${audience.response ? `
        <div style="margin: 20px 0;">
          <h3 style="color: #006400;">Message du député :</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${audience.response}</p>
        </div>
      ` : ''}
      
      <p>Si vous avez des questions ou si vous devez modifier votre rendez-vous, n'hésitez pas à nous contacter.</p>
      
      <p style="margin-top: 30px;">Cordialement,</p>
      <p>
        <strong>Guy Marius Sagna</strong><br>
        Député à l'Assemblée nationale du Sénégal
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
        <p>Ceci est un message automatique, merci de ne pas y répondre directement.</p>
      </div>
    </div>
  `;
  
  console.log(`Envoi d'email à ${audience.email} avec le sujet "${subject}"`);
  
  const emailResult = await resend.emails.send({
    from: "Assemblée Nationale du Sénégal <onboarding@resend.dev>",
    to: [audience.email],
    subject: subject,
    html: htmlContent,
  });
  
  console.log("Résultat de l'envoi d'email:", emailResult);
  return emailResult;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Réception d'une requête de notification");
    
    const { type, id, newStatus, response } = await req.json() as NotificationRequest;
    
    console.log("Données reçues:", { type, id, newStatus, response });
    
    if (!type || !id || !newStatus) {
      throw new Error("Données de notification incomplètes");
    }
    
    let emailResult;
    
    if (type === "doleance") {
      const doleance = await getDoleanceDetails(id);
      emailResult = await sendDoleanceEmail(doleance, newStatus, response);
    } else if (type === "audience") {
      const audience = await getAudienceDetails(id);
      emailResult = await sendAudienceEmail(audience, newStatus);
    } else {
      throw new Error(`Type de notification non pris en charge: ${type}`);
    }
    
    console.log("Notification envoyée avec succès");
    
    return new Response(
      JSON.stringify({ success: true, message: "Notification envoyée", data: emailResult }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de la notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erreur lors de l'envoi de l'email: ${error.message}` 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
