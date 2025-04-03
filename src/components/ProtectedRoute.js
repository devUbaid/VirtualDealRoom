"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "./Spinner"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute

