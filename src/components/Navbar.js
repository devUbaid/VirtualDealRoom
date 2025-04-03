"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import NotificationDropdown from "./NotificationDropdown"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { unreadCount } = useNotification()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Don't show navbar on admin login page
  if (window.location.pathname === "/admin-login") {
    return null
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-handshake"></i> Virtual Deal Room
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                <i className="fas fa-th-large mr-1"></i> Dashboard
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" className="navbar-link">
                  <i className="fas fa-chart-line mr-1"></i> Admin
                </Link>
              )}

              <div className="relative" ref={notificationRef}>
                <button
                  className="navbar-link flex items-center"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && <span className="notification-badge ml-1">{unreadCount}</span>}
                </button>

                {showNotifications && <NotificationDropdown />}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button className="navbar-link flex items-center" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <i className="fas fa-user-circle mr-1"></i>
                  <span className="mr-1">{user?.name}</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-border-color">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-user-cog mr-2"></i> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                <i className="fas fa-sign-in-alt mr-1"></i> Login
              </Link>
              <Link to="/register" className="navbar-btn">
                <i className="fas fa-user-plus mr-1"></i> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

