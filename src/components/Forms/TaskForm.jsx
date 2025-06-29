"use client"

import { useState, useEffect } from "react"
import { apiService } from "../../services/apiService"
import { useToast } from "../../contexts/ToastContext"
import { Loader2 } from "lucide-react"
import "./Forms.css"

const TaskForm = ({ task, teams, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team_id: "",
    priority: "medium",
    status: "pending",
    due_date: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        team_id: task.team_id?.toString() || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      })
    }
  }, [task])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required.",
        variant: "destructive",
      })
      return
    }

    if (!formData.team_id) {
      toast({
        title: "Validation Error",
        description: "Please select a team.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        team_id: Number.parseInt(formData.team_id),
      }

      let result
      if (task) {
        result = await apiService.updateTask(task.id, submitData)
      } else {
        result = await apiService.createTask(submitData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Task ${task ? "updated" : "created"} successfully.`,
        })
        onSave()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows="3"
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="team_id">Team *</label>
          <select
            id="team_id"
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id.toString()}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange} disabled={loading}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={loading}>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <Loader2 className="btn-spinner" size={16} />}
          {task ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
