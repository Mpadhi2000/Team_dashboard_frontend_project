"use client"

import { useState, useEffect } from "react"
import { apiService } from "../../services/apiService"
import { useToast } from "../../contexts/ToastContext"
import { Loader2 } from "lucide-react"
import "./Forms.css"

const TeamForm = ({ team, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        description: team.description || "",
      })
    }
  }, [team])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Team name is required.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let result
      if (team) {
        result = await apiService.updateTeam(team.id, formData)
      } else {
        result = await apiService.createTeam(formData)
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
          description: `Team ${team ? "updated" : "created"} successfully.`,
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
        <label htmlFor="name">Team Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter team name"
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
          placeholder="Enter team description (optional)"
          rows="4"
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <Loader2 className="btn-spinner" size={16} />}
          {team ? "Update Team" : "Create Team"}
        </button>
      </div>
    </form>
  )
}

export default TeamForm
