"use client"
import { AlertTriangle } from "lucide-react"
import "./DeleteConfirmDialog.css"

const DeleteConfirmDialog = ({ isOpen, onClose, title, message, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div className="dialog-icon">
            <AlertTriangle size={24} />
          </div>
          <h3>{title}</h3>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
        </div>
        <div className="dialog-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmDialog
