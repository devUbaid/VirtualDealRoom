"use client"

import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "../context/AuthContext"

const DealCard = ({ deal, isAvailableDeal = false }) => {
  const { user } = useAuth()

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
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Availability Badge */}
      {isAvailableDeal && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <i className="fas fa-tag mr-1 text-xs"></i> Available
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and Price */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{deal.title}</h3>
          <div className="mt-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            ${deal.price.toLocaleString()}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {deal.description.substring(0, 100)}
          {deal.description.length > 100 && "..."}
        </p>

        {/* Status and Date */}
        <div className="flex justify-between items-center mt-auto mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[deal.status]}`}>
            <i className={`${statusIcons[deal.status]} mr-1`}></i>
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1).replace('-', ' ')}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <i className="far fa-calendar-alt mr-1"></i>
            {formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Buyer Info (if available deal) */}
        {isAvailableDeal && deal.buyer && (
          <div className="mt-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-user mr-1.5 text-indigo-500"></i>
              <span className="font-medium text-gray-700">{deal.buyer.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <Link 
          to={`/deals/${deal._id}`} 
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
        >
          {isAvailableDeal ? (
            <>
              <i className="fas fa-handshake mr-2"></i> Negotiate Deal
            </>
          ) : (
            <>
              <i className="fas fa-eye mr-2"></i> View Details
            </>
          )}
        </Link>
      </div>
    </div>
  )
}

export default DealCard