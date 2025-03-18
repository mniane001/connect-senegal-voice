
import emailjs from 'emailjs-com';

// EmailJS configuration parameters
const SERVICE_ID = 'service_n7yy92c'; // User's Service ID
const TEMPLATE_ID_DOLEANCE = 'template_l5g0jx7'; // User's Template ID for doléances
const TEMPLATE_ID_AUDIENCE = 'template_aal1pev'; // User's Template ID for audiences
const USER_ID = 'EwjtJ5wam0wkLZkdW'; // User's Public Key

// Initialisation d'EmailJS
export const initEmailService = () => {
  emailjs.init(USER_ID);
};

// Fonction pour envoyer un email de notification
export const sendNotificationEmail = async (params: {
  type: 'doleance' | 'audience';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  status: string;
  response: string;
  meetingDate?: string | null;
}) => {
  try {
    const { type, recipientEmail, recipientName, subject, status, response, meetingDate } = params;
    
    // Sélection du template en fonction du type
    const templateId = type === 'doleance' ? TEMPLATE_ID_DOLEANCE : TEMPLATE_ID_AUDIENCE;
    
    // Préparation des paramètres pour EmailJS
    const templateParams = {
      to_email: recipientEmail,
      to_name: recipientName,
      subject,
      status: getStatusLabel(status),
      response,
      meeting_date: meetingDate ? formatDate(new Date(meetingDate)) : '',
      has_meeting: meetingDate ? 'true' : 'false',
      deputy_name: 'Guy Marius SAGNA',
      deputy_title: 'Député à l\'Assemblée Nationale du Sénégal'
    };
    
    console.log("Envoi d'email avec EmailJS:", templateParams);
    
    // Envoi de l'email via EmailJS
    const result = await emailjs.send(SERVICE_ID, templateId, templateParams);
    console.log('Email envoyé avec succès:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
};

// Fonction utilitaire pour obtenir le libellé du statut
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

// Fonction utilitaire pour formater une date
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options);
};
