import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FundProvider } from './context/FundContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FundProvider>
      <App />
    </FundProvider>
  </StrictMode>,
)
