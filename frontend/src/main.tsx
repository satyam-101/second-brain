import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Toaster} from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#111827",
        },
      }}
    />
  </StrictMode>,
)
