"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { useSocket } from "./SocketContext"
import { useAuth } from "./AuthContext"
import { API_URL } from "../config"

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { socket, connected } = useSocket()
  const { isAuthenticated } = useAuth()

  // Fetch notifications on initial load
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return

      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const res = await axios.get(`${API_URL}/api/notifications`, config)
        setNotifications(res.data)

        // Calculate unread count
        const unread = res.data.filter((notification) => !notification.read).length
        setUnreadCount(unread)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [isAuthenticated])

  // Listen for new notifications
  useEffect(() => {
    if (!socket || !connected) return

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      socket.off("new_notification")
    }
  }, [socket, connected])

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await axios.put(`${API_URL}/api/notifications/${notificationId}/read`, {}, config)

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await axios.put(`${API_URL}/api/notifications/read-all`, {}, config)

      // Update local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

      // Reset unread count
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

