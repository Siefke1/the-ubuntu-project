import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Add error handling and debugging
console.log('React app starting...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found:', rootElement);
  
  const root = createRoot(rootElement);
  console.log('React root created');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('React app rendered');
} catch (error) {
  console.error('Error rendering React app:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
      <h2>Error loading app</h2>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `;
}
