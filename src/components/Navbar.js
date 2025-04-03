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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Mobile menu state
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
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <i className="fas fa-handshake text-blue-600"></i> <span className="ml-2">Virtual Deal Room</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <i className="fas fa-th-large"></i> Dashboard
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" className="nav-link">
                  <i className="fas fa-chart-line"></i> Admin
                </Link>
              )}

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button className="nav-link flex items-center" onClick={() => setShowNotifications(!showNotifications)}>
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                {showNotifications && <NotificationDropdown />}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button className="nav-link flex items-center" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <i className="fas fa-user-circle"></i>
                  <span className="ml-1">{user?.name}</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    <Link to="/profile" className="dropdown-item">
                      <i className="fas fa-user-cog"></i> Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link to="/register" className="nav-btn">
                <i className="fas fa-user-plus"></i> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-menu-item">
                <i className="fas fa-th-large"></i> Dashboard
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" className="mobile-menu-item">
                  <i className="fas fa-chart-line"></i> Admin
                </Link>
              )}

              <Link to="/profile" className="mobile-menu-item">
                <i className="fas fa-user-cog"></i> Profile
              </Link>

              <button onClick={handleLogout} className="mobile-menu-item">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-item">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link to="/register" className="mobile-menu-item">
                <i className="fas fa-user-plus"></i> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
