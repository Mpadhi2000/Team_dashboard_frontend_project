"use client"

import { createContext, useContext, useState } from "react"

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const toast = ({ title, description, variant = "default" }) => {
    const type = variant === "destructive" ? "error" : "success"
    const message = description || title
    addToast(message, type)
  }

  const showSuccess = (message) => addToast(message, "success")
  const showError = (message) => addToast(message, "error")
  const showInfo = (message) => addToast(message, "info")
  const showWarning = (message) => addToast(message, "warning")

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        toast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}
