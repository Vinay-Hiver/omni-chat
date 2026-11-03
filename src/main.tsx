import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tokens/tokens.css'
import './tokens/typography.css'
import './index.css'
import { Agentation } from 'agentation'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Agentation: annotate the page and copy notes for the agent. Dev only. */}
    {import.meta.env.DEV && <Agentation />}
  </StrictMode>,
)
