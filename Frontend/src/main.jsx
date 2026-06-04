import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './css/normalize.css'
import './css/webflow.css'
import './css/tradeguard-ai.webflow.css'
import './index.css'
import App from './App.jsx'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger)

// Configure GSAP defaults
gsap.config({
  nullTargetWarn: false,
})

// Set default ease
gsap.defaults({
  ease: 'power2.out',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
