"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import { formatDistanceToNow } from "date-fns"
import Spinner from "./Spinner"

const AdminUsersTable = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const res = await axios.get(`${API_URL}/api/admin/users`, config)
        setUsers(res.data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching users")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const newStatus = currentStatus === "active" ? "suspended" : "active"

      await axios.put(`${API_URL}/api/admin/users/${userId}/status`, { status: newStatus }, config)

      // Update the user in the state
      setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))
    } catch (err) {
      setError("Error updating user status")
    }
  }

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "buyer":
        return "badge-secondary"
      case "seller":
        return "badge-primary"
      case "admin":
        return "badge-warning"
      default:
        return "badge-secondary"
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
              placeholder="Search users..."
              className="form-control pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray"></i>
          </div>
        </div>

        <div className="flex gap-2">
          <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>

          <button className="btn btn-outline">
            <i className="fas fa-filter mr-1"></i> Filter
          </button>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-users text-4xl text-text-light mb-2"></i>
          <p>No users found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary">
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Activity</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => (
                  <tr key={user._id} className="border-b border-border-color hover:bg-bg-tertiary">
                    <td className="p-3">
                      <div className="font-medium">{user.name}</div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`badge ${user.status === "active" ? "badge-success" : "badge-danger"}`}>
                        {user.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-3">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="flex items-center mr-3">
                          <i className="fas fa-handshake text-primary-color mr-1"></i>
                          <span>{user.dealCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-comment text-secondary-color mr-1"></i>
                          <span>{user.messageCount || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className={`${user.status === "active" ? "text-danger-color hover:text-danger-hover" : "text-success-color hover:text-success-hover"}`}
                          onClick={() => handleToggleUserStatus(user._id, user.status)}
                          title={user.status === "active" ? "Suspend User" : "Activate User"}
                        >
                          <i className={`fas fa-${user.status === "active" ? "ban" : "check-circle"}`}></i>
                        </button>
                        <button className="text-primary-color hover:text-primary-hover" title="View User Details">
                          <i className="fas fa-eye"></i>
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
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

export default AdminUsersTable

