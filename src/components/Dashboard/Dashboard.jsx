"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Sidebar from "./Sidebar"
import Header from "./Header"
import TeamsSection from "./TeamsSection"
import TasksSection from "./TasksSection"
import "./Dashboard.css"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("tasks")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, isAdmin } = useAuth()

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "teams":
        return isAdmin() ? <TeamsSection /> : <UnauthorizedAccess />
      case "tasks":
        return <TasksSection />
      default:
        return <TasksSection />
    }
  }

  return (
    <div className="dashboard">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        isAdmin={isAdmin()}
      />

      <div className={`dashboard-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header user={user} activeSection={activeSection} onToggleSidebar={toggleSidebar} />

        <main className="dashboard-content">{renderContent()}</main>
      </div>
    </div>
  )
}

const UnauthorizedAccess = () => {
  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <div className="access-denied-icon">🔒</div>
        <h3>Access Restricted</h3>
        <p>You don't have permission to view this section.</p>
      </div>
    </div>
  )
}

export default Dashboard
