"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "./Spinner"

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin-login" />
  }

  return children
}

export default AdminRoute
