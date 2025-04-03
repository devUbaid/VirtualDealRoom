"use client"
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const Register = () => {
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  })
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const { register, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { name, email, password, confirmPassword, role } = formData

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard")
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const roleParam = params.get("role")
    if (roleParam && (roleParam === "buyer" || roleParam === "seller")) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
    }
  }, [location])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const validateStep1 = () => {
    if (!name.trim()) {
      setError("Please enter your name")
      return false
    }
    if (!email.trim()) {
      setError("Please enter your email")
      return false
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
  }

  const prevStep = () => setStep(1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return

    try {
      await register({ name, email, password, role })
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg mb-4">
            <i className="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            {role === "buyer" 
              ? "Join as a buyer to find great deals" 
              : "Register as a seller to grow your business"}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {stepNumber}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  step >= stepNumber ? "text-indigo-600" : "text-gray-500"
                }`}>
                  {stepNumber === 1 ? "Account" : "Security"}
                </span>
              </div>
            ))}
            <div className="flex-1 h-px bg-gray-200 mx-2"></div>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400"></i>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={handleChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I want to join as a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "buyer" })}
                      className={`p-4 border rounded-md flex flex-col items-center ${
                        role === "buyer"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                      <span className="text-sm font-medium">Buyer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "seller" })}
                      className={`p-4 border rounded-md flex flex-col items-center ${
                        role === "seller"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                        <i className="fas fa-store"></i>
                      </div>
                      <span className="text-sm font-medium">Seller</span>
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <i className="fas fa-user-plus mr-2"></i>
                        Register
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register