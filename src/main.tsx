import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {App} from '@/App.tsx'

import '@/index.css'
import { ThemeProvider } from '@/providers/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="wet-popup-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
