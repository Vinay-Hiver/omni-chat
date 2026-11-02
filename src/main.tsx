import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tokens/tokens.css'
import './tokens/typography.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
