import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import Login from "./components/Auth/Login"
import Dashboard from "./components/Dashboard/Dashboard"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import Toast from "./components/UI/Toast"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toast />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
