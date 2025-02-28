
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Utilisation de try/catch pour détecter les erreurs de chargement
try {
  const container = document.getElementById("root");
  if (container) {
    createRoot(container).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    console.log("Application successfully mounted");
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error("Error initializing application:", error);
}
