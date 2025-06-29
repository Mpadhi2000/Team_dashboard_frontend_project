"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { apiService } from "@/lib/api-service"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem("jwt_token")
    const storedUser = localStorage.getItem("user_data")

    if (storedToken && storedUser) {
      try {
        // Verify token is still valid by fetching user data
        apiService.setToken(storedToken)
        const { data, error } = await apiService.getCurrentUser()

        if (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("jwt_token")
          localStorage.removeItem("user_data")
          setToken(null)
          setUser(null)
        } else {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user_data")
        setToken(null)
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      setLoading(true)

      // Get JWT token
      const { data: tokenData, error: tokenError } = await apiService.login(username, password)

      if (tokenError || !tokenData?.token) {
        setLoading(false)
        return { success: false, error: tokenError || "Login failed" }
      }

      const jwtToken = tokenData.token
      apiService.setToken(jwtToken)

      // Get user details
      const { data: userData, error: userError } = await apiService.getCurrentUser()

      if (userError || !userData) {
        setLoading(false)
        return { success: false, error: userError || "Failed to fetch user data" }
      }

      const user = {
        id: userData.id,
        username: userData.username || userData.slug,
        email: userData.email,
        roles: userData.roles || [],
        name: userData.name,
        capabilities: userData.capabilities || {},
      }

      // Store in localStorage
      localStorage.setItem("jwt_token", jwtToken)
      localStorage.setItem("user_data", JSON.stringify(user))

      setToken(jwtToken)
      setUser(user)
      setLoading(false)

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      setLoading(false)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("user_data")
    apiService.setToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin = useCallback(() => {
    return user?.roles?.includes("administrator") || user?.capabilities?.manage_options === true || false
  }, [user])

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
