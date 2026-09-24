import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import './index.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
  // Fail visibly instead of rendering a dead Google button.
  console.error(
    'Missing VITE_GOOGLE_CLIENT_ID. Set it in frontend/.env (same Web Client ID as backend GOOGLE_CLIENT_ID).'
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary title="The application">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'missing-client-id'}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
