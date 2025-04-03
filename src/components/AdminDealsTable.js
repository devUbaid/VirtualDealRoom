"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import { formatDistanceToNow } from "date-fns"
import Spinner from "./Spinner"

const AdminDealsTable = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const res = await axios.get(`${API_URL}/api/admin/deals`, config)
        setDeals(res.data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching deals")
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        await axios.delete(`${API_URL}/api/admin/deals/${dealId}`, config)

        // Remove the deal from the state
        setDeals(deals.filter((deal) => deal._id !== dealId))
      } catch (err) {
        setError("Error deleting deal")
      }
    }
  }

  // Filter deals based on search term and status
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.seller && deal.seller.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || deal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDeals.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage)

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning"
      case "in-progress":
        return "badge-secondary"
      case "completed":
        return "badge-success"
      case "cancelled":
        return "badge-danger"
      default:
        return "badge-warning"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="bg-bg-primary rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search deals..."
              className="form-control pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray"></i>
          </div>
        </div>

        <div className="flex gap-2">
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="btn btn-outline">
            <i className="fas fa-filter mr-1"></i> Filter
          </button>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-search text-4xl text-text-light mb-2"></i>
          <p>No deals found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary">
                  <th className="p-3 text-left">Deal</th>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Seller</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((deal) => (
                  <tr key={deal._id} className="border-b border-border-color hover:bg-bg-tertiary">
                    <td className="p-3">
                      <div className="font-medium">{deal.title}</div>
                    </td>
                    <td className="p-3">{deal.buyer.name}</td>
                    <td className="p-3">{deal.seller ? deal.seller.name : "Not assigned"}</td>
                    <td className="p-3">${deal.price.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`badge ${getStatusBadgeClass(deal.status)}`}>
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">{formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <a
                          href={`/deals/${deal._id}`}
                          className="text-primary-color hover:text-primary-hover"
                          title="View Deal"
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                        <button
                          className="text-danger-color hover:text-danger-hover"
                          onClick={() => handleDeleteDeal(deal._id)}
                          title="Delete Deal"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDeals.length)} of{" "}
              {filteredDeals.length} deals
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDealsTable

