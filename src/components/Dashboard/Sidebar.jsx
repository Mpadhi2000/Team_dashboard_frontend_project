"use client"
import { Users, CheckSquare, BarChart3 } from "lucide-react"
import "./Sidebar.css"

const Sidebar = ({ activeSection, onSectionChange, collapsed, isAdmin }) => {
  const menuItems = [
    {
      key: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      description: "Manage and track tasks",
    },
    ...(isAdmin
      ? [
          {
            key: "teams",
            label: "Teams",
            icon: Users,
            description: "Manage teams and members",
          },
        ]
      : []),
  ]

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <BarChart3 size={20} />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <h2>Task Manager</h2>
              <p>Team Collaboration</p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">Navigation</div>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.key} className="nav-item">
                  <button
                    className={`nav-link ${activeSection === item.key ? "active" : ""}`}
                    onClick={() => onSectionChange(item.key)}
                    title={collapsed ? item.label : ""}
                  >
                    <IconComponent className="nav-icon" />
                    {!collapsed && (
                      <div className="nav-content">
                        <span className="nav-title">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
