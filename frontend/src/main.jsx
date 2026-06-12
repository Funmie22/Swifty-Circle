import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './context/SocketContext.jsx'
import { TelegramProvider } from './context/TelegramContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TelegramProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </TelegramProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)