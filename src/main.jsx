import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mdi/font/css/materialdesignicons.min.css'
import './index.css'
import App from './App.jsx'

// Force re-login on every new deployment by bumping this version string.
// If the stored version doesn't match, all auth tokens are cleared.
const APP_VERSION = '1.0.1';
if (localStorage.getItem('appVersion') !== APP_VERSION) {
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
  localStorage.setItem('appVersion', APP_VERSION);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
