"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, CheckSquare, Loader2, Calendar, Flag } from "lucide-react"
import { apiService } from "../../services/apiService"
import { useToast } from "../../contexts/ToastContext"
import { useAuth } from "../../contexts/AuthContext"
import Modal from "../UI/Modal"
import TaskForm from "../Forms/TaskForm"
import DeleteConfirmDialog from "../UI/DeleteConfirmDialog"
import "./TasksSection.css"

const TasksSection = () => {
  const [tasks, setTasks] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null })
  const { toast } = useToast()
  const { isAdmin } = useAuth()

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await apiService.getTasks()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      })
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const fetchTeams = async () => {
    const { data } = await apiService.getTeams()
    setTeams(data || [])
  }

  useEffect(() => {
    fetchTasks()
    fetchTeams()
  }, [])

  const handleAddTask = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleDeleteTask = (task) => {
    setDeleteDialog({ open: true, task })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.task) return

    const { error } = await apiService.deleteTask(deleteDialog.task.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      })
      fetchTasks()
    }

    setDeleteDialog({ open: false, task: null })
  }

  const handleTaskSaved = () => {
    setModalOpen(false)
    setEditingTask(null)
    fetchTasks()
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const { error } = await apiService.updateTask(taskId, { status: newStatus })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Task status updated successfully.",
      })
      fetchTasks()
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "priority-high"
      case "medium":
        return "priority-medium"
      case "low":
        return "priority-low"
      default:
        return "priority-medium"
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "status-completed"
      case "in progress":
        return "status-in-progress"
      case "pending":
        return "status-pending"
      default:
        return "status-pending"
    }
  }

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === Number.parseInt(teamId))
    return team?.name || "Unknown Team"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="loading-spinner" size={32} />
        <p>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="tasks-section">
      <div className="section-card">
        <div className="section-header">
          <div className="header-content">
            <div className="header-icon">
              <CheckSquare size={20} />
            </div>
            <div className="header-text">
              <h2>Tasks Overview</h2>
              <p>Track and manage your tasks</p>
            </div>
          </div>
          {isAdmin() && (
            <button className="btn btn-primary" onClick={handleAddTask}>
              <Plus size={16} />
              Add Task
            </button>
          )}
        </div>

        <div className="section-content">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <CheckSquare size={48} />
              <h3>No tasks yet</h3>
              <p>
                {isAdmin() ? "Get started by creating your first task." : "No tasks have been assigned to you yet."}
              </p>
              {isAdmin() && (
                <button className="btn btn-primary" onClick={handleAddTask}>
                  <Plus size={16} />
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Team</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="task-title">{task.title}</td>
                      <td className="task-team">{getTeamName(task.team_id)}</td>
                      <td>
                        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                          <Flag size={12} />
                          {task.priority || "Medium"}
                        </span>
                      </td>
                      <td className="task-date">
                        <Calendar size={12} />
                        {formatDate(task.due_date)}
                      </td>
                      <td>
                        <select
                          value={task.status || "pending"}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`status-select ${getStatusClass(task.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-sm btn-outline" onClick={() => handleEditTask(task)}>
                            <Edit size={14} />
                          </button>
                          {isAdmin() && (
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task)}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm task={editingTask} teams={teams} onSave={handleTaskSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, task: null })}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteDialog.task?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default TasksSection
