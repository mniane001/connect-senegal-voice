
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Utilisation de try/catch pour détecter les erreurs de chargement
try {
  const container = document.getElementById("root");
  if (container) {
    createRoot(container).render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
    console.log("Application successfully mounted");
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error("Error initializing application:", error);
}
