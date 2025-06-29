"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Users, Loader2 } from "lucide-react"
import { apiService } from "../../services/apiService"
import { useToast } from "../../contexts/ToastContext"
import Modal from "../UI/Modal"
import TeamForm from "../Forms/TeamForm"
import DeleteConfirmDialog from "../UI/DeleteConfirmDialog"
import "./TeamsSection.css"

const TeamsSection = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, team: null })
  const { toast } = useToast()

  const fetchTeams = async () => {
    setLoading(true)
    const { data, error } = await apiService.getTeams()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams. Please try again.",
        variant: "destructive",
      })
    } else {
      setTeams(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleAddTeam = () => {
    setEditingTeam(null)
    setModalOpen(true)
  }

  const handleEditTeam = (team) => {
    setEditingTeam(team)
    setModalOpen(true)
  }

  const handleDeleteTeam = (team) => {
    setDeleteDialog({ open: true, team })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.team) return

    const { error } = await apiService.deleteTeam(deleteDialog.team.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Team deleted successfully.",
      })
      fetchTeams()
    }

    setDeleteDialog({ open: false, team: null })
  }

  const handleTeamSaved = () => {
    setModalOpen(false)
    setEditingTeam(null)
    fetchTeams()
  }

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="loading-spinner" size={32} />
        <p>Loading teams...</p>
      </div>
    )
  }

  return (
    <div className="teams-section">
      <div className="section-card">
        <div className="section-header">
          <div className="header-content">
            <div className="header-icon">
              <Users size={20} />
            </div>
            <div className="header-text">
              <h2>Teams Management</h2>
              <p>Create and manage your teams</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAddTeam}>
            <Plus size={16} />
            Add Team
          </button>
        </div>

        <div className="section-content">
          {teams.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>No teams yet</h3>
              <p>Get started by creating your first team.</p>
              <button className="btn btn-primary" onClick={handleAddTeam}>
                <Plus size={16} />
                Create Team
              </button>
            </div>
          ) : (
            <div className="teams-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td className="team-name">{team.name}</td>
                      <td className="team-description">{team.description || "No description"}</td>
                      <td>
                        <span className="status-badge status-active">Active</span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-sm btn-outline" onClick={() => handleEditTeam(team)}>
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTeam(team)}>
                            <Trash2 size={14} />
                          </button>
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
        title={editingTeam ? "Edit Team" : "Create New Team"}
      >
        <TeamForm team={editingTeam} onSave={handleTeamSaved} onCancel={() => setModalOpen(false)} />
      </Modal>

      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, team: null })}
        title="Delete Team"
        message={`Are you sure you want to delete "${deleteDialog.team?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default TeamsSection
