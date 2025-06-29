"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api-service"
import { Plus, Edit, Trash2, Users, Loader2 } from "lucide-react"
import { TeamModal } from "./team-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

export function TeamsSection() {
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading teams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Teams Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Create and manage your teams</p>
          </div>
          <Button onClick={handleAddTeam} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first team.</p>
              <Button onClick={handleAddTeam} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell className="text-gray-600">{team.description || "No description"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTeam(team)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeam(team)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TeamModal open={modalOpen} onOpenChange={setModalOpen} team={editingTeam} onTeamSaved={handleTeamSaved} />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, team: null })}
        title="Delete Team"
        description={`Are you sure you want to delete "${deleteDialog.team?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
