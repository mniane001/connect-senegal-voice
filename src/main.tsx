
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Exposer l'application React globalement pour les méthodes de chargement non-module
window.App = <App />;
window.ReactDOM = { createRoot };

// Utilisation de try/catch pour détecter les erreurs de chargement
try {
  const container = document.getElementById("root");
  if (container) {
    createRoot(container).render(<App />);
    console.log("Application successfully mounted");
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error("Error initializing application:", error);
}
