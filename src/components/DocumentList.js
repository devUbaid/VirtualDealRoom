"use client"
import { useAuth } from "../context/AuthContext"
import { API_URL } from "../config"

const DocumentList = ({ documents, dealId, onDelete }) => {
  const { user } = useAuth()

  const getDocumentIcon = (fileType) => {
    switch (fileType) {
      case "application/pdf":
        return <i className="fas fa-file-pdf document-icon text-red-500"></i>
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <i className="fas fa-file-word document-icon text-blue-500"></i>
      case "image/png":
        return <i className="fas fa-file-image document-icon text-green-500"></i>
      default:
        return <i className="fas fa-file document-icon"></i>
    }
  }

  const canViewDocument = (document) => {
    if (document.accessControl === "all") return true
    if (document.accessControl === "buyer" && user.role === "buyer") return true
    if (document.accessControl === "seller" && user.role === "seller") return true
    if (document.uploadedBy === user._id) return true
    return false
  }

  const handleDownload = async (document) => {
    try {
      const token = localStorage.getItem("token")

      // Create a link element
      const link = document.createElement("a")
      link.href = `${API_URL}/api/deals/${dealId}/documents/${document._id}/download?token=${token}`
      link.setAttribute("download", document.originalName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading document:", error)
    }
  }

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_URL}/api/deals/${dealId}/documents/${documentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          onDelete(documentId)
        } else {
          const data = await response.json()
          throw new Error(data.message || "Error deleting document")
        }
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    }
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-6 bg-bg-secondary rounded-lg">
        <i className="fas fa-file-alt text-4xl text-text-light mb-2"></i>
        <p>No documents uploaded yet.</p>
      </div>
    )
  }

  return (
    <div className="document-list">
      {documents.map((document) => (
        <div key={document._id} className="document-item">
          {getDocumentIcon(document.fileType)}
          <div className="document-name">{document.originalName}</div>
          <div className="text-xs text-gray mb-2">Uploaded by: {document.uploadedBy.name}</div>

          {canViewDocument(document) ? (
            <div className="document-actions">
              <button onClick={() => handleDownload(document)} className="btn btn-outline btn-sm">
                <i className="fas fa-download mr-1"></i> Download
              </button>

              {(document.uploadedBy._id === user._id || user.role === "admin") && (
                <button onClick={() => handleDelete(document._id)} className="btn btn-danger btn-sm">
                  <i className="fas fa-trash mr-1"></i> Delete
                </button>
              )}
            </div>
          ) : (
            <div className="text-xs text-danger-color flex items-center">
              <i className="fas fa-lock mr-1"></i>
              You don't have permission to view this document
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DocumentList

