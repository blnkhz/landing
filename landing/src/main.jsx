import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds ship prerendered HTML (scripts/prerender.js); the dev server doesn't.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
