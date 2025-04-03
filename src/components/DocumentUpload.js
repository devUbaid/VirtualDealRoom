"use client"

import { useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import Spinner from "./Spinner"

const DocumentUpload = ({ dealId, onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [accessControl, setAccessControl] = useState("all") // 'all', 'buyer', 'seller'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOCX, and PNG files are allowed")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("document", file)
      formData.append("accessControl", accessControl)

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.post(`${API_URL}/api/deals/${dealId}/documents`, formData, config)

      setFile(null)
      setLoading(false)
      onUploadSuccess(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading document")
      setLoading(false)
    }
  }

  return (
    <div className="document-upload bg-bg-primary p-4 rounded-lg border border-border-color">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fas fa-file-upload mr-2 text-primary-color"></i>
        Upload Document
      </h3>

      {error && (
        <div className="alert alert-danger mb-4 flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="document" className="form-label flex items-center">
            <i className="fas fa-file mr-2"></i>
            Select Document (PDF, DOCX, PNG)
          </label>
          <input
            type="file"
            id="document"
            className="form-control"
            onChange={handleFileChange}
            accept=".pdf,.docx,.png"
          />
        </div>

        <div className="form-group">
          <label htmlFor="accessControl" className="form-label flex items-center">
            <i className="fas fa-lock mr-2"></i>
            Access Control
          </label>
          <select
            id="accessControl"
            className="form-control"
            value={accessControl}
            onChange={(e) => setAccessControl(e.target.value)}
          >
            <option value="all">Everyone</option>
            <option value="buyer">Buyer Only</option>
            <option value="seller">Seller Only</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <i className="fas fa-upload mr-1"></i> Upload Document
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default DocumentUpload

