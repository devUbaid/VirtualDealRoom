import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const CreateDeal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  const { title, description, price } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !price) {
      setError("Please fill in all fields")
      return
    }

    if (isNaN(price) || Number.parseFloat(price) <= 0) {
      setError("Please enter a valid price")
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      const dealData = {
        title,
        description,
        price: Number.parseFloat(price),
      }

      const res = await axios.post(`${API_URL}/api/deals`, dealData, config)

      setLoading(false)
      navigate(`/deals/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Error creating deal")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
          <i className="fas fa-plus-circle text-indigo-600 text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Deal</h1>
        <p className="text-gray-500">
          {user.role === "buyer" 
            ? "Make an offer to sellers" 
            : "List your item for potential buyers"}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 sm:p-8 border border-gray-200">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <i className="fas fa-heading text-indigo-500 mr-2"></i>
                Deal Title
              </div>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border text-gray-700 placeholder-gray-400"
              placeholder="Enter deal title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <i className="fas fa-align-left text-indigo-500 mr-2"></i>
                Description
              </div>
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border text-gray-700 placeholder-gray-400"
              placeholder="Describe the deal in detail"
              rows="5"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <i className="fas fa-tag text-indigo-500 mr-2"></i>
                {user.role === "buyer" ? "Offer Price" : "Asking Price"} ($)
              </div>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={handleChange}
                className="block w-full pl-7 pr-12 py-3 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border text-gray-700 placeholder-gray-400"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle mr-2"></i>
                  Create Deal
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-1"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDeal