
/// <reference types="vite/client" />

// Étendre l'interface Window pour inclure nos propriétés personnalisées
interface Window {
  App: React.ReactElement;
  ReactDOM: {
    createRoot: typeof import('react-dom/client').createRoot;
  };
}
