"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import DealCard from "../components/DealCard"
import Spinner from "../components/Spinner"

const Dashboard = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [viewMode, setViewMode] = useState("my-deals")
  const { user } = useAuth()

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        let endpoint = `${API_URL}/api/deals`
        if (user.role === "seller" && viewMode === "available-deals") {
          endpoint = `${API_URL}/api/deals/available`
        }

        const res = await axios.get(endpoint, config)
        setDeals(res.data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching deals")
        setLoading(false)
      }
    }

    fetchDeals()
  }, [user.role, viewMode])

  const filteredDeals = filter === "all" ? deals : deals.filter((deal) => deal.status === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
            <i className="fas fa-handshake text-xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {viewMode === "my-deals" ? "My Deals" : "Available Deals"}
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {user.role === "seller" && (
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md transition-all flex items-center ${
                  viewMode === "my-deals" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("my-deals")}
              >
                <i className="fas fa-briefcase mr-2"></i>
                <span className="hidden sm:inline">My Deals</span>
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all flex items-center ${
                  viewMode === "available-deals" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("available-deals")}
              >
                <i className="fas fa-search mr-2"></i>
                <span className="hidden sm:inline">Available</span>
              </button>
            </div>
          )}

          {(user.role === "buyer" || (user.role === "seller" && viewMode === "my-deals")) && (
            <Link 
              to="/deals/create" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>
              <span>New Deal</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {["all", "pending", "in-progress", "completed", "cancelled"].map((status) => {
            const icons = {
              "all": "fas fa-border-all",
              "pending": "fas fa-clock",
              "in-progress": "fas fa-spinner",
              "completed": "fas fa-check-circle",
              "cancelled": "fas fa-times-circle"
            }
            
            const active = filter === status
            return (
              <button
                key={status}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  active 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() => setFilter(status)}
              >
                <i className={`${icons[status]} mr-2`}></i>
                {status.replace("-", " ")}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center my-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center my-12 py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <i className="fas fa-folder-open text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {viewMode === "available-deals" ? "No deals available" : "No deals found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {viewMode === "available-deals" 
              ? "Check back later for new opportunities" 
              : "Get started by creating your first deal"}
          </p>
          {(user.role === "buyer" || (user.role === "seller" && viewMode === "my-deals")) && (
            <Link 
              to="/deals/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <i className="fas fa-plus mr-2"></i>
              Create Deal
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal._id}
              deal={deal}
              isAvailableDeal={user.role === "seller" && viewMode === "available-deals"}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard