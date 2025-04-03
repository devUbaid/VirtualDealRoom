import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const { adminLogin, loading } = useAuth()
  const navigate = useNavigate()

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setError("")
      await adminLogin(email, password)
      navigate("/admin")
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials")
    }
  }

  return (
    <div className="container auth-container">
      <h1 className="auth-title text-2xl font-bold">
        <i className="fas fa-user-shield mr-2"></i>
        Admin Login
      </h1>

      <div className="auth-form">
        {error && (
          <div className="alert alert-danger mb-4 flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <i className="fas fa-envelope mr-2"></i>Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i className="fas fa-lock mr-2"></i>Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Admin Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

