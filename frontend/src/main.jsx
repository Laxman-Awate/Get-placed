import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error(
    'Missing VITE_GOOGLE_CLIENT_ID. Copy frontend/.env.example to frontend/.env and set your Google Web Client ID.'
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'missing-client-id'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
