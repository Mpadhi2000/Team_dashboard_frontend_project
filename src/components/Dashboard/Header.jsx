"use client"
import { useAuth } from "../../contexts/AuthContext"
import { Menu, LogOut } from "lucide-react"
import "./Header.css"

const Header = ({ user, activeSection, onToggleSidebar }) => {
  const { logout, isAdmin } = useAuth()

  const getSectionTitle = () => {
    switch (activeSection) {
      case "teams":
        return "Teams Management"
      case "tasks":
        return "Tasks Overview"
      default:
        return "Dashboard"
    }
  }

  const getSectionDescription = () => {
    switch (activeSection) {
      case "teams":
        return "Create and manage your teams"
      case "tasks":
        return "Track and manage your tasks"
      default:
        return "Welcome to your dashboard"
    }
  }

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return user?.username?.substring(0, 2).toUpperCase() || "U"
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
    }
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="header-title">
          <h1>{getSectionTitle()}</h1>
          <p>{getSectionDescription()}</p>
        </div>
      </div>

      <div className="header-right">
        {isAdmin() && (
          <div className="admin-badge">
            <div className="badge-dot"></div>
            Administrator
          </div>
        )}

        <div className="user-menu">
          <div className="user-avatar">{getUserInitials()}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || user?.username}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
