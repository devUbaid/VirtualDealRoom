"use client"

import { createContext, useContext, useEffect, useState } from "react"
import io from "socket.io-client"
import { useAuth } from "./AuthContext"
import { API_URL } from "../config"

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    let socketInstance = null

    if (isAuthenticated && user) {
      // Initialize socket connection
      socketInstance = io(API_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      })

      socketInstance.on("connect", () => {
        console.log("Socket connected")
        setConnected(true)
      })

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected")
        setConnected(false)
      })

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error)
      })

      setSocket(socketInstance)
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [isAuthenticated, user])

  const joinDealRoom = (dealId) => {
    if (socket && connected) {
      socket.emit("join_deal", { dealId })
    }
  }

  const leaveDealRoom = (dealId) => {
    if (socket && connected) {
      socket.emit("leave_deal", { dealId })
    }
  }

  const sendMessage = (dealId, message) => {
    if (socket && connected) {
      socket.emit("send_message", { dealId, message })
    }
  }

  const startTyping = (dealId) => {
    if (socket && connected) {
      socket.emit("typing_start", { dealId })
    }
  }

  const stopTyping = (dealId) => {
    if (socket && connected) {
      socket.emit("typing_stop", { dealId })
    }
  }

  const updatePrice = (dealId, price) => {
    if (socket && connected) {
      socket.emit("update_price", { dealId, price })
    }
  }

  const value = {
    socket,
    connected,
    joinDealRoom,
    leaveDealRoom,
    sendMessage,
    startTyping,
    stopTyping,
    updatePrice,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

