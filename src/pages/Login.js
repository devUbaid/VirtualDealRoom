"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { email, password } = formData

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  // Pre-fill email if coming from register page
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const emailParam = params.get("email")
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }))
    }
  }, [location])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      // Redirect will happen automatically due to the useEffect above
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500">
            <i className="fas fa-sign-in-alt mr-2"></i>
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600">Sign in to your account to access the Virtual Deal Room</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 mt-8">
          {error && (
            <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <i className="fas fa-envelope mr-2 text-primary-500"></i>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <i className="fas fa-lock mr-2 text-primary-500"></i>
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-500 hover:text-primary-600">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i> Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <i className="fab fa-google mr-2 text-red-500"></i> Google
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <i className="fab fa-linkedin mr-2 text-blue-600"></i> LinkedIn
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Are you an administrator?{" "}
            <Link to="/admin/login" className="font-medium text-secondary-500 hover:text-secondary-600">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

