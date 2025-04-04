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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false)
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
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-handshake text-blue-600 text-2xl"></i>
              <span className="ml-2 text-xl font-bold  sm:block">Virtual Deal Room</span>
            </Link>
            
          </div>

          {/* Desktop Menu - Hidden on mobile, visible on md screens and up */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <i className="fas fa-th-large mr-2"></i> Dashboard
                </Link>

                {user?.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <i className="fas fa-chart-line mr-2"></i> Admin
                  </Link>
                )}

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="fas fa-bell mr-2"></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && <NotificationDropdown />}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <i className="fas fa-user-circle mr-2"></i>
                    <span>{user?.name}</span>
                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  </button>

                  {showUserMenu && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-user-cog mr-2"></i> Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i> Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <i className="fas fa-user-plus mr-2"></i> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="flex items-center md:hidden">
            {isAuthenticated && (
              <>
                {/* Mobile Notification Icon */}
                <div className="relative mr-4" ref={notificationRef}>
                  <button 
                    className="text-gray-700 hover:text-blue-600 p-2 rounded-md"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10">
                      <NotificationDropdown mobileView={true} />
                    </div>
                  )}
                </div>
              </>
            )}
            
            <button
              className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Hidden on desktop */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-th-large mr-2"></i> Dashboard
              </Link>

              {user?.role === "admin" && (
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-chart-line mr-2"></i> Admin
                </Link>
              )}

              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-user-cog mr-2"></i> Profile
              </Link>

              <button 
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt mr-2"></i> Login
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-user-plus mr-2"></i> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar