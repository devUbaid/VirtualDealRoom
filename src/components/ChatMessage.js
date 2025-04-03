"use client"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "../context/AuthContext"

const ChatMessage = ({ message }) => {
  const { user } = useAuth()
  const isSentByCurrentUser = message.sender._id === user._id

  return (
    <div className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 ${
        isSentByCurrentUser 
          ? "bg-indigo-600 text-white rounded-br-none" 
          : "bg-gray-100 text-gray-800 rounded-bl-none"
      }`}>
        <div className="flex flex-col">
          {/* Message content */}
          <div className="text-sm md:text-base break-words">
            {message.content}
          </div>
          
          {/* Message metadata */}
          <div className={`flex justify-between items-end mt-1 text-xs ${
            isSentByCurrentUser ? "text-indigo-200" : "text-gray-500"
          }`}>
            <span className="font-medium">
              {!isSentByCurrentUser && message.sender.name}
            </span>
            <div className="flex items-center">
              <span>
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </span>
              {message.read && isSentByCurrentUser && (
                <span className="ml-1 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage