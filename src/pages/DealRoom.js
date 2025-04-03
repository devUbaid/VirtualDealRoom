"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import ChatMessage from "../components/ChatMessage"
import TypingIndicator from "../components/TypingIndicator"
import DocumentUpload from "../components/DocumentUpload"
import DocumentList from "../components/DocumentList"
import PriceNegotiation from "../components/PriceNegotiation"
import Spinner from "../components/Spinner"

const DealRoom = () => {
  const { dealId } = useParams()
  const { user } = useAuth()
  const { socket, connected, joinDealRoom, leaveDealRoom, sendMessage, startTyping, stopTyping } = useSocket()
  const navigate = useNavigate()

  const [deal, setDeal] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [documents, setDocuments] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState("")
  const [priceHistory, setPriceHistory] = useState([])

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch deal data
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const [dealRes, messagesRes, documentsRes, priceHistoryRes] = await Promise.all([
          axios.get(`${API_URL}/api/deals/${dealId}`, config),
          axios.get(`${API_URL}/api/deals/${dealId}/messages`, config),
          axios.get(`${API_URL}/api/deals/${dealId}/documents`, config),
          axios.get(`${API_URL}/api/deals/${dealId}/price-history`, config)
        ])

        setDeal(dealRes.data)
        setMessages(messagesRes.data)
        setDocuments(documentsRes.data)
        setPriceHistory(priceHistoryRes.data)
        setLoading(false)
      } catch (err) {
        setError("Error loading deal room")
        setLoading(false)
      }
    }

    fetchDeal()
  }, [dealId])

  // Socket connection and event listeners
  useEffect(() => {
    if (connected && dealId) {
      joinDealRoom(dealId)
    }

    if (!socket) return

    const socketEventHandlers = {
      "new_message": (message) => {
        setMessages((prev) => [...prev, message])
        if (message.sender._id !== user._id) {
          socket.emit("mark_read", { messageId: message._id })
        }
      },
      "user_typing": ({ user: typingUserData }) => {
        setIsTyping(true)
        setTypingUser(typingUserData.name)
      },
      "user_stop_typing": () => {
        setIsTyping(false)
        setTypingUser("")
      },
      "price_updated": ({ deal: updatedDeal, priceUpdate }) => {
        setDeal(updatedDeal)
        setPriceHistory((prev) => [priceUpdate, ...prev])
      },
      "deal_status_updated": (updatedDeal) => {
        setDeal(updatedDeal)
      },
      "new_document": (document) => {
        setDocuments((prev) => [...prev, document])
      },
      "document_deleted": ({ documentId }) => {
        setDocuments((prev) => prev.filter((doc) => doc._id !== documentId))
      }
    }

    Object.entries(socketEventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    return () => {
      if (connected && dealId) {
        leaveDealRoom(dealId)
      }
      Object.keys(socketEventHandlers).forEach(event => {
        socket.off(event)
      })
    }
  }, [socket, connected, dealId, joinDealRoom, leaveDealRoom, user._id])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    sendMessage(dealId, newMessage)
    setNewMessage("")
    clearTypingTimeout()
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    
    if (!typingTimeoutRef.current) {
      startTyping(dealId)
    } else {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(dealId)
      typingTimeoutRef.current = null
    }, 3000)
  }

  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      stopTyping(dealId)
      typingTimeoutRef.current = null
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${API_URL}/api/deals/${dealId}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      console.error("Error updating deal status:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
            <div>
              <p className="font-medium text-red-700">{error || "Deal not found"}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate("/dashboard")} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const statusStyles = {
    "pending": "bg-amber-100 text-amber-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800"
  }

  const statusIcons = {
    "pending": "fas fa-clock",
    "in-progress": "fas fa-spinner animate-spin",
    "completed": "fas fa-check-circle",
    "cancelled": "fas fa-times-circle"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button 
        onClick={() => navigate("/dashboard")} 
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Deal Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[deal.status]}`}>
                <i className={`${statusIcons[deal.status]} mr-1`}></i>
                {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{deal.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Participants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Buyer</div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="font-medium text-gray-900">{deal.buyer.name}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Seller</div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="font-medium text-gray-900">
                      {deal.seller ? deal.seller.name : "Not assigned"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PriceNegotiation 
              deal={deal} 
              priceHistory={priceHistory} 
              onPriceUpdate={(newPrice) => console.log("Price updated:", newPrice)}
            />

            {/* Deal Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              {deal.status === "pending" && user.role === "seller" && (
                <button 
                  onClick={() => handleStatusChange("in-progress")} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <i className="fas fa-handshake mr-2"></i> Accept Deal
                </button>
              )}

              {deal.status === "pending" && (
                <button 
                  onClick={() => handleStatusChange("cancelled")} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <i className="fas fa-times-circle mr-2"></i> Cancel Deal
                </button>
              )}

              {deal.status === "in-progress" && (
                <button 
                  onClick={() => handleStatusChange("completed")} 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <i className="fas fa-check-circle mr-2"></i> Complete Deal
                </button>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
            <DocumentUpload dealId={dealId} onUploadSuccess={(doc) => setDocuments(prev => [...prev, doc])} />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
              <DocumentList 
                documents={documents} 
                dealId={dealId} 
                onDelete={(docId) => setDocuments(prev => prev.filter(d => d._id !== docId))} 
              />
            </div>
          </div>
        </div>

        {/* Right Column - Chat Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-180px)] lg:h-[80vh]">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="fas fa-comments text-4xl mb-2"></i>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message._id} message={message} />
                ))}
                {isTyping && <TypingIndicator user={typingUser} />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form 
            onSubmit={handleSendMessage} 
            className="border-t border-gray-200 p-4"
            disabled={["completed", "cancelled"].includes(deal.status)}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Type a message..."
                disabled={["completed", "cancelled"].includes(deal.status)}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || ["completed", "cancelled"].includes(deal.status)}
                className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DealRoom