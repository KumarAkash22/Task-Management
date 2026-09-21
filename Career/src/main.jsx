import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Dashboard from './page/Dashboard.jsx'
import Login from './page/Login.jsx'
import Signup from './page/Signup.jsx'
import CreateTask from './page/CreateTask.jsx'

function ProtectedRoute({ children }) {
  return localStorage.getItem('taskAppToken')
    ? children
    : <Navigate to="/login" replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-task" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
        <Route path="/create-task/:taskId" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
