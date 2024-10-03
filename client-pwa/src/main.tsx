import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { WebSocketProvider } from './contexts/WebSocketContext.tsx'
import { PlayroomProvider } from './contexts/PlayroomContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <WebSocketProvider>
        <PlayroomProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
      </PlayroomProvider>
      </WebSocketProvider>
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>,
)
