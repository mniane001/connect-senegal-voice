
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  type: "doleance" | "audience";
  id: string;
  newStatus: string;
  adminEmail?: string;
  replyToEmail?: string;
  response?: string;
  userEmail?: string;
  userName?: string;
  subject?: string;
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
    const { type, id, newStatus, adminEmail, replyToEmail, response, userEmail, userName, subject } = requestData;
    
    console.log("Données de la requête:", requestData);
    
    // Récupérer les détails de la doléance ou audience depuis Supabase
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
    
    // Préparer les détails pour l'envoi d'email
    const emailDetails = {
      recipientEmail: userEmail || item.email, // L'email du demandeur (utilisateur)
      recipientName: userName || item.name,    // Le nom du demandeur (utilisateur)
      subject: subject || (type === "doleance" ? `Mise à jour de votre doléance - ${item.title || ""}` : `Mise à jour de votre demande d'audience`),
      type,
      status: newStatus,
      response: response || "",
      meetingDate: item.meeting_date || null,
      replyTo: adminEmail || replyToEmail || "nianemouhamed001@gmail.com", // L'email de l'administrateur pour les réponses
      fromName: "Guy Marius SAGNA"             // Le nom qui apparaîtra comme expéditeur
    };
    
    console.log("Détails d'email préparés:", emailDetails);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Données validées pour l'envoi d'email via EmailJS`,
        emailDetails
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
        error: error.message || "Une erreur s'est produite lors de la préparation de l'email",
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
