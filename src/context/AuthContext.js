"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const res = await axios.get(`${API_URL}/api/auth/me`, config)

        setUser(res.data)
        setLoading(false)
      } catch (err) {
        localStorage.removeItem("token")
        setUser(null)
        setError(err.response?.data?.message || "An error occurred")
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/auth/register`, userData)

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const adminLogin = async (email, password) => {
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, { email, password })

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const res = await axios.put(`${API_URL}/api/users/profile`, userData, config)

      setUser(res.data)
      setError(null)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    setUser,
    loading,
    error,
    register,
    login,
    adminLogin,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

