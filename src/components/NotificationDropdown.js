"use client"
import { useNavigate } from "react-router-dom"
import { useNotification } from "../context/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useRef } from "react"

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotification()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id)
    onClose?.()

    // Navigate based on notification type
    if (notification.type === "deal" && notification.dealId) {
      navigate(`/deals/${notification.dealId}`)
    } else if (notification.type === "message" && notification.dealId) {
      navigate(`/deals/${notification.dealId}?tab=messages`)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Notifications {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              markAllAsRead()
            }}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li 
                key={notification._id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? "bg-primary-50" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  {/* Notification icon based on type */}
                  <div className={`flex-shrink-0 rounded-full p-2 mt-1 ${
                    notification.type === 'deal' ? 'bg-blue-100 text-blue-600' : 
                    notification.type === 'message' ? 'bg-green-100 text-green-600' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {notification.type === 'deal' ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    ) : notification.type === 'message' ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.content}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

     
    </div>
  )
}

export default NotificationDropdown