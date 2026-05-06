import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import { ToastProvider } from './providers/ToastProvider'
import { AuthProvider } from './providers/AuthProvider'
import './App.css'
import App from './App'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

enableMocking()
  .then(() => renderApp())
  .catch((error) => {
    console.error('MSW 초기화 실패:', error)
    renderApp()
  })
