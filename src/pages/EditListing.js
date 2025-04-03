"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const EditListing = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    features: "",
    tags: "",
    location: "",
    status: "",
  })

  const [originalImages, setOriginalImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewUrls, setPreviewUrls] = useState([])

  // Predefined categories
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Vehicles",
    "Real Estate",
    "Services",
    "Jobs",
    "Other",
  ]

  // Statuses
  const statuses = ["active", "pending", "sold", "inactive"]

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const res = await axios.get(`${API_URL}/api/listings/${id}`, config)
        const listing = res.data

        // Check if user is authorized to edit
        if (listing.seller._id !== user._id && user.role !== "admin") {
          setError("You are not authorized to edit this listing")
          setLoading(false)
          return
        }

        // Set form data
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          features: listing.features ? listing.features.join(", ") : "",
          tags: listing.tags ? listing.tags.join(", ") : "",
          location: listing.location || "",
          status: listing.status,
        })

        // Set original images
        setOriginalImages(listing.images || [])

        // Create preview URLs for existing images
        const urls = listing.images.map((img) => `${API_URL}${img.url}`)
        setPreviewUrls(urls)

        setLoading(false)
      } catch (err) {
        setError("Error loading listing")
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, user._id, user.role])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    // Limit to 5 images total (existing + new)
    if (files.length + previewUrls.length > 5) {
      setError("You can have a maximum of 5 images")
      return
    }

    // Check file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

      if (!isValidType) {
        setError("Only JPG, PNG and WebP images are allowed")
        return false
      }

      if (!isValidSize) {
        setError("Images must be less than 5MB")
        return false
      }

      return true
    })

    if (validFiles.length !== files.length) {
      return
    }

    setImageFiles((prev) => [...prev, ...validFiles])

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

    // Clear error if any
    setError("")
  }

  const removeImage = (index) => {
    // If it's a new image (from imageFiles)
    if (index >= originalImages.length) {
      const newImageIndex = index - originalImages.length

      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(previewUrls[index])

      // Remove from imageFiles and previewUrls
      setImageFiles((prev) => prev.filter((_, i) => i !== newImageIndex))
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    } else {
      // It's an original image
      setOriginalImages((prev) => prev.filter((_, i) => i !== index))
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (previewUrls.length === 0 && imageFiles.length === 0) {
      setError("Please upload at least one image")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      // Create form data
      const submitFormData = new FormData()

      // Add text fields
      Object.keys(formData).forEach((key) => {
        submitFormData.append(key, formData[key])
      })

      // Add new images
      imageFiles.forEach((file) => {
        submitFormData.append("images", file)
      })

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.put(`${API_URL}/api/listings/${id}`, submitFormData, config)

      setSubmitting(false)
      setSuccess("Listing updated successfully!")

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/listings/${res.data._id}`)
      }, 2000)
    } catch (err) {
      setSubmitting(false)
      setError(err.response?.data?.message || "Error updating listing")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-edit mr-2 text-primary-color"></i>
        Edit Listing
      </h1>

      <div className="bg-bg-primary rounded-lg shadow-md p-6">
        {error && (
          <div className="alert alert-danger mb-4 flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4 flex items-center">
            <i className="fas fa-check-circle mr-2"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              <i className="fas fa-heading mr-2"></i>
              Listing Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                <i className="fas fa-tag mr-2"></i>
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter price"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <i className="fas fa-folder mr-2"></i>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              <i className="fas fa-align-left mr-2"></i>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Describe your listing in detail"
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="features" className="form-label">
              <i className="fas fa-list-ul mr-2"></i>
              Features (comma separated)
            </label>
            <input
              type="text"
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Brand new, Warranty included, Free shipping"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                <i className="fas fa-tags mr-2"></i>
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. electronics, smartphone, sale"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. New York, NY"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                <i className="fas fa-toggle-on mr-2"></i>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-images mr-2"></i>
              Images (Max 5)
            </label>

            <div className="image-upload-container">
              <div className="image-previews flex flex-wrap gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url || "/placeholder.svg"} alt={`Preview ${index + 1}`} className="preview-image" />
                    <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}

                {previewUrls.length < 5 && (
                  <div className="image-upload-placeholder" onClick={() => fileInputRef.current.click()}>
                    <i className="fas fa-plus"></i>
                    <span>Add Image</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                className="hidden"
              />

              {previewUrls.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current.click()} className="btn btn-outline w-full">
                  <i className="fas fa-upload mr-1"></i> Upload Images
                </button>
              )}

              <div className="text-xs text-gray mt-2">Upload up to 5 images (JPG, PNG, WebP). Max 5MB each.</div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <i className="fas fa-save mr-1"></i> Update Listing
                </>
              )}
            </button>

            <button type="button" className="btn btn-outline" onClick={() => navigate(`/listings/${id}`)}>
              <i className="fas fa-times mr-1"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditListing

