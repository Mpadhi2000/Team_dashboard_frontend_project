"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { TeamsSection } from "./teams-section"
import { TasksSection } from "./tasks-section"

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("tasks")
  const { isAdmin } = useAuth()

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} isAdmin={isAdmin()} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader activeSection={activeSection} />
          <main className="flex-1 p-6">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function UnauthorizedAccess() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">You don't have permission to view this section.</p>
      </div>
    </div>
  )
}
