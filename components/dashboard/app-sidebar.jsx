"use client"

import { Users, CheckSquare, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ activeSection, setActiveSection, isAdmin }) {
  const menuItems = [
    {
      title: "Tasks",
      icon: CheckSquare,
      key: "tasks",
      description: "Manage and track tasks",
    },
    ...(isAdmin
      ? [
          {
            title: "Teams",
            icon: Users,
            key: "teams",
            description: "Manage teams and members",
          },
        ]
      : []),
  ]

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Task Manager</h2>
            <p className="text-xs text-gray-500">Team Collaboration</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.key)}
                    isActive={activeSection === item.key}
                    className={`w-full justify-start px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.key
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
