"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "./Spinner"

const SellerRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "seller") {
    return <Navigate to="/dashboard" />
  }

  // Check if user is suspended
  if (user?.status === "suspended") {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <i className="fas fa-ban mr-2"></i>
          Your account has been suspended. Please contact support for assistance.
        </div>
      </div>
    )
  }

  return children
}

export default SellerRoute

