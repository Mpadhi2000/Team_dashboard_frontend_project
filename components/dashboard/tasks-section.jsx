"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api-service"
import { useAuth } from "@/components/auth/auth-provider"
import { Plus, Edit, Trash2, CheckSquare, Loader2, Calendar, Flag } from "lucide-react"
import { TaskModal } from "./task-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

export function TasksSection() {
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading tasks...</p>
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
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Tasks Overview
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Track and manage your tasks</p>
          </div>
          {isAdmin() && (
            <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">
                {isAdmin() ? "Get started by creating your first task." : "No tasks have been assigned to you yet."}
              </p>
              {isAdmin() && (
                <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="text-gray-600">{getTeamName(task.team_id)}</TableCell>
                      <TableCell>
                        <Badge className={`border ${getPriorityColor(task.priority)}`}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority || "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(task.due_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          value={task.status || "pending"}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)} cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isAdmin() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editingTask}
        teams={teams}
        onTaskSaved={handleTaskSaved}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, task: null })}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteDialog.task?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
